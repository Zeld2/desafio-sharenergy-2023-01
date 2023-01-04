import { ArrowLeftIcon, ArrowRightIcon } from "@chakra-ui/icons"
import { Avatar, Box, Text, Button, FormControl, FormLabel, Input, Table, TableContainer, Tbody, Td, Th, Thead, Tr, Card, CardBody } from "@chakra-ui/react"
import { useState } from "react"
import api from "../api/api"
import { TipoBusca, Usuario, usuarios } from "../api/componentes/usuarios"
import LayoutBasico from "../componentes/LayoutBasico"

type EstadoTelaUsuarios = {
    carregando: boolean,
    delayBusca: number | undefined,
    usuarios: Usuario[] | undefined
}


function ListagemUsuarios(props: { usuarios: Usuario[], porPagina: number }): JSX.Element {
    // listagem vazia
    const [pagina, setPagina] = useState(0)
    const totalPaginas = Math.ceil(props.usuarios.length / props.porPagina)
    function avanca() {
        if (pagina == totalPaginas)
            return;
        setPagina(pagina + 1)
    }
    function retrocede() {
        if (pagina == 0)
            return;
        setPagina(pagina - 1)
    }
    // renderizando componente depois de eu ter navegado até o final da tabela.
    // sim, é gambiarra, mas não quero usar biblioteca de tabela agora.
    if (pagina > totalPaginas) {
        setPagina(0)
        return (<></>)
    }
    return (
        <TableContainer mr={3} ml={3}>
            <Table variant="simple" size="md" >
                <Thead>
                    <Tr>
                        <Th></Th>
                        <Th>Nome</Th>
                        <Th>E-mail</Th>
                        <Th>Usuário</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {props.usuarios
                        .filter(
                            (u, i) => i >= (pagina * props.porPagina) && i < (pagina + 1) * props.porPagina
                        ).map((usuario: Usuario, i) =>
                            <Tr key={"linha_" + i}>
                                <Td sx={{ textAlign: "center" }}><Avatar src={usuario.foto} name={usuario.nomeCompleto} /></Td>
                                <Td>{usuario.nomeCompleto}</Td>
                                <Td>{usuario.email}</Td>
                                <Td>{usuario.userName}</Td>
                            </Tr>
                        )}
                </Tbody>
            </Table>
            <Box mr={3} ml={6} mb={6}>
                <Text fontSize='sm'>Página {pagina + 1}/{totalPaginas}. Total: {props.usuarios.length} registros</Text>
                <Button size="xs" onClick={retrocede} disabled={pagina <= 0}>
                    <ArrowLeftIcon />
                </Button>
                <Button size="xs" mr={3} onClick={avanca} disabled={pagina >= totalPaginas - 1}>
                    <ArrowRightIcon />
                </Button>
            </Box>
        </TableContainer>
    )
}


function Home() {
    const [estado, setEstado] = useState<EstadoTelaUsuarios>({
        carregando: false,
        usuarios: undefined,
        delayBusca: undefined
    })


    const realizarBusca = async (tipo: TipoBusca, valor: string) => {
        let usuarios: Usuario[] = await api.usuarios.buscarPor(tipo, valor)
        setEstado({
            ...estado,
            usuarios: usuarios
        })
    }

    const iniciarBusca = (tipo: TipoBusca, valor: string) => {
        // cancela a busca que estiver agendada
        clearTimeout(estado.delayBusca)
        // agenda uma nova
        // o delay é pra não fazer uma busca a cada
        // alteração que o input tiver.
        let timerId = setTimeout(() => {
            realizarBusca(tipo, valor)
        }, 50)
        setEstado({
            ...estado,
            delayBusca: timerId
        })
    }

    if (estado.usuarios === undefined && !estado.carregando) {
        setEstado({
            ...estado,
            carregando: true,
        })
        api.usuarios.obterUsuarios().then(usuarios => {
            setEstado({
                ...estado,
                carregando: false,
                usuarios: usuarios
            })
        })
    }

    return (
        <LayoutBasico>
            <Card mr="auto" ml="auto" maxW="lg">
                <CardBody>
                    <Box mb={3} >
                        <FormControl mb={1}>
                            <FormLabel>Buscar por nome:</FormLabel>
                            <Input type="text" onChange={(ev) => iniciarBusca("nome", ev.target.value)}></Input>
                        </FormControl>
                        <FormControl mb={1}>
                            <FormLabel>Buscar por e-mail:</FormLabel>
                            <Input type="text" onChange={(ev) => iniciarBusca("email", ev.target.value)}></Input>
                        </FormControl>
                        <FormControl mb={1}>
                            <FormLabel>Buscar por nome de usuário:</FormLabel>
                            <Input type="text" onChange={(ev) => iniciarBusca("username", ev.target.value)}></Input>
                        </FormControl>
                    </Box>
                </CardBody>
            </Card>
            {estado.usuarios && <ListagemUsuarios usuarios={estado.usuarios} porPagina={8} />}
        </LayoutBasico>
    )
}
export default Home
