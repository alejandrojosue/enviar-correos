// import {Router} from 'express'
// const router = Router()
// Registro de usuario
/* En desuso, solamente debe haber un usuario administrador 
router.post('/users/register', async (req, res) => {
  const { username, password } = req.body
  if (!username || !password) {
    return res.status(400).json({ error: 'Faltan username o password' })
  }

  try {
    const existingUser = await getUserByUsername(username)
    if (existingUser) {
      return res.status(409).json({ error: 'Usuario ya existe' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    await createUser({ username, password: hashedPassword })

    res.status(201).json({ success: true, message: 'Usuario creado' })
  } catch (err) {
    console.error('Error creando usuario:', err)
    res.status(500).json({ error: 'Error interno' })
  }
})
*/

// Login de usuario
/* En desuso, solamente para pruebas
router.post('/users/login', async (req, res) => {
  const { username, password } = req.body
  if (!username || !password) {
    return res.status(400).json({ error: 'Faltan username o password' })
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

    res.json({ success: true, message: 'Autenticación exitosa' })
  } catch (err) {
    console.error('Error en login:', err)
    res.status(500).json({ error: 'Error interno' })
  }
})
*/

export default router