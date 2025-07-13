import { Router } from 'express'
import { getEmailLogs } from '../services/admin.service.js'

const router = Router()

router.get('/', async (req, res) => {
  try {
    const logs = await getEmailLogs()
    res.json(logs)
  } catch (err) {
    console.error('Error obteniendo logs:', err)
    res.status(500).json({ error: 'Error al obtener historial' })
  }
})

export default router