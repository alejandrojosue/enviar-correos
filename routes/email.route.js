import { Router } from 'express'
import { emailQueue } from '../queues/queue.js'

const router = Router()

router.post('/', async (req, res) => {
 const { message, subject, email, client } = req.body

 if (!message || !subject || !email || !client) {
  return res.status(400).json({ error: 'Faltan campos: message, subject, email, client' })
 }

 try {
  await emailQueue.add('send-email', { message, subject, email, client })
  res.status(202).json({ success: true, message: 'Correo en cola para envío' })
 } catch (err) {
  console.error('Error al agregar a la cola:', err)
  res.status(500).json({ success: false, error: 'Error interno del servidor' })
 }
})

export default router