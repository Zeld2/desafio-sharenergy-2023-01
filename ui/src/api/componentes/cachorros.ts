
// com typescript sempre tem a dúvida a respeito de a gente
// estar fazendo a coisa certa ou não.
// a resposta normalmente é não e aqui esse é o caso.
// export type NenhumCachorro = {}

export type Cachorro = {
    fileSizeBytes : number,
    url : string,
} | undefined


export const cachorros = {
    // a pegadinha é que isso também pode dar um cachorro animado
    obterCachorro():Promise<Cachorro> {
        return fetch(
            "https://random.dog/woof.json"
        ).then( response =>{
            return response.json()
        })
    }
}

