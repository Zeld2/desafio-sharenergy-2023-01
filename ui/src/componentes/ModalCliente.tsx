import { Button, FormControl, FormLabel, Input, Text, ModalBody, ModalFooter, Progress } from "@chakra-ui/react";
import JanelaModal from "./JanelaModal";

import { Cliente } from "../api/componentes/clientes"
import { useState } from "react";

export default function ModalCliente(
    props : {
        titulo      : string,
        erro?       : string,
        cliente     : Cliente,
        onConfirmar : (arg0: Cliente) => void,
        onCancelar  : () => void
    }
){
    const [aguardando, setAguardando] = useState(false)

    // não estou validando nada porque está fora do escopo.
    function confirmar(e: React.FormEvent<HTMLFormElement>){
        e.preventDefault();
        setAguardando(true)
        const {nome,email,cpf,telefone,endereco} = document.forms[0]
        props.onConfirmar({
            id  : props.cliente.id,
            nome : nome.value,
            email: email.value,
            cpf  : cpf.value,
            telefone: telefone.value,
            endereco: endereco.value
        })
    }

    // em Svelte, isso seria apenas bind:value={cliente.nome}
    return(
        <JanelaModal aberto titulo={props.titulo}>
        <ModalBody>
            {props.erro && <Text variant="md">{props.erro}</Text>}
            <form onSubmit={confirmar}>
                <FormControl mb={1}>
                    <FormLabel>Nome</FormLabel>
                    <Input type="text" name="nome" defaultValue={props.cliente.nome} disabled={aguardando} isRequired/>
                </FormControl>
                <FormControl mb={1}>
                    <FormLabel>E-mail</FormLabel>
                    <Input type="email" name="email" defaultValue={props.cliente.email} disabled={aguardando} isRequired/>
                </FormControl>

                <FormControl mb={1}>
                    <FormLabel>CPF</FormLabel>
                    <Input type="text" name="cpf" defaultValue={props.cliente.cpf} disabled={aguardando}></Input>
                </FormControl>
                <FormControl mb={1}>
                    <FormLabel>Telefone</FormLabel>
                    <Input type="text" name="telefone" defaultValue={props.cliente.telefone} disabled={aguardando}></Input>
                </FormControl>
                <FormControl mb={1}>
                    <FormLabel>Endereço</FormLabel>
                    <Input type="text" name="endereco"  defaultValue={props.cliente.endereco} disabled={aguardando}></Input>
                </FormControl>
                {aguardando && <Progress size="xs" isIndeterminate mt="3"/>}
            
            <ModalFooter mt="3">
                
                <Button variant='ghost' mr={3} onClick={props.onCancelar} disabled={aguardando}>Cancelar</Button>
                <Button colorScheme='blue' type="submit" disabled={aguardando}>Confirmar</Button>
            </ModalFooter>
            </form>
        </ModalBody>
        </JanelaModal>    
    )
}
