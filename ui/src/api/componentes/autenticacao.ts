import server from "./server"

export type DadosLogin = {
    username:string,
    password:string
}

export type RespostaLogin = {
    msg?: string,
    tok?: string,
    err?: string
}

export const autenticacao = {
    /**
     * Tenta fazer login. Retorna uma promise.
     * @param dados um objeto com "usuario" e "senha"
     */
    login(dados:DadosLogin, manterLogado:boolean){
        return server.req({
            path   : "/user/login",
            method : "POST",
            body   : dados
        }).then( resposta =>{
            return resposta.json()
        }).then ( (dados:RespostaLogin) =>{
            if(dados.tok){
                (manterLogado ? localStorage : sessionStorage).setItem("auth_token", dados.tok)
            }
            return dados
        })
    },
    /**
     * Deleta o token.
     */
    logoff(){
        sessionStorage.removeItem("auth_token")
        localStorage.removeItem("auth_token")
    },
    /**
     * Checa se tem um token de autenticação.
     * Se tiver, valida ele no servidor.
     * Se o token estiver válido, o servidor devolve um token
     * com expiração no futuro.
     * Se não, espero que mostre a tela de login.
     * 
     * @returns se está logado ou não.
     */
    checaSeEstaLogado():Promise<boolean>{
        return new Promise<boolean>( (resolve: (logado: boolean) => void, reject)=>{
            // não tem o token, não tenho nem o que mandar pro servidor.

            let storage = null
            if(sessionStorage.getItem("auth_token")){
                storage = sessionStorage
            }
            if(localStorage.getItem("auth_token")){
                storage = localStorage
            }

            if(!storage){
                resolve(false)
            }

            return server.req({
                path : "/user/renew",
                method: "GET"
            }).then( (resposta) =>{
                return resposta.json()
            }).then( (dados:RespostaLogin) =>{
                if(dados.err){
                    console.log(dados.err)
                }
                if(dados.tok){
                    resolve(true)
                }{
                    resolve(false)
                }
            })

        })
    }
}