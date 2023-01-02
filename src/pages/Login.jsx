import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Image from 'react-bootstrap/Image'
import Card from 'react-bootstrap/Card';

import '../Login.css';

const loginUser = async (credentials, setToken, setUnauthorized) => {
  return fetch('http://localhost:8080/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(credentials)
  })
    .then(async data => {
      if (data.status === 200) {
        setToken(await data.json())
      }
      if (data.status === 401) {
        setUnauthorized(false)
      }
    })
}

function getLocalStorageOrNullUsername(key, defaultValue) {
  const stored = localStorage.getItem(key);
  if (!stored) {
    return defaultValue;
  }
  return JSON.parse(stored);
}

export default function Login({ setToken }) {
  const [username, setUserName] = useState(getLocalStorageOrNullUsername('username', ''));
  const [password, setPassword] = useState();
  const [unauthorized, setUnauthorized] = useState(true)
  const [remember, setRemember] = useState(username ? true : false)

  const handleSubmit = async e => {
    console.log(unauthorized)
    e.preventDefault();
    await loginUser({
      username,
      password
    }, setToken, setUnauthorized);
  }

  const handleChange = async (e) => {
    setRemember(!remember)
    if (!remember) {
      localStorage.setItem('username', JSON.stringify(username))
    } else {
      localStorage.removeItem('username')
    }
  }

  return (
    <div className="login-wrapper">
      <Card style={{ width: '20rem' }}>
        <Card.Header><Image src='https://www.sharenergy.com.br/wp-content/uploads/2022/12/logo_color.png' fluid></Image>
        </Card.Header>
        <Card.Body>
          <Card.Title> Login - Desafio 2023
          </Card.Title>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formBasicUsername">
              <Form.Label>User</Form.Label>
              <Form.Control type="user" placeholder="Enter username" isInvalid={!unauthorized} value={username} onChange={e => {
                setUserName(e.target.value)
                if (remember) localStorage.setItem('username', JSON.stringify(e.target.value))
              }} />
              <Form.Text className="text-muted">
                User and password provided by the challenge.
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" placeholder="Password" isInvalid={!unauthorized} onChange={e => {
                setPassword(e.target.value)
              }} />
              <Form.Control.Feedback type="invalid">
                Wrong user or/and password
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicCheckbox">
              <Form.Check type="checkbox" label="Remember me" defaultChecked={remember} onChange={e => handleChange(e)} />
            </Form.Group>
            <Button type="submit">
              Submit
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  )
}

Login.propTypes = {
  setToken: PropTypes.func.isRequired
};