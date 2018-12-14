const express = require('express')
const { verificarToken, verificarAdminRole } = require('../midellwares/autetication')
const Categoria = require('../models/categoria')

const app = express()

/**
 * ============================================================
 * Ruta para obtener una categoria
 * ============================================================
 */
app.get('/categoria', [verificarToken], (req, res) => {
  Categoria.find({ })
    .sort('descripcion')
    .populate('usuario', 'nombre email')
    .exec((err, categorias) => {
      if(err) {
        return res.status(400).json({
          ok: false,
          err
        })
      }
      return res.json({
        ok: true, 
        categorias
      })
    });
});

/**
 * ============================================================
 * Ruta para obtener una categoria por medio del id
 * ============================================================
 */
app.get('/categoria/:id', [verificarToken], (req, res) => {
  let id = req.params.id

  Categoria.findById(id, (err, categoria) => {
    if(err) {
      return res.status(400).json({
        ok: false,
        err
      })
    }

    if(!categoria){
      return res.status(400).json({
        ok: false,
        err: {
          message: 'ID no existe'
        }
      })
    }

    return res.json({
      ok: true, 
      categoria
    })
  })  
});

/**
 * ============================================================
 * Ruta para generar una nueva categoria
 * ============================================================
 */
app.post('/categoria', [verificarToken], (req, res) => {
  let body = req.body
  let usuario_id = req.usuario._id
  
  let categoria = new Categoria({
    descripcion: body.descripcion,
    usuario: usuario_id
  })

  categoria.save((err, categoriaDB) => {
    if(err) {
      return res.status(400).json({
        ok: false,
        err
      })
    }

    if(!categoriaDB){
      return res.status(400).json({
        ok: false,
        err: {
          message: 'Lo sentimos pero no podemos crear la categoria por le momento'
        }
      })
    }

    res.json({
      ok: true,
      categoria: categoriaDB
    })
  })
});

/**
 * ============================================================
 * Ruta para actualizar la categoria
 * ============================================================
 */
app.put('/categoria/:id', [verificarToken], (req, res) => {
  let id = req.params.id
  let body = req.body

  Categoria.findByIdAndUpdate(id, body, { new: true, runValidators: true}, (err, categoriaDB) => {
    if(err){
      return res.status(400).json({
        ok: false,
        err
      })
    }

    return res.json({
      ok: true,
      categoria: categoriaDB
    })
  })
});

/**
 * ============================================================
 * Ruta para actualizar la categoria
 * ============================================================
 */
app.delete('/categoria/:id', [verificarToken], (req, res) => {
  let id = req.params.id
  
  Categoria.findOneAndRemove({ _id: id }, (err, categoriaDB) => {
    if(err){
      return res.status(400).json({
        ok: false,
        err
      })
    }

    if(!categoriaDB){
      return res.status(400).json({
        ok: false,
        err: {
          message: 'El ID no es correcto'
        }
      })
    }

    return res.status(200).json({
      ok: true,
      categoria: categoriaDB
    })
  })
});

module.exports = app;