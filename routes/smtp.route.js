import { Router } from 'express'
import { createOrUpdateSMTP, deleteSMTPByUser, getAllSMTP, getSMTPByUser } from '../services/smtp.service.js'
import { getUserByUsername } from '../services/user.service.js'
import bcrypt from 'bcrypt'

const router = Router()
// Obtener todas las credenciales SMTP
router.get('/', async (req, res) => {
  try {
    const smtps = await getAllSMTP()
    res.json(smtps)
  } catch (err) {
    console.error('Error obteniendo todas las credenciales SMTP:', err)
    res.status(500).json({ error: 'Error interno' })
  }
})

// Crear o actualizar credenciales
router.post('/', async (req, res) => {
  const {
    smtp_host,
    smtp_port,
    smtp_user,
    smtp_pass,
    secure,
    from_name,
    from_email,
    user
  } = req.body

  const { username, password } = user || {}
  if (!username || !password) {
    return res.status(400).json({ error: 'Faltan username o password' })
  }

  if (!smtp_host || !smtp_port || !smtp_user || !smtp_pass || !from_email) {
    return res.status(400).json({ error: 'Faltan campos obligatorios' })
  }

  try {
    const user = await getUserByUsername(username)
    if (!user) {
      return res.status(401).json({ error: 'Usuario o contraseña inválidos' })
    }

    const valid = await bcrypt.compare(password, user.password)
    if (!valid) {
      return res.status(401).json({ error: 'Usuario o contraseña inválidos' })
    }

  } catch (err) {
    console.error('Error en credenciales:', err)
    res.status(500).json({ error: 'Error interno' })
  }

  try {
    const smtp = await getSMTPByUser(smtp_user)
    if (smtp) {
      res.status(409).json({ error: 'Credenciales ya existen' })
      return
    }
    await createOrUpdateSMTP({
      smtp_host,
      smtp_port,
      smtp_user,
      smtp_pass,
      secure,
      from_name,
      from_email
    })

    res.status(200).json({ success: true, message: 'Credenciales guardadas' })
  } catch (err) {
    console.error('Error guardando credenciales SMTP:', err)
    res.status(500).json({ error: 'Error al guardar credenciales' })
  }
})

// Obtener credenciales de un cliente
router.get('/:email', async (req, res) => {
  try {
    const smtp = await getSMTPByUser(req.params.email)
    if (!smtp) return res.status(404).json({ error: 'Cliente no encontrado' })
    delete smtp.smtp_pass // por seguridad no devolvemos la contraseña
    res.json(smtp)
  } catch (err) {
    console.error('Error obteniendo credenciales:', err)
    res.status(500).json({ error: 'Error interno' })
  }
})

// Eliminar credenciales
router.delete('/:email', async (req, res) => {
  try {
    await deleteSMTPByUser(req.params.email)
    res.status(200).json({ success: true, message: 'Credenciales eliminadas' })
  } catch (err) {
    console.error('Error eliminando credenciales:', err)
    res.status(500).json({ error: 'Error interno' })
  }
})

export default router