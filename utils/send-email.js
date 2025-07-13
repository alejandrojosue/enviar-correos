import nodemailer from 'nodemailer'

export const sendEmail = async (
  smtp = { smtp_host, smtp_port, secure, smtp_user, smtpPass },
  smtpPass = '',
  email = '',
  subject = 'Nuevo mensaje desde el sitio web',
  message = 'Este es un mensaje de prueba desde el sitio web.'
) => {
  const transporter = nodemailer.createTransport({
    host: smtp.smtp_host,
    port: parseInt(smtp.smtp_port),
    secure: !!smtp.secure, // 1 = true
    auth: {
      user: smtp.smtp_user,
      pass: smtpPass,
    },
    pool: true,
    maxConnections: 5,
    maxMessages: 100,
    rateLimit: true,
  })

  await transporter.sendMail({
    from: `"${smtp.from_name || 'Contacto Web'}" <${smtp.from_email}>`,
    to: smtp.from_email, // o destino fijo o dinámico
    replyTo: email,
    subject,
    // cc: email,
    text: message,
    html: `
         <p>${message}</p>
         <br />
         <p><strong>Remitente:</strong> ${email}</p>
         <hr />
         <p style="font-size: 12px; color: gray;">Enviado desde mi sistema</p>
       `
  })
}