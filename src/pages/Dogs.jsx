import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import Axios from "axios";

const getRandomDogImg = async () => {
    return ((await Axios.get('https://random.dog/woof.json?include=jpg')).data.url)
}

export default function Dogs() {
    const [dogImage, setdogImage] = useState();

    useEffect(() => {
        getRandomDogImg().then((img) => {
            setdogImage(img)
        })
    },[])

    const handleSubmit = async e => {
        e.preventDefault();
        console.log('teste')
        setdogImage(await getRandomDogImg())
    }

    return (
        <div className="login-wrapper">
            <Card style={{ minWidth: '40rem' }}>
                <Card.Body fluid>
                    <Card.Title> Random Dogs
                    </Card.Title>
                    <Form onSubmit={handleSubmit}>
                        <Card.Img variant="bottom" style={{ maxHeight: '40rem' }} src={dogImage} />
                        <Form.Group className="section-center-dogs">
                            <Button variant="primary" type='submit' className='dogs'>Refresh</Button>{' '}
                        </Form.Group>
                    </Form>
                </Card.Body>
            </Card>
        </div>
    )
}