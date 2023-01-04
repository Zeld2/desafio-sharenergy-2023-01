import React from 'react'
import ReactDOM from 'react-dom/client'

import {
  createBrowserRouter,
  RouteObject,
  RouterProvider
} from "react-router-dom";

import { ChakraProvider } from '@chakra-ui/react'


import './index.css'

import {caminhos, CaminhoPagina}  from "./caminhos"
import api from './api/api';

const rotas = createBrowserRouter(
  caminhos.map<RouteObject>( (caminho:CaminhoPagina):RouteObject => ({ path: caminho.path, element: caminho.element}) )
)



api.autenticacao.checaSeEstaLogado().then( (estaLogado) =>{
  if(!estaLogado){
    rotas.navigate("/login")
  }
  
  ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
      <ChakraProvider>
        <RouterProvider router={rotas} />
      </ChakraProvider>
    </React.StrictMode>
  )
})


