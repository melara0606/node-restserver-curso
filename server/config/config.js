/**
 * ============================================================
 * Puerto
 * ============================================================
 */
process.env.PORT = process.env.PORT || 3000

/**
 * ============================================================
 * Variable desarrollo
 * ============================================================
 */
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

/**
 * ============================================================
 * Vecimiento
 * ============================================================
 */
process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;

/**
 * ============================================================
 * SEED principal de la aplicacion
 * ============================================================
 */
process.env.SEED = process.env.SEED || 'este-es-la-seed-desarrollo';


/**
 * ============================================================
 * URL para la DB
 * ============================================================
 */
let urlDB;
if(process.env.NODE_ENV == 'dev'){
  urlDB = 'mongodb://localhost:27017/cafe'
}else{
  urlDB = process.env.MONGO_URI
}

process.env.URLDB = urlDB;

/**
 * ============================================================
 * Configuracion de Google Sign In
 * ============================================================
 */
process.env.googleSignIn = process.env.googleSignIn || '919911088583-ij4mhgforfmlktcnve7sb1qate23on7j.apps.googleusercontent.com';