# Sisteminha 2006

Fiz isso pensando em hospedar no Google Cloud Run.

Infelizmente, ou não tinha ou eu não fui capaz de achar uma plataforma Mongo que fosse free e eu conseguisse estabelecer comunicação com o meu backend com este estando dentro do Google Cloud (se alguém souber eu aceito a indicação).

A saída foi usar o docker composer pra fazer um sisteminha que tenha o backend e o MongoDB rodando ao mesmo tempo.

## Arquitetura da solução

Ele tem um componente frontend estático feito com o React e o Chakra Ui que foi a biblioteca mais amigável que eu achei pra usar. Cheguei a testar a MUI, mas foi só uma repetição das más experiências que eu tive usando coisas baseadas na Material UI com Svelte e Vue.

Pra desenvolver escolhi o Vite, que é uma ferramenta que permite que a gente desenvolva de maneira bem rápida.

Ele tem um componente backend escrito em Go, que também serve os arquivos estáticos do próprio frontend. O que tem de especial nisso? O container fica bem pequeno! A imagem só do backend fica com 19mb (sendo que isso pode ser reduzido até praticamente a metade tirando o busybox e outras coisas). Nele usei o gofiber, que é um framework semelhante ao Express. Se o negócio realmente fosse hospedado na nuvem, a gente conseguiria ter uma latência muito menor, um coldstart mais curto (imperceptível, em alguns testes que eu fiz) e uma vazão mais alta. 

## Como rodar?

Primeiro você clona, depois você roda o seguinte:

``./fazer``

Isso vai rodar npm build dentro do diretório ui para gerar os arquivos estáticos e depois construir o container como docker compose.

Em segundo lugar, você roda o seguinte:

``./rodar``

Isso vai apenas executar a seguinte linha: ``docker compose up``

Para desenvolver, eu tenho um terceiro script, que é esse:

``./emulador``

Isso roda o só container do mongo e o backend fora de um container. A ideia é rodar ``npm run dev`` dentro do diretório /ui e conseguir fazer as alterações iterativamente sem ter que reconstruir o container.

## O que ficou de fora?

Algumas coisas ficaram de fora desse projeto. Exemplo:

- A autenticação é só um mock. Ao invés de gerar um JWT devidamente assinado, o endpoint de login apenas envia uma string fixa e o middleware de autorização checa pela presença dessa string no cabeçalho da requisição.

- Não escolhi nenhuma metodologia boa e fácil para fazer a documentação. go-swag parece ser uma alternativa boa.

- O frontend não lida com erros.

- Qualquer status code que não seja um dos status codes oficiais vai invocar a imagem de uma gatinha com o código 404, que é o que o http.cat retorna pra qualquer status code "inválido".

- A busca de usuários na tela inicial é feita do jeito mais lento o possível, que é a busca linear. Tem como fazer busca parcial de texto usando árvore de sufixo, mas isso fica pra próxima.

- Entendi que não tinha por que fazer o backend fazer as requisições na api de cachorros, gatos e usuários aleatórios então isso ficou por conta do próprio frontend.

- Não estou validando dados dos clientes na telinha de criar clientes.

- Pode ter um monte de erros e coisas esquisitas espalhadas pelo código que eu deixei passar.

- Testes.

## Vídeo

Vou gravar ainda.