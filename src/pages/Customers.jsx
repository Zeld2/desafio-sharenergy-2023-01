import React, { useEffect, useState } from 'react';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { Container } from 'react-bootstrap';

const fetchCustomers = async () => {
    return fetch('http://localhost:8080/customers', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(async data => {
            if (data.status === 200) {
                return (await data.json())
            }
        })
}

export default function Customers() {
    const [customers, setCustomers] = useState([])
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [telefone, setTelefone] = useState("")
    const [endereco, setEndereco] = useState("")
    const [cpf, setCpf] = useState("")
    const [edit, setEdit] = useState(false)
    const [idEdit, setIdEdit] = useState()

    const handleSubmit = (e) => {
        e.preventDefault()
        if (edit) {
            fetch(`http://localhost:8080/customers/${idEdit}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: name,
                    email: email,
                    telephone: telefone,
                    cpf: cpf,
                    adress: endereco
                })
            }).then(() => {
                fetchCustomers().then((customers) => {
                    setCustomers(customers)
                    setEdit(false)
                    setName("")
                    setTelefone("")
                    setEmail("")
                    setEndereco("")
                    setCpf("")
                })
            })
        } else {
            fetch(`http://localhost:8080/customers`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: name,
                    email: email,
                    telephone: telefone,
                    cpf: cpf,
                    adress: endereco
                })
            }).then(() => {
                fetchCustomers().then((customers) => {
                    setCustomers(customers)
                    setName("")
                    setTelefone("")
                    setEmail("")
                    setEndereco("")
                    setCpf("")
                })
            }) 
        }
    }

    const handleClickDelete = (id) => {
        fetch(`http://localhost:8080/customers/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(() => {
            fetchCustomers().then((customers) => {
                setCustomers(customers)
            })
        })
    }

    const handleClickEdit = (id, nameEdit, emailEdit, telephoneEdit, adressEdit, cpfEdit) => {
        setEdit(true)
        setIdEdit(id)
        setName(nameEdit)
        setEmail(emailEdit)
        setTelefone(telephoneEdit)
        setEndereco(adressEdit)
        setCpf(cpfEdit)
        return JSON.stringify({
            name: name,
            email: email,
            telephone: telefone,
            cpf: cpf,
            adress: endereco
        })
    }

    useEffect(() => {
        fetchCustomers().then((customers) => {
            setCustomers(customers)
        })
    }, [])


    return (
        <Container fluid="md" className="table-customer">
            <Container fluid="md" className="table-customer">
                <Form onSubmit={handleSubmit}>
                    <Table striped bordered hover >
                        <thead>
                            <tr>
                                <th><Form.Group className="mb-3">
                                    <Form.Label>Nome</Form.Label>
                                    <Form.Control type="text" value={name} onChange={(e) => { setName(e.target.value) }} />
                                </Form.Group></th>
                                <th><Form.Group className="mb-3">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control type="text" value={email} onChange={(e) => { setEmail(e.target.value) }} />
                                </Form.Group></th>
                                <th><Form.Group className="mb-3">
                                    <Form.Label>Telefone</Form.Label>
                                    <Form.Control type="text" value={telefone} onChange={(e) => { setTelefone(e.target.value) }} />
                                </Form.Group></th>
                                <th><Form.Group className="mb-3">
                                    <Form.Label>Endereço</Form.Label >
                                    <Form.Control type="text" value={endereco} onChange={(e) => { setEndereco(e.target.value) }} />
                                </Form.Group></th>
                                <th><Form.Group className="mb-3">
                                    <Form.Label>Cpf</Form.Label>
                                    <Form.Control type="text" value={cpf} onChange={(e) => { setCpf(e.target.value) }} />
                                </Form.Group></th>
                                <th className='th-save'><Button className='button-save' type="submit" variant="success">Salvar</Button></th>
                            </tr>
                        </thead>
                    </Table>
                </Form>
            </Container>
            <Table striped bordered hover responsive='sm'>
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Email</th>
                        <th>Telefone</th>
                        <th>Endereço</th>
                        <th>Cpf</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {customers.map(customer => {
                        const { _id, name, email, telephone, adress, cpf } = customer
                        return (
                            <tr id="_id">
                                <td>{name}</td>
                                <td>{email}</td>
                                <td>{telephone}</td>
                                <td>{adress}</td>
                                <td>{cpf}</td>
                                <td ><Button variant="warning" onClick={() => handleClickEdit(_id, name, email, telephone, adress, cpf)} >Editar</Button>{' '}
                                    <Button variant="danger" onClick={() => handleClickDelete(_id)}>Deletar</Button>{' '}</td>
                            </tr>
                        )
                    })}
                </tbody>
            </Table>
        </Container>
    )
}