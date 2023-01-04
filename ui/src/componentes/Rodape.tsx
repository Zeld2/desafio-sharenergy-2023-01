import { Container, Stack, Box, Text } from "@chakra-ui/react";

export default function Rodape() {
    return (
      <Box
        bg="gray.50"
        color="gray.700">
        <Container
          as={Stack}

          py={4}
          spacing={3}
          justify={'center'}
          align={'center'}>
        </Container>
        <Box
          borderTopWidth={1}
          borderStyle={'solid'}
          borderColor='gray.200'>
          <Container
            as={Stack}
 
            py={4}
            direction={{ base: 'column', md: 'row' }}
            spacing={4}
            justify={{ base: 'center', md: 'space-between' }}
            align={{ base: 'center', md: 'center' }}>
            <Text>© 2006 RV Solutions. Alguns direitos reservados.</Text>
          </Container>
        </Box>
      </Box>
    );
  }