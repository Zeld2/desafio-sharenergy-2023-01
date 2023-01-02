import React from "react"
import { Route, Routes } from "react-router-dom"
import 'bootstrap/dist/css/bootstrap.min.css';


import Login from "./pages/Login";
import useToken from "./hooks/useToken";
import Users from "./pages/User";
import Tabs from "./components/NavBar";
import Cats from "./pages/Cats";
import Dogs from "./pages/Dogs";

export default function App() {
  const { token, setToken } = useToken();

  if (!token) {
    return <Login setToken={setToken} />
  }

  return (
    <div className="wrapper">
      <header>
        <h1>Desafio Sharenergy 2023</h1>
      </header>
      <Tabs></Tabs>
      <Routes>
        <Route exact path="/" element={<Users />} />
        <Route exact path="/cats" element={<Cats />} />
        <Route exact path="/dogs" element={<Dogs />} />
      </Routes>
    </div>
  )
}
