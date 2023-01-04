// minha api

import api from "../api/api"

// router pra poder redirecionar
import { useNavigate } from "react-router-dom";
import React, {useState} from 'react';

import { Box, Button, Checkbox, CircularProgress, Flex, FormControl, FormLabel, Heading, Input, Progress, Stack, Text } from "@chakra-ui/react";
import { RespostaLogin } from "../api/componentes/autenticacao";


type EstadoTelaLogin = {
    logando: boolean,
    erros  : String[]
}

export default function Login() {

    const [estado,setEstado] = useState<EstadoTelaLogin>({
        logando : false,
        erros    : []
    })
    
    const navigate = useNavigate();

    // se a pessoa já está logada, eu redireciono para a home.

    // fluxo de login é o seguinte:
    // - quando eu clico no botãozinho, eu mudo o meu estado e chamo uma função (que no caso é uma promise).
    // - quando aquela função retorna, eu vou ou avisar que deu errado, ou redirecionar pra outra tela
    // - essa outra tela pode ser ou a tela home (www.blabla.com/), ou a tela que a pessoa estava
    //   tentando acessar sem estar logada (www.blablabla.com/cachorros) 
    function handleSubmit(e: React.FormEvent<HTMLFormElement>){
        e.preventDefault()
        // já estou logando, então não faço nada.
        if(estado.logando){
            return;
        }
        const { username, password, remember} = document.forms[0]
        setEstado({...estado, logando:true, erros: []})
        // trapacinha
        
        api.autenticacao.login({username: username.value, password  : password.value }, remember.checked )
        .then( (resposta:RespostaLogin) =>{
            // o login sempre manda uma mensagem de erro quando falha.
            if(resposta.err){
                setEstado({erros:[resposta.err] , logando : false})
                return
            }
            // o servidor pode não responder nada, então nesse caso a gente simplesmente
            // manda o usuário dar F5.
            if(resposta.tok){
                setEstado({erros: [], logando : false})
                navigate("/")
            }

        }).catch ( (reason) =>{
            let erros:String[] = []
            switch(reason.name){
                case "AbortError":
                    erros.push("O servidor demorou demais para responder.")
                    erros.push("Ele provavelmente não está nem ligado.")
                break;
                default:
                    erros.push(reason.name +" "+reason.message)
            }
            setEstado({erros : erros, logando: false})
        })
    }


  return (
    <Flex
        minH='100vh'
        align='center'
        justify='center'
        bg='gray.200'
    >

        <Stack spacing={8} mx='auto' width='lg' py={12} px={6}>
            <Stack align='center'>
                <Heading fontSize='4xl'>Login</Heading>
            </Stack>
            <Box
                rounded='lg'
                bg='white'
                boxShadow='lg'
                p={8}>
                <form onSubmit={handleSubmit}>
                    <Stack  spacing={4}>
                        <Heading fontSize='md'>
                            {estado.erros.map( (erro,i) => <p key={"erro_"+i}>{erro}</p>)}
                        </Heading>
                        <FormControl isRequired isDisabled={estado.logando}>
                            <FormLabel>Usuário</FormLabel>
                            <Input type="text" name="username"></Input>
                        </FormControl>
                        <FormControl isRequired isDisabled={estado.logando}>
                            <FormLabel>Senha</FormLabel>
                            <Input type="password" name="password"></Input>
                        </FormControl>
                        <Checkbox name="remember" isDisabled={estado.logando}>Permanecer logado?</Checkbox>               
                        <Button type="submit" isLoading={estado.logando} isDisabled={estado.logando}>Logar</Button>      
                    </Stack>
                </form>
            </Box>
        </Stack>
    </Flex>
  )
}
