import dotenv from 'dotenv'
import { Worker } from 'bullmq'
import IORedis from 'ioredis'
import { getSMTPByUser } from '../services/smtp.service.js'
import { logEmail } from '../services/admin.service.js'

import { decrypt } from '../utils/crypto.js'
import { sendEmail } from '../utils/send-email.js'

dotenv.config()

const connection = new IORedis(process.env.REDIS_URL, {
  maxRetriesPerRequest: null // requerido por BullMQ
})

const worker = new Worker(
  'email-queue',
  async job => {
    const { message, subject, email, client } = job.data

    // Obtener credenciales del cliente
    const smtp = await getSMTPByUser(client)

    if (!smtp) {
      console.error(`❌ No se encontraron credenciales SMTP para el cliente "${client}"`)
      await logEmail({ email, subject, message, status: 'failed' })
      return
    }

    const smtpPass = decrypt(smtp.smtp_pass)

    await sendEmail( smtp, smtpPass, email, subject, message )

    await logEmail({ email, subject, message, status: 'sent' })
    console.log(`📤 Correo enviado de ${email} usando cliente "${client}"`)
  },
  {
    connection,
    concurrency: 5
  }
)

worker.on('failed', async (job, err) => {
  console.error(`❌ Falló el trabajo ${job.id}:`, err)
  const { email, subject, message } = job.data
  await logEmail({ email, subject, message, status: 'failed' })
})

console.log('📨 Worker escuchando correos en la cola...')
