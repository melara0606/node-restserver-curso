require('./config/config')

const express = require('express')
const bodyParser = require('body-parser')

const app = express()

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get('/', (req, res) => {
  res.send('Hola mundo')
})

app.get('/usuario', (req, res) => {
  res.json('usuario')
})

app.post('/usuario', (req, res) => {
  let body = req.body
  res.json({
    body
  })
})

app.put('/usuario/:id', (req, res) => {
  let id = req.params.id
  res.json({
    id,
  })
})

app.delete('/usuario/:id', (req, res) => {
  res.json('delete usuario')
})

app.listen(process.env.PORT, () =>{
  console.log('Iniciando el proyecto en el puerto 3000')
})