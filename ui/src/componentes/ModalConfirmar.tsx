import { Button, ModalBody, ModalFooter, ModalHeader } from "@chakra-ui/react";
import { ReactNode, useState } from "react";
import JanelaModal from "./JanelaModal";
export default function ModalConfirmar(
        props:{
            titulo: string,
            aberto: boolean,
            onConfirm?: ()=> void,
            onCancel? : ()=> void,
            children: ReactNode
        }
){
    

    const confirmar = () =>{
        props.onConfirm!();
    }

    const cancelar = () =>{
        props.onCancel!();
    }
    
    return(
        <JanelaModal
            titulo={props.titulo}
            aberto={props.aberto}
        >
            <ModalBody>
                {props.children}
            </ModalBody>
            <ModalFooter>
                <Button colorScheme='blue' mr={3} onClick={cancelar}>Não</Button>
                <Button variant='ghost' onClick={confirmar}>Sim</Button>
            </ModalFooter>
        </JanelaModal>
    ) 
}