import React, { useState } from 'react';

import api from '../api/api'
import { Cliente } from '../api/componentes/clientes';

import { Table, TableContainer } from '@chakra-ui/table';
import { Text, Heading, Box, Flex, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react';
import { DeleteIcon, EditIcon } from '@chakra-ui/icons';
import { Button } from '@chakra-ui/button';

import LayoutBasico from "../componentes/LayoutBasico";
import ModalConfirmar from '../componentes/ModalConfirmar';
import ModalCliente from '../componentes/ModalCliente';


type EstadoTelaClientes = {
    ocupado            : boolean,
    listaDeClientes    : Cliente[] | undefined,
    clienteAEditar?    : Cliente,
    clienteAExcluir?   : Cliente,
    clienteACriar?     : Cliente,
    erro?              : string
}


export default function Clientes(){

    const [estado,setEstado] = useState<EstadoTelaClientes>({
        ocupado           : false,
        listaDeClientes   : undefined
    })    

    async function obterListagem(){
        return api.clientes.obterClientes().then(
            clientes => {
                setEstado({
                    ...estado,
                    ocupado : false,
                    listaDeClientes : clientes,
                })
            }
        )
    }


    function excluirCliente(vitima:Cliente){
        if(estado.ocupado)
            return;
        setEstado({
            ...estado, 
            clienteAExcluir  : vitima
        })
    }

    function cancelarExclusao(){
        setEstado({
            ...estado,
            clienteAExcluir  :undefined
        })
    }

    async function confirmarExclusao(){
        if(estado.clienteAExcluir===undefined)
            return;
        let x = await api.clientes.apagarCliente(estado.clienteAExcluir.id!)
        console.log(x)
        // invalida a lista de clientes pra forçar o componente a pegá-la de novo
        // (já que ela vai ter sido alterada no servidor)
        setEstado({...estado, clienteAExcluir: undefined, listaDeClientes: undefined})
    }

    function editarCliente(vitima:Cliente){
        setEstado({
            ...estado,
            clienteAEditar : vitima
        })
    }

    function cancelarEdicao(){
        setEstado({
            ...estado,
            clienteAEditar : undefined
        })
    }

    async function confirmarEdicao(cliente:Cliente){
        await api.clientes.editarCliente(cliente)
        setEstado({
            ...estado,
            clienteAEditar : undefined,
            listaDeClientes: undefined
        })
    }



    function ListagemClientes():JSX.Element{
        console.log(estado.listaDeClientes)
        return(
                <TableContainer mr={3} ml={3}>
                    <Table variant="simple" size="md" >
                        <Thead>
                            <Tr>
                                <Th>Nome</Th>
                                <Th>E-mail</Th>
                                <Th>CPF</Th>
                                <Th>Telefone</Th>
                                <Th>Endereço</Th>
                                <Th></Th>
                            </Tr>
                        </Thead>            
                        <Tbody>
                        {estado.listaDeClientes?.map( cliente =>
                            <Tr key={cliente.id}>
                                <Td>{cliente.nome}</Td>
                                <Td>{cliente.email}</Td>
                                <Td>{cliente.cpf}</Td>
                                <Td>{cliente.telefone}</Td>
                                <Td>{cliente.endereco}</Td>
                                <Td>
                                    <Button variant='ghost'disabled={estado.ocupado} onClick={ () => editarCliente(cliente)  }><EditIcon/></Button>
                                    <Button variant='ghost'disabled={estado.ocupado} onClick={ () => excluirCliente(cliente)  }><DeleteIcon/></Button>
                                </Td>
                            </Tr>
                        )}
                        </Tbody>
                    </Table>
                </TableContainer>
        )
    }

    function ConfirmacaoExclusao():JSX.Element{
        if(!estado.clienteAExcluir)
            return (<></>);

        return(
            <ModalConfirmar
                titulo="Tem certeza que quer apagar o cliente?"
                aberto
                onConfirm={confirmarExclusao}
                onCancel ={cancelarExclusao}
            >
                <p>Tem certeza que quer apagar o registro de <b>{estado.clienteAExcluir?.nome}</b>?</p>
                <p>Esta ação está sendo monitorada e as autoridades responsáveis serão notificadas..</p>
            </ModalConfirmar>
        )
    }

    function EdicaoCliente():JSX.Element{
        if(!estado.clienteAEditar)
            return (<></>);

        return(
            <ModalCliente 
                titulo="Editando cliente"
                cliente={estado.clienteAEditar!}
                erro   ={estado.erro}
                onConfirmar={confirmarEdicao}
                onCancelar ={cancelarEdicao}
            />
        )
    }

    function cancelarCriacao(){
        setEstado({
            ...estado,
            erro:undefined,
            clienteACriar:undefined
        })
    }
    async function confirmarCriacao(cliente:Cliente){
        api.clientes.criarCliente(cliente)
        .then( resposta =>{
            if(resposta.id){
                setEstado({
                    ...estado,
                    clienteACriar: undefined,
                    erro:undefined,
                    listaDeClientes: undefined
                })    
            }
            if(resposta.err){
                setEstado({
                    ...estado,
                    erro : resposta.err,
                    clienteACriar: cliente
                })
            }
        })
    }
    function criarCliente(){
        setEstado({...estado, clienteACriar : { nome : "", email : ""}, erro:undefined})
    }
    function CriacaoCliente():JSX.Element{
        if(!estado.clienteACriar){
            return <></>
        }
        return(
            <ModalCliente
                titulo="Criando cliente"
                cliente={estado.clienteACriar}
                erro   ={estado.erro}
                onConfirmar={confirmarCriacao}
                onCancelar ={cancelarCriacao}
            />
        )
    }
    
    // na primeira exibição...
    if(!estado.listaDeClientes && !estado.ocupado){
        obterListagem()
    }
    return(
        <LayoutBasico>
            <ConfirmacaoExclusao/>
            <EdicaoCliente/>
            <CriacaoCliente/>
            <Box ml={6} mb={3} minW="100vw">
                <Heading as='h5' size='sm'>
                    Lista de clientes muito importante e secreta.
                </Heading>
            </Box>
            <Flex ml={6}>
                <Button onClick={criarCliente} disabled={estado.ocupado}>Cadastrar cliente</Button>
            </Flex>

            <ListagemClientes/>
        </LayoutBasico>
    )
}