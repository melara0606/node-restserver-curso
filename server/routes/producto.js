const express = require('express')
const Producto = require('../models/producto')
const { verificarToken } = require('../midellwares/autetication')

const app = express()

/**
 * ============================================================
 * Ruta para obtener los productos
 * ============================================================
 */
app.get('/producto', [verificarToken], (req, res) => {
  Producto.find({ disponible: true })
    .sort('nombre')
    .populate('usuario', 'nombre email')
    .populate('categoria')
    .exec((err, productos) => {
      if(err) {
        return res.status(400).json({
          ok: false,
          err
        })
      }
      return res.json({
        ok: true, 
        productos
      })
    });
});

/**
 * ============================================================
 * Ruta para obtener un producto por medio del id
 * ============================================================
 */
app.get('/producto/:id', [verificarToken], (req, res) => {
  let id = req.params.id

  Producto.findOne({ _id: id, disponible: true })
    .populate('usuario', 'nombre email')
    .populate('categoria')
    .exec((err, producto) => {
      if(err) {
        return res.status(400).json({
          ok: false,
          err
        })
      }
  
      if(!producto){
        return res.status(500).json({
          ok: false,
          err: {
            message: 'Producto no encontrado'
          }
        })
      }
  
      return res.json({
        ok: true, 
        producto
      })
    })  
});

/**
 * ============================================================
 * Ruta para hacer busquedas de producto
 * ============================================================
 */
app.get('/producto/search/:termino', [verificarToken], (req, res) => {
  let termino = req.params.termino
  let regExp = new RegExp(termino, 'i')

  Producto.find({ nombre: regExp })
    .populate('usuario', 'nombre email')
    .populate('categoria')
    .exec((err, producto) => {
      if(err) {
        return res.status(400).json({
          ok: false,
          err
        })
      }
  
      if(!producto){
        return res.status(500).json({
          ok: false,
          err: {
            message: 'Producto no encontrado'
          }
        })
      }
  
      return res.json({
        ok: true, 
        producto
      })
    })  
});

/**
 * ============================================================
 * Ruta para generar un nuevo producto
 * ============================================================
 */
app.post('/producto', [verificarToken], (req, res) => {
  let body = req.body
  let usuario_id = req.usuario._id
  
  let producto = new Producto({
      nombre          : body.nombre,
      precioUni       : body.precioUni,
      descripcion     : body.descripcion,
      categoria       : body.categoria,
      usuario         : usuario_id
  })

  producto.save((err, productoDB) => {
    if(err) {
      return res.status(400).json({
        ok: false,
        err
      })
    }

    if(!productoDB){
      return res.status(400).json({
        ok: false,
        err: {
          message: 'Lo sentimos pero no podemos crear el producto por le momento'
        }
      })
    }

    res.json({
      ok: true,
      producto: productoDB
    })
  })
});

/**
 * ============================================================
 * Ruta para actualizar el producto
 * ============================================================
 */
app.put('/producto/:id', [verificarToken], (req, res) => {
  let id = req.params.id
  let body = req.body

  Producto.findByIdAndUpdate(id, body, { new: true, runValidators: true}, (err, productoDB) => {
    if(err){
      return res.status(400).json({
        ok: false,
        err
      })
    }

    return res.json({
      ok: true,
      producto: productoDB
    })
  })
});

/**
 * ============================================================
 * Ruta para dar de baja un producto
 * ============================================================
 */
app.delete('/producto/:id', [verificarToken], (req, res) => {
  let id = req.params.id
  
  Producto.findByIdAndUpdate(id, { disponible: false } ,(err, productoDB) => {
    if(err){
      return res.status(400).json({
        ok: false,
        err
      })
    }

    if(!productoDB){
      return res.status(400).json({
        ok: false,
        err: {
          message: 'El ID no es correcto'
        }
      })
    }

    return res.status(200).json({
      ok: true,
      producto: productoDB
    })
  })
});

module.exports = app;