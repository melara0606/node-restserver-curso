const fs = require('fs')
const path = require('path')
const express = require('express')

const app = express()
const Usuario = require('../models/usuario')
const Producto = require('../models/producto')
const { verificarTokenImg } = require('../midellwares/autetication')

app.put('/upload/:tipo/:id', function(req, res) {
  if(req.files){
    if(Object.keys(req.files).length === 0){
      return res.status(400).json({
        ok: false,
        err: {
          message: 'Debes seleccionar una imagen para poder subirla'
        }
      });
    }
    // tipo y id
    let id    = req.params.id
    let tipo  = req.params.tipo
    let tiposValidos = ['usuarios', 'productos']
  
    if(tiposValidos.indexOf( tipo ) < 0){
      return res.status(400).json({
        ok: false,
        err: {
          message: 'La tipos validos son ' + tiposValidos.join(', ')
        }
      })
    }
  
  
    let archivo = req.files.archivo
    let nombreArchivoCortado = archivo.name.split('.')
    let extensionesValidas = ['png', 'jpg', 'gif']
  
    let extension = nombreArchivoCortado[ nombreArchivoCortado.length - 1 ]
    if(extensionesValidas.indexOf( extension ) < 0){
      return res.status(400).json({
        ok: false,
        err: {
          message: 'La extensiones validas son ' + extensionesValidas.join(', ')
        },
        ext: extension
      })
    }
  
    let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extension}`
    
    archivo.mv(`uploads/${ tipo }/${ nombreArchivo }`, function(err) {
      if(err){
        return res.status(500).json({
          ok: false,
          err
        })
      }

      if(tipo === 'usuarios'){
        imagenUsuarioSubir(id, res, nombreArchivo)
      }else{
        imagenproductoSubir(id, res, nombreArchivo)
      }
    })
  }else{
    return res.status(404).json({
      ok: false,
      err: {
        message: 'Debes seleccionar una imagen para poder realizar la operacion'
      }
    })
  }

})

app.get('/imagen/:tipo/:img', verificarTokenImg, (req, res) => {
  let img = req.params.img
  let tipo = req.params.tipo

  let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${img}`)
  if(fs.existsSync(pathImagen)){
    res.sendFile(pathImagen)
  }else{
    let noImagenPath = path.resolve(__dirname, '../assets/no-image.jpg')
    res.sendFile(noImagenPath)
  }
})

function imagenUsuarioSubir(id, res, nombreArchivo) {
  Usuario.findById(id, (err, usuarioDB) => {
    if(err) {
      borrarArchivo(nombreArchivo)
      return res.status(400).json({
        ok: false,
        err
      })
    }

    if(!usuarioDB){
      borrarArchivo(nombreArchivo)
      return res.status(404).json({
        ok: false,
        err: {
          message: 'Usuario no encontrado'
        }
      })
    }

    borrarArchivo(usuarioDB.img)
    usuarioDB.img = nombreArchivo;
    usuarioDB.save((err, usuarioNuevo) => {
      if(err) {
        return res.status(400).json({
          ok: false,
          err
        })
      }

      return res.status(200).json({
        ok: true,
        usuario: usuarioNuevo,
        img: nombreArchivo
      })
    })
  })
}

function imagenproductoSubir(id, res, nombreArchivo) {
  Producto.findById(id, (err, prodcutoDB) => {
    if(err) {
      borrarArchivo(nombreArchivo, 'productos')
      return res.status(400).json({
        ok: false,
        err
      })
    }

    if(!prodcutoDB){
      borrarArchivo(nombreArchivo, 'productos')
      return res.status(404).json({
        ok: false,
        err: {
          message: 'Producto no encontrado'
        }
      })
    }

    borrarArchivo(prodcutoDB.img, 'productos')
    prodcutoDB.img = nombreArchivo;
    prodcutoDB.save((err, productoNuevo) => {
      if(err) {
        return res.status(400).json({
          ok: false,
          err
        })
      }

      return res.status(200).json({
        ok: true,
        producto: productoNuevo,
        img: nombreArchivo
      })
    })
  })
}

function borrarArchivo (nombreArchivo, tipo = 'usuarios'){
  let pathURL = path.resolve(__dirname, `../../uploads/${ tipo }/${ nombreArchivo }`);
  if(fs.existsSync(pathURL)){
    fs.unlinkSync(pathURL)
  }
}


module.exports = app