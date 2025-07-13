import express from 'express'
import rateLimit from 'express-rate-limit'

import cors from 'cors'

import { setupSchema } from '../config/database.js'

import adminRouter from '../routes/admin.route.js'
import emailRouter from '../routes/email.route.js'
import smtpRouter from '../routes/smtp.route.js'
import { CORS_OPTIONS } from '../config/cors.js'
import { corsErrorMiddleware } from '../middlewares/cors.js'

export default class Server {

 constructor() {
  this.app = express()
  this.port = process.env.PORT || 3000

  this.app.use((req, res, next) => {
   console.log('Origin:', req.headers.origin)
   console.log('IP:', req.ip)
   
   next()
  })

  this.middlewares()
  this.routes()
  this.database()
 }


 middlewares() {
  // DNS allowed
  this.app.use(cors(CORS_OPTIONS))
  this.app.use(corsErrorMiddleware)

  this.app.use(express.json())
  this.app.use('/', express.static('public'))

 }

 routes() {
  const limiter = rateLimit({
   windowMs: 15 * 60 * 1000, // 15 minutos
   max: 10, // límite por IP
   standardHeaders: true, // incluye headers `RateLimit-*`
   legacyHeaders: false,  // desactiva `X-RateLimit-*`
   message: {
    error: 'Demasiadas solicitudes desde esta IP. Inténtalo más tarde.'
   }
  })

  const emailLimiter = rateLimit({
   windowMs: 15 * 60 * 1000, // 15 minutos
   max: 3, // límite por IP
   standardHeaders: true, // incluye headers `RateLimit-*`
   legacyHeaders: false,  // desactiva `X-RateLimit-*`
   message: {
    error: 'Demasiadas solicitudes desde esta IP. Inténtalo más tarde.'
   }
  })


  this.app.use('/admin', limiter, adminRouter)
  this.app.use('/email', emailLimiter, emailRouter)
  this.app.use('/smtp', limiter, smtpRouter)
 }

 async database() {
  await setupSchema()
 }

 listen() {
  this.app.listen(this.port, () => {
   console.clear()
   console.log(`Servidor corriendo en http://localhost:${this.port}`)
  })
 }
}