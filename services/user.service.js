import { initDB } from '../config/database.js'

export async function createUser({ username, password }) {
  const db = await initDB()
  await db.run(
    `INSERT INTO users (username, password) VALUES (?, ?)`,
    [username, password]
  )
}

export async function getUserByUsername(username) {
  const db = await initDB()
  return db.get(`SELECT * FROM users WHERE username = ?`, [username])
}
