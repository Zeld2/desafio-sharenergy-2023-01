import { Request, Response } from "express";
import mongoose from 'mongoose';
import { CustomersService } from "./service/customer.service";

const customersService = new CustomersService()
mongoose.set('strictQuery', true)
mongoose.connect('mongodb://localhost:27017/Customers')
  .then(() => console.log('MongoDB connected!'));

const express = require('express');
const cors = require('cors')
const app = express();
var bodyParser = require('body-parser')

var jsonParser = bodyParser.json()

app.use(cors());

app.delete('/customers/:id', async function (req: Request, res: Response) {
  try {
    const deleteCustomersResult = await customersService.delete(req.params.id);
    res.send(deleteCustomersResult);
  } catch (error) {
    res.status(500).send(error);
  }
})

app.put('/customers/:id', jsonParser, async function (req: Request, res: Response) {
  try {
    const updateCustomersResult = await customersService.update(
      req.params.id,
      req.body
    );
    res.send(updateCustomersResult);
  } catch (error) {
    res.status(500).send(error);
  }
})


app.get('/customers', async function (req: Request, res: Response) {
  res.send(await customersService.findAll())
})

app.post('/customers', jsonParser, async function (req: Request, res: Response) {
  try {
    const addCustomersResult = await customersService.add(req.body)
    res.send(addCustomersResult)
  } catch (error) {
    res.status(500).send(error)
  }
})

app.post('/login', jsonParser, function (req: Request, res: Response) {
  const { username, password } = req.body
  //Confere credenciais 
  if (username === 'desafiosharenergy' && password === 'sh@r3n3rgy') {
    res.send({
      token: '3ss4-V4gaé-m1nh4-;)'
    })
  }
  else {
    res.sendStatus(401)
  }
})

app.listen(8080, () => console.log('API is running on http://localhost:8080/'));