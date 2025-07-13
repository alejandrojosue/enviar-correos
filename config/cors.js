const allowedOrigins = ['http://localhost:3000'] // Dominios permitidos

const CORS_OPTIONS = {
  origin: function (origin, callback) {
    if (allowedOrigins.length === 0 || allowedOrigins.includes('*')) {
      return callback(null, true)
    }

    if (!origin) {
      return callback(new Error('Acceso no permitido por CORS'), false)
    }

    if (allowedOrigins.includes(origin)) {
      return callback(null, true)
    }

    return callback(new Error('Acceso no permitido por CORS'), false)
  }
}
export { CORS_OPTIONS }
