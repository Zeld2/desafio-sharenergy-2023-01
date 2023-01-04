package autenticacao

import(
	"strings"
	"errors"
	"log"
	"github.com/gofiber/fiber/v2"
	"go.mongodb.org/mongo-driver/mongo"
)

// Um esquema bem básico pra proteger algumas
// rota com autenticação.
// o ideal é cada ação/rota exija um conjunto de permissões,
// e que cada usuário tenha seu conjunto de permissões.
// ex: um usuário poderia ter permissão pra ler,
//     um administrador teria permissões pra ler e escrever

// no caso um usuário autentiado pode tudo, 
// e um usuário não-autenticado pode ver só a
// tela de login.
// isso foi escolhido pela expediência.

// esse esquema simplificado se aplica a todos os métodos.

type HeaderAutenticacao struct {
	Authorization string `json:"Authorization"`
}

type Credenciais struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

type RespostaLogin struct {
	Msg string `json:"msg"`
	Err string `json:"err,omitempty"`
	Tok string `json:"tok,omitempty"`
}

type RespostaAutorizacao struct {
	Err string `json:"err,omitempty"`
}

const tokenLegitimo = "{FINGE QUE ISSO E UM TOKEN JWT}"

// Pode ser dito que é melhor assumir que todas as rotas são autenticadas e apenas algumas
// não exigem autenticação, mas fiz ao contrário e tatu do bem
var rotasAutenticadas = map[string]bool{} 
var fiberApp *fiber.App

func RegistrarRotas( rotas []string){
	for _, rota := range rotas{
		rotasAutenticadas[rota] = true
	}
}

func extrairToken(c *fiber.Ctx) (string, error) {
	var header HeaderAutenticacao
	err := c.ReqHeaderParser(&header)
	if err != nil{
		return "" , err
	}
	str := header.Authorization
	if !strings.HasPrefix(str,"Bearer"){
		return "", errors.New("Não autorizado.")
	}
	token := str[7:len(str)]
	if token != tokenLegitimo {
		return "", errors.New("Token falsificado.")
	}
	return token, nil
}

func Autenticador(c *fiber.Ctx) error{
	
	c.Next()
	caminho := c.Route().Path
	log.Printf("%6s %s", c.Method(), c.Path())
	// se a rota não está no mapa de rotas autenticadas, deixa passar
	_, presente := rotasAutenticadas[caminho]
	if !presente {
		return nil
	}
	// se estiver, checa a identidade antes de passar.
	_, err := extrairToken(c)
	
	if err != nil{
		return c.Status(403).JSON(RespostaAutorizacao{Err: err.Error()})
	}
	

	return nil
}

// login
func Login(c *fiber.Ctx) error{
	var credenciais Credenciais
	err := c.BodyParser(&credenciais)
	// posso estar dando informação demais para um hackerman
	if err != nil {
		log.Print("Erro em Login: "+err.Error())
		return c.Status(500).JSON(RespostaLogin{Msg : "Erro processando a requisição.", Err : "Sem credenciais."})
	}
	if !(credenciais.Username == "desafiosharenergy" && credenciais.Password == "sh@r3n3rgy") {
		return c.Status(403).JSON(RespostaLogin{Msg : "Erro processando a requisição.", Err : "Credenciais inválidas."})	
	}
	// o certo a fazer aqui é gerar um token identificando o usuário, a qual grupo de usuários ele pertence, 
	// quais autorizações ele tem, etc.
	// aqui PODE SER UTILIZADO JWT, OAuth2, ou qualquer um de um grande número de esquemas.
	// a vantagem desse tipo de token é o fato de facilitar a construção de um backend serverless, sem sessão, etc.
	// a desvantagem são algumas fragilidades de segurança.
	token := tokenLegitimo
	return c.Status(200).JSON(RespostaLogin{Msg : "Sucesso!", Tok : token})
}

// renew
func Renew(c *fiber.Ctx) error{
	// essa é uma rota autenticada, então a requisição passa pelo middleware Autenticador
	// antes de ser devolvida.
	// isso é usado para o frontend checar se a pessoa está logada.
	return c.Status(200).JSON(RespostaLogin{Msg : "Token renovado!", Tok : tokenLegitimo})
}
// logout
// não faz nada.
// tem gente que propõe que o token seja colocado em uma lista de tokens invalidados,
// mas em serverless isso acaba sendo inconveniente pela necessidade de colocar uma
// consulta em um banco de dados antes de TODAS as outras consultas
// daria pra pensar em um esquema com um cache pequeno de uns 16 mb e isso pensando
// em uma base de usuários pequena. problema ainda não resolvido no que se refere a JWT.

func Logoff(c *fiber.Ctx) error{
	// às vezes é o caso de logar todas as ações, mas não é o caso.
	// log.Println("Usuário fez logoff")
	return c.Status(200).JSON(RespostaLogin{Msg : "Simplesmente apague seu token."})
}

func Usar(app *fiber.App, _client *mongo.Client, dbname string, registrador func(rotas []string)){
	app.Post("/user/login", Login)
	app.Get ("/user/renew", Renew)
	app.Get ("/user/logoff",Logoff)

	registrador([]string{"/user/renew"})

	fiberApp = app
}