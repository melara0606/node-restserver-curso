const express = require('express')
const bcryptjs= require('bcryptjs')

const jsonwebtoken = require('jsonwebtoken')


const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(process.env.googleSignIn);

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


async function verify(token) {
  const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.googleSignIn
  });
  
  const payload = ticket.getPayload();  
  return {
    nombre: payload.name,
    email: payload.email, 
    img: payload.picture,
    google: true
  }
}

app.post('/google', async(req, res) => {
  let token = req.body.token;
  let payload = await verify(token)
                .catch(err => {
                  return res.status(500).json({
                    ok: false,
                    err
                  }) 
                })
  
  Usuario.findOne({ email: payload.email }, (err, usuarioDB) => {
    if(err) {
      return res.status(500).json({
        ok: false,
        err
      })
    }

    if(usuarioDB){
      if(usuarioDB.google == false){
        return res.status(400).json({
          ok: false,
          err: {
            message: 'Debes de usar su autenticacion normal'
          }
        })
      }else{
        let token = jsonwebtoken.sign({
          usuario: usuarioDB
        }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN })
    
        return res.status(200).json({
          ok: true,
          Usuario: usuarioDB,
          token
        })
      }
    }else{
      console.log(payload)
      let usuario = new Usuario();
      usuario.nombre = payload.nombre
      usuario.password = ':=)'
      usuario.img = payload.img
      usuario.email = payload.email
      usuario.google = true
      
      usuario.save((err, usuarioDBNuevo) => {
        if(err) {
          return res.status(500).json({
            ok: false,
            err
          })
        }

        let token = jsonwebtoken.sign({
          usuario: usuarioDBNuevo
        }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN })
    
        return res.status(200).json({
          ok: true,
          Usuario: usuarioDBNuevo,
          token
        })
      })
    }
  })
})

module.exports = app
