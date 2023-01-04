package main
import (
	"context"
	"fmt"
	"log"
	"os"
	
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"

	"github.com/Alfrederson/sharenergy/autenticacao"
	"github.com/Alfrederson/sharenergy/clientes"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"

)

// Servidor local, pra usar do Atlas aí usa o outro endereço

// não vou usar uma dependencia só pra isso.
func ambiente(variavel string, padrao string) string{
	r := os.Getenv(variavel)
	if len(r) == 0{
		log.Printf("Variável de ambiente %12s não encontrada. Usando valor padrão.", variavel)
		return padrao
	}
	return r
}

func main() {
	var dbHost        = ambiente("MONGO_HOST", "localhost")
	var dbUsuario     = ambiente("MONGO_USER", "root")
	var dbSenha       = ambiente("MONGO_PASS", "q")
	var dbNomeBanco   = ambiente("MONGO_DB"  , "desafio-shareenergy")
	var dbPort        = ambiente("MONGO_PORT", "27017")

	log.Printf("Tentando conectar ao mongo %s:%s", dbHost, dbPort)
	var mongoURI = fmt.Sprintf("mongodb://%s:%s@%s:%s",dbUsuario,dbSenha,dbHost, dbPort)

	// Mongo
	mongoClient, err := mongo.NewClient(options.Client().ApplyURI(mongoURI))
	if err != nil{
		log.Fatal(err)
	}

	err = mongoClient.Connect(context.TODO())
	if err != nil{
		log.Println("Não consegui conectar no  servidor.")
		log.Panicln(err)
	}

	err = mongoClient.Ping(context.TODO(),nil)
	if err != nil{
		log.Println("Mongo não respondeu o ping.")
		log.Panicln(err)
	}

	// Servidor HTTP
	appFiber := fiber.New()

	// CORS porque pra desenvolver o backend vai rodar em uma porta e o frontend em outra.

	appFiber.Use(autenticacao.Autenticador)
	appFiber.Use(cors.New())

	// Registrar os serviços
	// o "autenticação" não usa o banco de dados, os argumentos estão aqui
	// só por conveniência 
	// sim, ele registra as próprias rotas autenticadas.
	// poderia ter usado uma interface no lugar? sim
	autenticacao.Usar(appFiber, mongoClient, dbNomeBanco, autenticacao.RegistrarRotas)
	clientes    .Usar(appFiber, mongoClient, dbNomeBanco, autenticacao.RegistrarRotas)

	// serve conteúdo estático
	appFiber.Static("/","./public")

	// todas as outras requests devolvem o index.html
	// como o app é um SPA e o routing é só do lado do cliente, 
	// a pessoa não vai conseguir entrar direto em /login, por exemplo.
	appFiber.Get("*", func(c *fiber.Ctx) error {
		return c.SendFile("./public/index.html")
	})	
	
	// Iniciar o servidor.
	log.Fatal( appFiber.Listen(":3000") )
}