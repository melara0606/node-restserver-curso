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
 * URL para la DB
 * ============================================================
 */
let urlDB;
if(process.env.NODE_ENV == 'dev'){
  urlDB = 'mongodb://localhost:27017/cafe'
}else{
  urlDB = 'mongodb://cafe:cafe123456@ds231961.mlab.com:31961/curso-cafe-udemy'
}

process.env.URLDB = urlDB;