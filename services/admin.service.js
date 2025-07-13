import { initDB } from "../config/database.js"

export async function logEmail({ email, subject, message, status }) {
 const db = await initDB()
 await db.run(
  'INSERT INTO emails (email, subject, message, status, created_at) VALUES (?, ?, ?, ?, ?)',
  [email, subject, message, status, new Date().toISOString()]
 )
}

export async function getEmailLogs() {
 const db = await initDB()
 return db.all('SELECT * FROM emails ORDER BY created_at DESC')
}