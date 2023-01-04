import { Button, Flex, FormControl, FormLabel, Input, InputGroup, InputLeftAddon, InputRightAddon } from "@chakra-ui/react";
import { useState } from "react";
import LayoutBasico from "../componentes/LayoutBasico";

function FiguraGato(props:{status: string}){
    return(
        <img className="figura-gato" src={`https://http.cat/${props.status}.jpg`}/>
    )
}

export default function Gatos(){
    let numeroArmazenado = sessionStorage.getItem("numeroGato") ?? "200"
    // em Svelte, isso é apenas let status = 200
    const [numeroGato,setNumeroGato] = useState(numeroArmazenado)
    function obterGatito(ev: React.FormEvent<HTMLFormElement>){
        ev.preventDefault()
        // sim, eu usei esse cheatcode nesse negócio inteiro
        // quando a gente usa um handler dentro do input, a gente acaba
        // gerando um ciclo infinito de re-renderizações
        const {numero} = document.forms[0]
        sessionStorage.setItem("numeroGato",numero.value)
        setNumeroGato(numero.value)
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
                <form onSubmit={obterGatito}>
                <InputGroup mb={3}>
                    <Input type="number" name="numero" defaultValue={numeroGato} placeholder="Digite um status code (ex: 403)"></Input>
                    <InputRightAddon><Button type="submit" variant="ghost">Obter gatito</Button></InputRightAddon >
                </InputGroup>
                </form>
                <FiguraGato status={numeroGato}/>
            </Flex>
        </LayoutBasico>
    )
}