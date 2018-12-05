const express = require('express')
const bcryptjs= require('bcryptjs')

const jsonwebtoken = require('jsonwebtoken')

// Modelo
const app = express();
const Usuario = require('../models/usuario')

app.post('/login', (req, res) => {
  let { email, password } = req.body

  Usuario.findOne({ email }, (err, usuarioDB) => {
    if(err) {
      return res.status(500).json({
        ok: false,
        err
      })
    }

    if(!usuarioDB){
      return res.status(400).json({
        ok: false,
        err: { message: '(Usuario) o contraseña incorrectos' }
      })
    }

    if(!bcryptjs.compareSync(password, usuarioDB.password)){
      return res.status(400).json({
        ok: false,
        err: { message: 'Usuario o (contraseña) incorrectos' }
      })
    }

    let token = jsonwebtoken.sign({
      usuario: usuarioDB
    }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN })

    return res.status(200).json({
      ok: true,
      Usuario: usuarioDB,
      token
    })
  })  
})

module.exports = app
