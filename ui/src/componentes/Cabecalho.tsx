import { CloseIcon, HamburgerIcon } from "@chakra-ui/icons"
import { useDisclosure, Flex, Text, Box, IconButton, HStack, Stack, Button } from "@chakra-ui/react"
import { Link, useNavigate } from "react-router-dom"
import api from "../api/api"
import { CaminhoPagina, caminhos } from "../caminhos"

function NavLink(link: CaminhoPagina) {
    return (
        <Link key={link.path} to={link.path}>
            <Text>{link.titulo}</Text>
        </Link>
    )
}

function NavLinks() {
    return (
        <>{caminhos.filter(caminho => caminho.titulo).map(caminho => NavLink(caminho))}</>
    )
}

export default function Navegacao() {
    // logout
    const navigate = useNavigate();
    function logoff(){
        api.autenticacao.logoff();
        navigate("/login");
    }
    // hook maneiro do chakra
    const { isOpen, onOpen, onClose } = useDisclosure()
    return (
        <Box bg='gray.300' px={4} as="header" position="fixed" zIndex={3} top={0} width='100vw' boxShadow='md'>
            <Flex h={16} alignItems='center' maxWidth="6xl"  justifyContent='space-between' ml='auto' mr='auto' >
                <IconButton
                    size='md'
                    icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
                    display={{ md: 'none' }}
                    aria-label={"Abrir o menu"}
                    onClick={isOpen ? onClose : onOpen}
                />
                <HStack spacing={8} alignItems='center'>
                    <Box><b>RV System 2006</b></Box>
                    <HStack
                        as={'nav'}
                        spacing={4}
                        display={{ base: 'none', md: 'flex' }}>
                        <NavLinks />
                    </HStack>
                </HStack>
                <Flex alignItems={'center'}>
                    <Button
                        variant='solid'
                        size='md'
                        mr={4}
                        onClick={logoff}
                    >Sair</Button>
                </Flex>
            </Flex>
            {isOpen ? (
                <Box pb={4} display={{ md: 'none' }}>
                    <Stack as={'nav'} spacing={4}>
                        <NavLinks />
                    </Stack>
                </Box>
            ) : undefined }
        </Box>
    )
}