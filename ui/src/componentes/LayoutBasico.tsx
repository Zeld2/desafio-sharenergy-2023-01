
import { Box } from "@chakra-ui/react";
import { ReactNode } from "react";
import Cabecalho from "./Cabecalho";
import Rodape from "./Rodape";
export default function LayoutBasico(props: { children: ReactNode }) {
    return (
        <>
            <Cabecalho/>
                <Box w="100vw" maxW="6xl" ml="auto" mr="auto" mt="6" pt={16} flexGrow={'1'}  as="main">
                    {props.children}
                </Box>
            <Rodape/>
        </>
    )
}