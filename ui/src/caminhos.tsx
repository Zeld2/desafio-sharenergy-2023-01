import Home      from './telas/Home'
import Login     from './telas/Login'
import Cachorros from './telas/Cachorros'
import Gatos     from './telas/Gatos'
import Clientes  from './telas/Clientes'

export type CaminhoPagina = {
    path : string,
    element : JSX.Element,
    titulo?: string
}
  
export const caminhos:CaminhoPagina[] = [
    {path: "/"         , element: <Home/>, titulo : "Início"},
    {path: "/login"    , element: <Login/>},
    {path: "/cachorros", element: <Cachorros/>, titulo: "Catioros"},
    {path: "/gatos"    , element: <Gatos/>, titulo: "Gatitos"},
    {path: "/clientes" , element: <Clientes/>, titulo: "Clientes"},
]

