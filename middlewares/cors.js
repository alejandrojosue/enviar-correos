// middlewares/corsErrorMiddleware.js
export const corsErrorMiddleware = (err, req, res, next) => {
  if (err instanceof Error && err.message.includes('CORS')) {
    return res.status(403).json({
      error: 'Origen no permitido por CORS'
    })
  }
  next(err) // Pasar el error al siguiente middleware si no es CORS
}
