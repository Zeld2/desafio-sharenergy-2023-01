type FetchOptions = {
    path : string,
    method : string,
    body? : Record<string,string>
}

const server = {
    BASE_URL : import.meta.env.DEV ? "http://127.0.0.1:3000" : "",
    // a gente sempre vai mandar o token de autenticação.
    async req(options:FetchOptions){
        let headers = new Headers();
        let tokenAutorizacao = localStorage.getItem("auth_token") ?? sessionStorage.getItem("auth_token")
        if (tokenAutorizacao){
            headers.append("Authorization", "Bearer "+tokenAutorizacao);
        }
        if(options.body){
            headers.append("Content-Type", "application/x-www-form-urlencoded");    
        }
        // pra dar timeout
        const controller = new AbortController();
        const timeoutTimer = setTimeout(() => controller.abort(), 2000) 

        let requestOptions:RequestInit = {
            method  : options.method,
            headers : headers,
            signal  : controller.signal
        }
        // NOTA: Get não pode ter urlencodedbody.        
        if(options.body){
            let urlEncodedBody = new URLSearchParams();
            Object.entries(options.body).forEach ( ([chave,valor]) =>{
                if(valor) urlEncodedBody.append(chave, valor)
            })
            requestOptions.body = urlEncodedBody
        }
        
        let r = await fetch(this.BASE_URL + options.path, requestOptions)
        clearTimeout(timeoutTimer)
        return r
    }
}

export default server