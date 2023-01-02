import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';

export default function Cats() {
    const [statusCode, setStatusCode] = useState(undefined);
    const [urlCats, setUrlCats] = useState("")

    const handleSubmit = async e => {
        e.preventDefault();
        console.log(statusCode)
    }

    useEffect(() => {
        setUrlCats("https://http.cat/" + statusCode)
    }, [statusCode])

    return (
        <div className="login-wrapper">
            <Card style={{ width: '40rem' }}>
                <Card.Body>
                    <Card.Title> HTTP Cats
                    </Card.Title>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Status Code</Form.Label>
                            <Form.Control type="number" placeholder="Ex: 101" onChange={e => {
                                setStatusCode(e.target.value)
                            }} />
                        </Form.Group>
                    </Form>
                </Card.Body>
                {statusCode ? <Card.Img variant="bottom" src={urlCats} /> : undefined}
            </Card>
        </div>
    )
}