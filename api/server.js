const express = require('express');
const cors = require('cors')
const app = express();
var bodyParser = require('body-parser')

var jsonParser = bodyParser.json()

app.use(cors());

app.post('/login', jsonParser, function (req, res) {
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

app.listen(8080, () => console.log('API is running on http://localhost:8080/login'));