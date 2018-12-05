const jwt = require('jsonwebtoken')

/**
 * ============================================================
 * Middelwares para poder autenticar a los usuarios
 * ============================================================
 */

 let verificarToken = (req, res, next) => {
   let token = req.get('token')

   jwt.verify(token, process.env.SEED, (err, decoded) => {
     if(err){
       return res.status(401).json({
         ok: false,
         err
       })
     }

     req.usuario = decoded.usuario
     next();
   })
 }

 let verificarAdminRole = (req,res, next) => {
   let usuario = req.usuario

   if(usuario.role === 'ADMIN_ROLE'){
     next();
   }else{
    return res.status(401).json({
      ok: false,
      err: {
        message: 'Lo sentimos pero no eres un usuario con estos privilegios'
      }
    })
   }
 }

 module.exports = {
   verificarToken, verificarAdminRole
 }