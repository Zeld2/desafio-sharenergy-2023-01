import { autenticacao } from './componentes/autenticacao'
import { clientes } from './componentes/clientes'
import { cachorros } from './componentes/cachorros'
import { usuarios } from './componentes/usuarios'

// só uma coleção burra.
const api =  {
    autenticacao,
    cachorros,
    usuarios,
    clientes
}

// A minha "api" é estruturada em componentes.
// tem o componente da autenticação
// tem o componente da requisição
// tem o componente das pessoas aleatórias
// tem o componente dos gatos
// tem o componente dos cachorros
// tem o componente do crud

// autenticação é o que vai me dar um token que eu vou
// enviar pro backend quando eu fizer qualquer outra
// requisição.

// o desafio é fazer isso tudo não virar uma macarronada.

export default api