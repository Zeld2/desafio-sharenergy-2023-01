import server from "./server"

export type Cliente = {
    id?       : string,
    nome      : string,
    email     : string,
    telefone? : string,
    endereco? : string,
    cpf?      : string
}

export type RespostaApiCliente = {
    msg?      : string,
    err?      : string,
    id ?      : string
}

// Aqui a gente poderia pensar em alguma forma de armazenar
// os últimos valores da consulta
// mas se pensar que outra pessoa pode estar fazendo transações
// que alterem o banco de dados a complexidade aumenta um bocado
// então isso vai ficar de fora nessa demonstração.
export const clientes = {
    // ações de criação, alteração ou deleção invalidam o cache.
    async obterClientes():Promise<Cliente[]> {
        const response = await server.req({
            method: "GET",
            path: "/api/cliente"
        })
        if (response.status == 200){
            return await response.json()
        }
        return []
    },
    async obterCliente(clienteId:string):Promise<RespostaApiCliente>{
        // busca linear em poucos elementos ainda é mais rápida do que
        // fazer uma requisição no servidor.
        const response = await server.req({
            method: "GET",
            path: "/api/cliente/" + clienteId
        })
        return await response.json()
    },
    async criarCliente(cliente:Cliente):Promise<RespostaApiCliente>{
        const response = await server.req({
            method: "POST",
            path: "/api/cliente",
            body: cliente
        })
        return await response.json()
    },
    async apagarCliente(clienteId:String):Promise<RespostaApiCliente>{
        const response = await server.req({
            method: "DELETE",
            path  : "/api/cliente/"+clienteId
        })
        return await response.json()
    },
    async editarCliente(cliente:Cliente):Promise<RespostaApiCliente>{
        const response = await server.req({
            method: "PUT",
            path: "/api/cliente/"+cliente.id,
            body: cliente
        })
        return await response.json()

    }
}