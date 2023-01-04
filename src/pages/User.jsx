import React, { useState, useEffect } from "react";
import Axios from "axios";
import PageControl from "../components/PageControl";
import Card from 'react-bootstrap/Card';

const totalPages = 10

export default function Users() {
    const [users, setUsers] = useState([]);
    const [pageNumber, setPageNumber] = useState(Number(sessionStorage.getItem('campanhapage')) || 1)

    const fetchusers = async () => {
        const { data } = await Axios.get(
            `https://randomuser.me/api/?page=${pageNumber}&results=12&seed=abc&inc=email,picture,name,login,dob`
        );
        const users = data;
        setUsers(users.results);
    };

    useEffect(() => {
        fetchusers();
        // eslint-disable-next-line
    }, [pageNumber]);

    return (
        <div className="content">
            <div className="section-center">
                {users.map(user => {
                    const { picture, login, name, email, dob } = user
                    return (
                        <div className="user">
                            <Card style={{ width: '12rem' }}>
                                <Card.Img variant="top" src={picture.large} />
                                <Card.Body>
                                    <Card.Title>{`${name.first} ${name.last}`}</Card.Title>
                                    <Card.Subtitle className="mb-3 text-muted" style={{ fontSize: 10 }}>{email}</Card.Subtitle>
                                    <Card.Text>
                                        <Card.Subtitle className="mb-2" style={{ fontSize: 12 }}>Usuário: {login.username}</Card.Subtitle>
                                        <Card.Subtitle className="mb-2" style={{ fontSize: 12 }}>Idade: {dob.age}</Card.Subtitle>
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </div>
                    )
                })}
            </div>
            <PageControl
                pageNumber={pageNumber}
                totalPages={totalPages}
                Decrease={() => {
                    const newPageNumber = pageNumber - 1
                    setPageNumber(newPageNumber)
                    sessionStorage.setItem('campanhapage', newPageNumber)
                }}
                Increase={() => {
                    const newPageNumber = pageNumber + 1
                    setPageNumber(newPageNumber)
                    sessionStorage.setItem('campanhapage', newPageNumber)
                }}
            />
        </div>
    )
}