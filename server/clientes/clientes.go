package clientes
import (
	"context"
	"log"
	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"	
	"go.mongodb.org/mongo-driver/mongo"	
)

type Cliente struct{
	Id primitive.ObjectID  `bson:"_id,omitempty"  json:"id,omitempty"`
    Nome string            `bson:"nome"          json:"nome" validate:"required,len>3,len<50`
	Email string           `bson:"email"         json:"email" validate:"required,email"`  
    Telefone string        `bson:"telefone"      json:"telefone"`
	Endereco string        `bson:"endereco"      json:"endereco"`
	Cpf string             `bson:"cpf"           json:"cpf"`
}


type Resposta struct{
	Msg string `json:"msg"`
	Err string `json:"err,omitempty"`
	Res string `json:"res,omitempty"`
	Id  string `json:"id,omitempty"`
}

// o que a gente vai usar pra realizar todas as transações
// no banco de dados
var client     *mongo.Client     = nil
var db         *mongo.Database    = nil
var collection *mongo.Collection = nil
var validate   = validator.New()

// Cria um clientes
// POST cliente
func Criar(ctx *fiber.Ctx) error {
	var cliente Cliente

	// pega os dados da request.
	err := ctx.BodyParser(&cliente)
	if err != nil{
		log.Println(err.Error())
		return ctx.Status(400).JSON(Resposta{Msg : "Erro processando o corpo da requisição", Err: err.Error()})
	}
	// valida
	err = validate.Struct(cliente)
	if err != nil{
		
		return ctx.Status(400).JSON(Resposta{Msg : "Erro de validação", Err: err.Error()})
	}

	log.Println(cliente)
	// enfia no banco.
	result, err := collection.InsertOne(context.TODO(), cliente)
	if err != nil{
		return ctx.Status(400).JSON(Resposta{Msg : "Erro inserindo no banco de dados", Err: err.Error()})
	}

	// retorna o ID da inserção.
	return ctx.Status(200).JSON(Resposta{Msg : "Cliente criado com sucesso", Id : result.InsertedID.(primitive.ObjectID).Hex() })
}

// Lê um Cliente pelo ID
// GET cliente/id
func Ler(ctx *fiber.Ctx) error {
	// esse trecho de código que é repetido com frequência
	// eu poderia abstrair.
	id := ctx.Params("id")
	objId, err := primitive.ObjectIDFromHex(id)
	if err != nil{
		log.Print(err)
		return ctx.Status(500).JSON(Resposta{ Msg : "Id inválido.", Err : err.Error() })
	}

	// cliente pra aceitar o resultado da consulta.
	var cliente Cliente
	err = collection.FindOne(context.TODO(), bson.M{"_id" : objId}).Decode(&cliente)
	if err != nil{
		log.Print(err)
		return ctx.Status(500).JSON(Resposta{ Msg : "Erro consultando banco de dados.", Err : err.Error() })
	}

	return ctx.Status(200).JSON(cliente)
}

// Listar todos os Clientes
// isso não faz nenhum tipo de paginação mas no mongodb tem
// uma parada de pegar os N objetos que tiverem um ID maior que X.
// GET cliente
func Listar(ctx *fiber.Ctx) error{
	var clientes []Cliente
	cursor, err := collection.Find(context.TODO(),bson.M{})

	if err != nil {
		return ctx.Status(500).JSON(Resposta{Err: err.Error()})
	}

	defer cursor.Close(context.TODO())
	for cursor.Next(context.TODO()){
		var cliente Cliente
		err := cursor.Decode(&cliente)

		// normalmente quando a gente aninha
		// estuturas de controle, o código fica um lixo
		if err != nil{
			return ctx.Status(500).JSON(Resposta{Err: err.Error()})
		}

		clientes = append(clientes,cliente)
	}
	if len(clientes) == 0 {
		return ctx.Status(200).JSON([]string{})
	}
	return ctx.Status(200).JSON(clientes)
}

// Atualizar um Cliente
// PUT cliente/id
func Atualizar(ctx *fiber.Ctx) error{
	id := ctx.Params("id")
	objId, err := primitive.ObjectIDFromHex(id)
	if err != nil{
		log.Print(err)
		return ctx.Status(500).JSON(Resposta{Err : "ID Inválido."})
	}
	var cliente Cliente
	err = ctx.BodyParser(&cliente)
	if err != nil{
		log.Println(err.Error())
		return ctx.Status(400).JSON(Resposta{Err : "Erro no corpo da requisição."})
	}
	// checagem redundante.
	if objId != cliente.Id{
		return ctx.Status(400).JSON(Resposta{Err : "ID no corpo da requisição não confere como ID no parâmetro da pesquisa."})
	}
	err = validate.Struct(cliente)
	log.Println(cliente)
	if err != nil{
		return ctx.Status(400).JSON(Resposta{Err : "Erro de validação nos dados:\n"+err.Error()})
	}
	res, err := collection.UpdateOne(context.TODO(), bson.M{"_id" : objId}, bson.M{"$set" : cliente})
	if err != nil{
		return ctx.Status(400).JSON(Resposta{Err : "Erro atualizando dados:\n"+err.Error()})
	}
	if res.MatchedCount == 0 {
		return ctx.Status(400).JSON(Resposta{Err:"Não achei esse cliente: "+id})
	}

	return ctx.Status(200).JSON(Resposta{Msg : "Cliente alterado com sucesso."})
}


// Apaga um Cliente
// DELETE cliente/id
func Apagar(ctx *fiber.Ctx) error{
	id := ctx.Params("id")
	objId, err := primitive.ObjectIDFromHex(id)
	if err != nil{
		return ctx.Status(500).JSON(Resposta{Err : "ID Inválido."})
	}
	resultado, err := collection.DeleteOne(context.TODO(),bson.M{"_id" : objId})
	if err != nil{
		return ctx.Status(500).JSON(Resposta{Err : err.Error()})
	}
	return ctx.Status(200).JSON(resultado)
}


// Registra todas as operações em um app do go fiber e quais rotas exigem autenticação.
func Usar(app *fiber.App, _client *mongo.Client, dbname string, registrador func(rotas []string)){

	client     = _client
	db         = client.Database(dbname)
	collection = db.Collection("clientes")

	app.Post  ("/api/cliente"         , Criar)
	app.Get   ("/api/cliente/:id"     , Ler)
	app.Get   ("/api/cliente"         , Listar)
	app.Put   ("/api/cliente/:id"     , Atualizar)
	app.Delete("/api/cliente/:id"     , Apagar)
	log.Print ("Sistema de Clientes atrelado.")

	// todas as requisições que começarem com /cliente vão exigir o token de autenticação.
	registrador([]string{"/api/cliente","/api/cliente/:id"})
}
