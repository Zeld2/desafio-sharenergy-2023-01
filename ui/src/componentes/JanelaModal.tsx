import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from "@chakra-ui/react";

export default function JanelaModal(props : {aberto: boolean, titulo: string, children: React.ReactNode}){
    return(
        <Modal isOpen={props.aberto} onClose={()=>{}}>
            <ModalOverlay>
                <ModalContent>
                    <ModalHeader>{props.titulo}</ModalHeader>
                    {props.children}
                </ModalContent>
            </ModalOverlay>
        </Modal>
    )
}