import { initDB } from "../config/database.js"
import { encrypt } from "../utils/crypto.js"

export async function createOrUpdateSMTP({
 smtp_host,
 smtp_port,
 smtp_user,
 smtp_pass,
 secure,
 from_name,
 from_email
}) {
 const db = await initDB()
 await db.run(`
  INSERT INTO smtp_credentials (smtp_user, smtp_host, smtp_port, smtp_pass, secure, from_name, from_email)
  VALUES (?, ?, ?, ?, ?, ?, ?)
  ON CONFLICT(smtp_user) DO UPDATE SET
    smtp_host = excluded.smtp_host,
    smtp_port = excluded.smtp_port,
    smtp_pass = excluded.smtp_pass,
    secure = excluded.secure,
    from_name = excluded.from_name,
    from_email = excluded.from_email
`, [
  smtp_user,
  smtp_host,
  smtp_port,
  encrypt(smtp_pass), // ← aquí
  secure ? 1 : 0,
  from_name,
  from_email
 ])
}

export async function getSMTPByUser(smtp_user) {
 const db = await initDB()
 return db.get(`SELECT * FROM smtp_credentials WHERE smtp_user = ?`, [smtp_user])
}

export async function getAllSMTP() {
 const db = await initDB()
 return db.all(`SELECT smtp_user, smtp_host, smtp_port, secure, from_name, from_email FROM smtp_credentials ORDER BY smtp_user ASC`)
}

export async function deleteSMTPByUser(smtp_user) {
 const db = await initDB()
 return db.run(`DELETE FROM smtp_credentials WHERE smtp_user = ?`, [smtp_user])
}