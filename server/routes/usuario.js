const express = require('express')
const bcrypt = require('bcryptjs')
const _ = require('underscore')

const { verificarToken, verificarAdminRole } = require('../midellwares/autetication')
const Usuario = require('../models/usuario')

const app = express()

app.get('/', (req, res) => {
  res.send('Hola mundo')
})

app.get('/usuario', verificarToken, (req, res) => {
  let desde = Number(req.query.desde) || 0;
  let limit = Number(req.query.limit) || 5;

  Usuario.find({ estado: true }, 'nombre email role estado google img')
    .skip(desde)
    .limit(limit)
    .exec((err, usuario) => {
      if(err) {
        return res.status(400).json({
          ok: false,
          err
        })
      }

      Usuario.count({ estado: true }, (err, conteo) => {
        return res.json({
          ok: true, 
          usuario,
          conteo
        })
      })
    })
})

app.post('/usuario', [verificarToken, verificarAdminRole], (req, res) => {
  let body = req.body

  let usuario = new Usuario({
    nombre: body.nombre,
    email: body.email,
    role: body.role,
    password: bcrypt.hashSync(body.password, 10)
  })

  usuario.save((err, usuarioDB) => {
    if(err) {
      return res.status(400).json({
        ok: false,
        err
      })
    }

    res.json({
      ok: true,
      usuario: usuarioDB
    })
  })
})

app.put('/usuario/:id', [verificarToken, verificarAdminRole], (req, res) => {
  let id    = req.params.id
  let body  = _.pick(req.body, ['nombre', 'img', 'role', 'estado']);

  Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {
    if(err){
      return res.status(400).json({
        ok: false,
        err
      })
    }
    return res.json({
      ok: true,
      usuario: usuarioDB
    })
  })
})

app.delete('/usuario/:id', [verificarToken, verificarAdminRole], (req, res) => {
  let id = req.params.id
  let estado = {
    estado : false
  }

  Usuario.findByIdAndUpdate(id, estado, { new: true, runValidators: true }, (err, usuarioBorrado) => {
    if(err){
      return res.status(400).json({
        ok: false,
        err
      })
    }

    if(!usuarioBorrado){
      return res.status(400).json({
        ok: false,
        err: {
          message: 'Usuario no encontrado'
        }
      })
    }

    return res.status(400).json({
      ok: true,
      usuario: usuarioBorrado
    })
  })
})

module.exports = app;