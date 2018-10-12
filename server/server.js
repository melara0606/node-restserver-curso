require('./config/config')

const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.use(require('./routes/usuario'))

const PORT = process.env.PORT
mongoose.connect(process.env.URLDB, (err) => {
  if(err) new Error('No podes conectar con la base de datos')
  console.log('Base de Datos ONLINE');
})

app.listen(PORT, () =>{
  console.log('Iniciando el proyecto en el puerto ' + PORT)
})