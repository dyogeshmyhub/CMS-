const fs = require('fs')
const path = require('path')
const bcrypt = require('bcryptjs')

const dbPath = path.join(__dirname, '..', 'database', 'db.json')
const email = (process.env.SUPER_ADMIN_EMAIL || '').trim().toLowerCase()
const password = process.env.SUPER_ADMIN_PASSWORD || ''

async function ensureSuperAdmin() {
  if (!email || !password) {
    console.log('No SUPER_ADMIN_EMAIL or SUPER_ADMIN_PASSWORD provided. Skipping initial Super Admin creation.')
    return
  }

  let raw = '{}'
  try {
    raw = fs.readFileSync(dbPath, 'utf8')
  } catch {
    raw = JSON.stringify({ users: [] }, null, 2)
  }

  const data = JSON.parse(raw)
  const users = Array.isArray(data.users) ? data.users : []
  const existing = users.find((user) => String(user.email || '').toLowerCase() === email)

  if (existing) {
    if (existing.role !== 'SUPER_ADMIN') {
      existing.role = 'SUPER_ADMIN'
      existing.status = 'ACTIVE'
      existing.updatedAt = new Date().toISOString()
    }
    if (!String(existing.password || '').startsWith('$2')) {
      existing.password = await bcrypt.hash(password, 12)
    }
    console.log(`Super Admin already exists for ${email}.`) 
    fs.writeFileSync(dbPath, JSON.stringify({ ...data, users }, null, 2))
    return
  }

  const hashedPassword = await bcrypt.hash(password, 12)
  users.push({
    id: `sa-${Date.now()}`,
    name: 'Super Administrator',
    email,
    phone: '',
    password: hashedPassword,
    role: 'SUPER_ADMIN',
    status: 'ACTIVE',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  })

  fs.writeFileSync(dbPath, JSON.stringify({ ...data, users }, null, 2))
  console.log(`Initial Super Admin created for ${email}.`)
}

ensureSuperAdmin().catch((error) => {
  console.error('Failed to seed Super Admin:', error)
  process.exit(1)
})
