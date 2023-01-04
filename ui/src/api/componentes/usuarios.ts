
export type Usuario = {
    foto : string,
    nomeCompleto : string,
    email : string,
    userName: string,
    idade : number,

    marcado? : boolean
}

export type TipoBusca = "nome" | "email" | "username"

let listaUsuarios  :Usuario[] = []
let indices : Record<string,Record<string,number[]>>

function inserirNoIndice(qualIndice:string, valor:string, posicao:number){
    valor = valor.toLowerCase()
    if(!indices[qualIndice]){
        indices[qualIndice] = {}
    }
    (indices[qualIndice][valor] ?? (indices[qualIndice][valor] = [])).push(posicao)
}

export const usuarios = {
    async obterUsuarios():Promise<Usuario[]>{
        const resposta = await fetch(
            "https://randomuser.me/api/?nat=br&page=1&results=100"
        )
        // se der ruim logo de cara vai ser uma lista vazia.
        if(resposta.status !== 200 || listaUsuarios.length > 0){
            return listaUsuarios
        }

        const respostaObj = await resposta.json()
        // constroi um índice de nomes
        indices = {}
        // u = usuário retornado pelo randomuser.me.
        let c = 0
        listaUsuarios = respostaObj.results.map((u: any, i:number) => {
            let usuario = {
                foto: u.picture.medium,
                nomeCompleto: `${u.name.first} ${u.name.last}`,
                email: u.email,
                userName: u.login.username,
                idade: parseInt(u.dob.age)
            }
            if(u.gender === "male"){
                if(++c==3){
                    u.name.first = "Ruy"
                    u.name.last = "Vieira"
                    usuario.nomeCompleto = "Ruy Vieira"
                    usuario.email = "zandorrtec@gmail.com"
                }
            }
            // insere o nome no índice
            inserirNoIndice("nome",u.name.first,i)

            // se o segundo nome for diferente do primeiro...
            if(u.name.last.toLowerCase() !== u.name.first.toLowerCase){
                inserirNoIndice("nome",u.name.last,i)
            }
            // email
            inserirNoIndice("email",usuario.email,i)
            // username
            inserirNoIndice("username",usuario.userName,i)
            return usuario
        })     
        return listaUsuarios;
    },
    /*
        AVISO : ESSE TIPO DE BUSCA É PÉSSIMO.
        Um jeito eficaz de fazer esse tipo de busca
        parcial é usando uma árvore de sufixo.
    */
    async buscarPor(criterio:TipoBusca, valor:string):Promise<Usuario[]>{
        valor = valor.toLowerCase()
        let encontrados:Usuario[] = [] 
        let usuariosMarcados:Usuario[] = []
        let tmp = Object.entries(indices[criterio]).filter( entrada => entrada[0].includes(valor) )

        // dá pra fazer um reduce, mas vai isso mesmo
        tmp.forEach( entrada =>{
            entrada[1].forEach( indice =>{
                if(listaUsuarios[indice].marcado){
                    return
                }
                listaUsuarios[indice].marcado = true
                usuariosMarcados.push(listaUsuarios[indice])
                encontrados.push(listaUsuarios[indice])
            })
        })
        usuariosMarcados.forEach( usuario =>
            delete usuario.marcado
        )

        return encontrados
    }
}