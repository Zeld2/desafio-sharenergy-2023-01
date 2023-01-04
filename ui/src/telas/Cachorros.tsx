import { Box, Button, Flex } from "@chakra-ui/react"
import {  useState } from "react"
import api from "../api/api"
import { Cachorro } from "../api/componentes/cachorros"

import LayoutBasico from "../componentes/LayoutBasico"


type EstadoTelaCachorro = {
    carregando : boolean,
    cachorro   : Cachorro | undefined
}

function FiguraCachorro(props:{estado:EstadoTelaCachorro}){
     // isso evita que a tela seja re-renderizada várias vezes.
     // quando a gente muda uma coisa, a gente muda tudo de uma vez só.  
     if(!props.estado.cachorro){
        return <Box sx={{width : "600px", height : "600px"}}></Box>
     }
     let url = props.estado.cachorro?.url  
     if(url.endsWith("mp4")){
        return <video src={props.estado.cachorro?.url} width="600px" height="600px" className="figura-cachorro"/>
     }else{
        return <img src={props.estado.cachorro?.url} width="600px" height="600px" className="figura-cachorro"/>
     }
}

export default function Cachorros(){
    // usando o localStorage só pra ver o que acontece
    // como não tem orientação de ui/ux, o conjunto da 
    // obra acaba sendo bem bizarro mesmo
    let txt = localStorage.getItem("cachorro")
    let cachorroArmazenado = txt ? JSON.parse(txt) : undefined

    const [estado,setEstado] = useState<EstadoTelaCachorro>({
        carregando : false,
        cachorro   : cachorroArmazenado
    })

    const adotarCachorro = () =>{
        setEstado({
            ...estado,
            carregando: true
        })
        api.cachorros.obterCachorro().then( resposta =>{
            localStorage.setItem("cachorro",JSON.stringify(resposta))
            setEstado({
                ...estado,
                cachorro  : resposta,
                carregando: false
            })
        })
    }
    if(estado.cachorro === undefined && !estado.carregando){
        adotarCachorro()
    }
    return(
        <LayoutBasico>
            <Flex
                ml="auto"
                mr="auto"
                w={"600px"}
                maxW="90vw"
                flexFlow='column'
                mb='6'
            >
                <Button variant="ghost" mb={3} isLoading={estado.carregando} onClick={adotarCachorro}>Adotar outro cachorro</Button>
                <FiguraCachorro estado={estado} />                    
            </Flex>
        </LayoutBasico>
    )
}