require('./config/config')

const fs = require('fs')
const path = require('path')
const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

const urlRoute = `${__dirname}/routes`
fs.readdir(urlRoute, (err, files) => {
  files
    .map(file => path.join(urlRoute, file))
    .filter(file => fs.statSync(file).isFile())
    .forEach(file => {
      let ext = path.extname(file)
      if(Object.is(ext, '.js')) {
        app.use(require(file.replace(ext, "")))
      }
    })
})

const PORT = process.env.PORT
mongoose.connect(process.env.URLDB, (err) => {
  if(err) new Error('No podes conectar con la base de datos')
  console.log('Base de Datos ONLINE');
})

app.listen(PORT, () =>{
  console.log('Iniciando el proyecto en el puerto ' + PORT)
})