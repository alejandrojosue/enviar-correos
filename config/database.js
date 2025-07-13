import sqlite3 from 'sqlite3'
import { open } from 'sqlite'

export const initDB = async () => {
  return open({
    filename: './emails.db',
    driver: sqlite3.Database,
  })
}

export async function setupSchema() {
  const db = await initDB()

  // Tabla para historial de correos
  await db.exec(`
    CREATE TABLE IF NOT EXISTS emails (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT,
      subject TEXT,
      message TEXT,
      status TEXT,
      created_at TEXT
    )
  `)

  // Tabla para credenciales SMTP
  await db.exec(`
    CREATE TABLE IF NOT EXISTS smtp_credentials (
      smtp_host TEXT NOT NULL,
      smtp_port INTEGER NOT NULL,
      smtp_user TEXT PRIMARY KEY,
      smtp_pass TEXT NOT NULL,
      secure INTEGER DEFAULT 0,
      from_name TEXT,
      from_email TEXT
    )
  `)

  // Tabla para usuarios del sistema
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `)
}