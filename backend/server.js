const express = require('express')
const cors = require('cors')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const fs = require('fs')
const path = require('path')

const app = express()
const PORT = Number(process.env.PORT || 3001)
const DB_PATH = path.join(__dirname, '..', 'database', 'db.json')
const JWT_SECRET = process.env.JWT_SECRET || 'golden-traders-dev-secret-change-me'

const ALLOWED_ROLES = ['USER', 'ADMIN', 'SUPER_ADMIN']
const ALLOWED_STATUSES = ['ACTIVE', 'DISABLED']

function normalizeRole(role) {
  const value = String(role || '').trim().toUpperCase()
  if (value === 'SUPER_ADMIN' || value === 'SUPERADMIN') return 'SUPER_ADMIN'
  if (value === 'ADMIN' || value === 'ADMINISTRATOR') return 'ADMIN'
  return 'USER'
}

function normalizeStatus(status) {
  const value = String(status || '').trim().toUpperCase()
  if (value === 'DISABLED' || value === 'SUSPENDED') return 'DISABLED'
  return 'ACTIVE'
}

function isAllowedRole(role) {
  return ALLOWED_ROLES.includes(String(role || '').trim().toUpperCase())
}

function isAllowedStatus(status) {
  return ALLOWED_STATUSES.includes(String(status || '').trim().toUpperCase())
}

function readDb() {
  try {
    const raw = fs.readFileSync(DB_PATH, 'utf8')
    const parsed = JSON.parse(raw)
    return {
      categories: Array.isArray(parsed.categories) ? parsed.categories : [],
      pages: Array.isArray(parsed.pages) ? parsed.pages : [],
      users: Array.isArray(parsed.users) ? parsed.users : [],
      listings: Array.isArray(parsed.listings) ? parsed.listings : [],
    }
  } catch {
    return { categories: [], pages: [], users: [], listings: [] }
  }
}

function writeDb(db) {
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2))
}

function buildUserPayload(user) {
  const { password: _password, ...safeUser } = user
  return {
    ...safeUser,
    role: normalizeRole(safeUser.role),
    status: normalizeStatus(safeUser.status),
  }
}

function generateId(prefix) {
  return `${prefix}-${crypto.randomUUID().slice(0, 8)}`
}

function signToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: normalizeRole(user.role),
      status: normalizeStatus(user.status),
    },
    JWT_SECRET,
    { expiresIn: '7d' },
  )
}

function verifyToken(token) {
  if (!token) return null

  try {
    return jwt.verify(token, JWT_SECRET)
  } catch {
    return null
  }
}

async function hashPassword(password) {
  return bcrypt.hash(password, 12)
}

async function verifyPassword(password, hash) {
  return bcrypt.compare(password, hash)
}

async function createUser({ name, email, phone = '', password, role = 'USER', status = 'ACTIVE' }) {
  const trimmedName = String(name || '').trim()
  const trimmedEmail = String(email || '').trim().toLowerCase()
  const trimmedPassword = String(password || '')

  if (!trimmedName || !trimmedEmail || !trimmedPassword) {
    throw new Error('Name, email and password are required.')
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
    throw new Error('Please enter a valid email address.')
  }

  if (trimmedPassword.length < 8 || !/[a-z]/.test(trimmedPassword) || !/[A-Z]/.test(trimmedPassword) || !/\d/.test(trimmedPassword)) {
    throw new Error('Password must be at least 8 characters and include uppercase, lowercase, and a number.')
  }

  if (!isAllowedRole(role) || !isAllowedStatus(status)) {
    throw new Error('Invalid account role or status.')
  }

  const db = readDb()
  const exists = db.users.find((user) => String(user.email || '').trim().toLowerCase() === trimmedEmail)
  if (exists) {
    throw new Error('An account with this email already exists.')
  }

  const user = {
    id: generateId('u'),
    name: trimmedName,
    email: trimmedEmail,
    phone: String(phone || '').trim(),
    password: await hashPassword(trimmedPassword),
    role: normalizeRole(role),
    status: normalizeStatus(status),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  db.users.push(user)
  writeDb(db)

  return buildUserPayload(user)
}

function getAuthenticatedUser(req) {
  const authHeader = req.headers.authorization || ''
  const rawToken = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader
  const payload = verifyToken(rawToken)

  if (!payload) return null

  const db = readDb()
  const user = db.users.find(
    (entry) => entry.id === payload.id && String(entry.email || '').trim().toLowerCase() === String(payload.email || '').trim().toLowerCase(),
  )

  if (!user || normalizeStatus(user.status) === 'DISABLED') return null

  return buildUserPayload(user)
}

function requireAuth(req, res, next) {
  const user = getAuthenticatedUser(req)

  if (!user) {
    return res.status(401).json({ message: 'Authentication required.' })
  }

  req.user = user
  next()
}

function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required.' })
    }

    const currentRole = normalizeRole(req.user.role)
    if (!allowedRoles.includes(currentRole)) {
      return res.status(403).json({ message: 'You do not have permission to perform this action.' })
    }

    next()
  }
}

function getUserById(id) {
  const db = readDb()
  return db.users.find((user) => user.id === id)
}

async function ensureInitialSuperAdmin() {
  const email = String(process.env.SUPER_ADMIN_EMAIL || '').trim().toLowerCase()
  const password = String(process.env.SUPER_ADMIN_PASSWORD || '').trim()

  if (!email || !password) {
    console.log('No SUPER_ADMIN_EMAIL or SUPER_ADMIN_PASSWORD provided. Skipping initial Super Admin creation.')
    return
  }

  const db = readDb()
  const existing = db.users.find((user) => String(user.email || '').trim().toLowerCase() === email)

  if (existing) {
    existing.role = 'SUPER_ADMIN'
    existing.status = 'ACTIVE'
    existing.updatedAt = new Date().toISOString()
    if (!String(existing.password || '').startsWith('$2')) {
      existing.password = await hashPassword(password)
    }
    writeDb(db)
    console.log(`Super Admin seed confirmed for ${email}.`)
    return
  }

  db.users.push({
    id: generateId('sa'),
    name: 'Super Administrator',
    email,
    phone: '',
    password: await hashPassword(password),
    role: 'SUPER_ADMIN',
    status: 'ACTIVE',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  })

  writeDb(db)
  console.log(`Initial Super Admin created for ${email}.`)
}

app.use(cors({ origin: true, credentials: true }))
app.use(express.json())

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, confirmPassword, phone } = req.body || {}

    if (!name || !email || !password || !confirmPassword) {
      return res.status(400).json({ message: 'Name, email, password and confirmation are required.' })
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match.' })
    }

    if (password.length < 8 || !/[a-z]/.test(password) || !/[A-Z]/.test(password) || !/\d/.test(password)) {
      return res.status(400).json({ message: 'Password must be at least 8 characters and include uppercase, lowercase, and a number.' })
    }

    const user = await createUser({
      name,
      email,
      phone,
      password,
      role: 'USER',
      status: 'ACTIVE',
    })

    const token = signToken({ ...user, role: 'USER', status: 'ACTIVE' })
    return res.status(201).json({ user, token, message: 'Account created successfully.' })
  } catch (error) {
    const message = error.message || 'Registration failed.'
    return res.status(400).json({ message })
  }
})

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body || {}

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' })
    }

    const db = readDb()
    const user = db.users.find((entry) => String(entry.email || '').trim().toLowerCase() === String(email).trim().toLowerCase())

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' })
    }

    if (normalizeStatus(user.status) === 'DISABLED') {
      return res.status(403).json({ message: 'This account has been disabled.' })
    }

    const passwordMatches = typeof user.password === 'string' && user.password.startsWith('$2')
      ? await verifyPassword(password, user.password)
      : false
    if (!passwordMatches) {
      return res.status(401).json({ message: 'Invalid email or password.' })
    }

    const safeUser = buildUserPayload(user)
    const token = signToken(safeUser)
    return res.json({ user: safeUser, token, message: 'Login successful.' })
  } catch (error) {
    return res.status(500).json({ message: 'Unable to log in right now.' })
  }
})

app.post('/api/auth/logout', (req, res) => {
  res.json({ message: 'Logged out successfully.' })
})

app.get('/api/auth/me', requireAuth, (req, res) => {
  res.json({ user: req.user })
})

app.get('/api/users', requireAuth, (req, res) => {
  const db = readDb()
  if (!['ADMIN', 'SUPER_ADMIN'].includes(normalizeRole(req.user.role))) {
    const self = db.users.find((user) => user.id === req.user.id)
    return self ? res.json([buildUserPayload(self)]) : res.status(404).json({ message: 'User not found.' })
  }

  return res.json(db.users.map((user) => buildUserPayload(user)))
})

app.get('/api/users/:id', requireAuth, (req, res) => {
  const user = getUserById(req.params.id)
  if (!user) {
    return res.status(404).json({ message: 'User not found.' })
  }

  if (req.user.id !== user.id && !['ADMIN', 'SUPER_ADMIN'].includes(normalizeRole(req.user.role))) {
    return res.status(403).json({ message: 'You are not allowed to view this user.' })
  }

  return res.json(buildUserPayload(user))
})

app.put('/api/users/:id', requireAuth, async (req, res) => {
  const targetUser = getUserById(req.params.id)
  if (!targetUser) {
    return res.status(404).json({ message: 'User not found.' })
  }

  if (req.user.id !== targetUser.id && !['ADMIN', 'SUPER_ADMIN'].includes(normalizeRole(req.user.role))) {
    return res.status(403).json({ message: 'You are not allowed to update this user.' })
  }

  const db = readDb()
  const match = db.users.find((user) => user.id === req.params.id)
  if (!match) return res.status(404).json({ message: 'User not found.' })

  const actorRole = normalizeRole(req.user.role)
  const targetRole = normalizeRole(match.role)
  if (req.body.role !== undefined && !isAllowedRole(req.body.role)) {
    return res.status(400).json({ message: 'Invalid role.' })
  }
  if (req.body.status !== undefined && !isAllowedStatus(req.body.status)) {
    return res.status(400).json({ message: 'Invalid account status.' })
  }
  if (actorRole === 'USER' && (req.body.role !== undefined || req.body.status !== undefined)) {
    return res.status(403).json({ message: 'Users cannot change role or account status.' })
  }
  if (actorRole === 'ADMIN' && targetRole !== 'USER' && req.user.id !== match.id) {
    return res.status(403).json({ message: 'Admins can only manage user accounts.' })
  }
  if (actorRole === 'ADMIN' && req.body.role !== undefined && normalizeRole(req.body.role) !== 'USER') {
    return res.status(403).json({ message: 'Admins cannot grant administrative roles.' })
  }
  if (actorRole !== 'SUPER_ADMIN' && targetRole === 'SUPER_ADMIN') {
    return res.status(403).json({ message: 'Only Super Admins can modify Super Admin accounts.' })
  }
  if (req.body.status === 'DISABLED' && req.user.id === match.id) {
    return res.status(403).json({ message: 'You cannot disable your own account.' })
  }

  const nextRole = req.body.role !== undefined ? normalizeRole(req.body.role) : targetRole
  const nextStatus = req.body.status !== undefined ? normalizeStatus(req.body.status) : normalizeStatus(match.status)

  if (targetRole === 'SUPER_ADMIN' && nextRole !== 'SUPER_ADMIN') {
    const superAdminCount = db.users.filter((user) => normalizeRole(user.role) === 'SUPER_ADMIN').length
    if (superAdminCount <= 1) {
      return res.status(400).json({ message: 'The final Super Admin account cannot be removed or demoted.' })
    }
  }

  if (req.body.email !== undefined) {
    const nextEmail = String(req.body.email).trim().toLowerCase()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(nextEmail)) {
      return res.status(400).json({ message: 'Please enter a valid email address.' })
    }
    const duplicate = db.users.find((user) => user.id !== match.id && String(user.email || '').trim().toLowerCase() === nextEmail)
    if (duplicate) return res.status(409).json({ message: 'An account with this email already exists.' })
    match.email = nextEmail
  }

  match.name = req.body.name ? String(req.body.name).trim() || match.name : match.name
  match.phone = req.body.phone !== undefined ? String(req.body.phone).trim() : match.phone
  match.role = nextRole
  match.status = nextStatus
  match.updatedAt = new Date().toISOString()

  if (req.body.password && (req.body.password.length < 8 || !/[a-z]/.test(req.body.password) || !/[A-Z]/.test(req.body.password) || !/\d/.test(req.body.password))) {
    return res.status(400).json({ message: 'Password must be at least 8 characters and include uppercase, lowercase, and a number.' })
  }
  if (req.body.password) {
    match.password = await bcrypt.hash(req.body.password, 12)
  }

  writeDb(db)
  return res.json(buildUserPayload(match))
})

app.delete('/api/users/:id', requireAuth, requireRole('ADMIN', 'SUPER_ADMIN'), (req, res) => {
  const db = readDb()
  const target = db.users.find((user) => user.id === req.params.id)
  if (!target) return res.status(404).json({ message: 'User not found.' })

  const actorRole = normalizeRole(req.user.role)
  const targetRole = normalizeRole(target.role)
  if (target.id === req.user.id) return res.status(403).json({ message: 'You cannot delete your own account.' })
  if (actorRole === 'ADMIN' && targetRole !== 'USER') {
    return res.status(403).json({ message: 'Admins can only delete user accounts.' })
  }
  if (targetRole === 'SUPER_ADMIN') {
    const superAdminCount = db.users.filter((user) => normalizeRole(user.role) === 'SUPER_ADMIN').length
    if (superAdminCount <= 1) return res.status(400).json({ message: 'The final Super Admin account cannot be deleted.' })
    return res.status(403).json({ message: 'Super Admin accounts cannot be deleted here.' })
  }

  db.users = db.users.filter((user) => user.id !== target.id)
  writeDb(db)
  return res.status(204).send()
})

app.post('/api/admins', requireAuth, requireRole('SUPER_ADMIN'), async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body || {}

    if (!name || !email || !password || !confirmPassword) {
      return res.status(400).json({ message: 'Name, email, password and confirmation are required.' })
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match.' })
    }

    const admin = await createUser({
      name,
      email,
      password,
      phone: '',
      role: 'ADMIN',
      status: 'ACTIVE',
    })

    return res.status(201).json({ user: admin, message: 'Admin account created successfully.' })
  } catch (error) {
    return res.status(400).json({ message: error.message || 'Unable to create admin.' })
  }
})

app.get('/api/admins', requireAuth, requireRole('SUPER_ADMIN'), (req, res) => {
  const db = readDb()
  const admins = db.users.filter((user) => normalizeRole(user.role) === 'ADMIN' || normalizeRole(user.role) === 'SUPER_ADMIN')
  res.json(admins.map((user) => buildUserPayload(user)))
})

app.get('/api/admin/stats', requireAuth, requireRole('ADMIN', 'SUPER_ADMIN'), (req, res) => {
  const db = readDb()
  const users = db.users.map((user) => buildUserPayload(user))
  const listings = Array.isArray(db.listings) ? db.listings : []
  res.json({
    totalUsers: users.length,
    totalAdmins: users.filter((user) => user.role === 'ADMIN').length,
    totalListings: listings.length,
    pendingListings: listings.filter((listing) => String(listing.status || '').toUpperCase() === 'PENDING').length,
    approvedListings: listings.filter((listing) => String(listing.status || '').toUpperCase() === 'APPROVED').length,
    rejectedListings: listings.filter((listing) => String(listing.status || '').toUpperCase() === 'REJECTED').length,
    recentUsers: users.slice(-5).reverse(),
    recentListings: listings.slice(-5).reverse(),
  })
})

app.get('/categories', (req, res) => {
  res.json(readDb().categories)
})

app.post('/categories', requireAuth, requireRole('ADMIN', 'SUPER_ADMIN'), (req, res) => {
  const db = readDb()
  const category = { id: req.body.id || `cat-${Date.now()}`, ...req.body }
  db.categories.unshift(category)
  writeDb(db)
  res.status(201).json(category)
})

app.put('/categories/:id', requireAuth, requireRole('ADMIN', 'SUPER_ADMIN'), (req, res) => {
  const db = readDb()
  const index = db.categories.findIndex((item) => item.id === req.params.id)
  if (index === -1) return res.status(404).json({ message: 'Category not found.' })
  db.categories[index] = { ...db.categories[index], ...req.body }
  writeDb(db)
  res.json(db.categories[index])
})

app.delete('/categories/:id', requireAuth, requireRole('ADMIN', 'SUPER_ADMIN'), (req, res) => {
  const db = readDb()
  db.categories = db.categories.filter((item) => item.id !== req.params.id)
  writeDb(db)
  res.status(204).send()
})

app.get('/pages', (req, res) => {
  res.json(readDb().pages)
})

app.post('/pages', requireAuth, requireRole('ADMIN', 'SUPER_ADMIN'), (req, res) => {
  const db = readDb()
  const page = { id: req.body.id || `page-${Date.now()}`, ...req.body }
  db.pages.unshift(page)
  writeDb(db)
  res.status(201).json(page)
})

app.put('/pages/:id', requireAuth, requireRole('ADMIN', 'SUPER_ADMIN'), (req, res) => {
  const db = readDb()
  const index = db.pages.findIndex((item) => item.id === req.params.id)
  if (index === -1) return res.status(404).json({ message: 'Page not found.' })
  db.pages[index] = { ...db.pages[index], ...req.body }
  writeDb(db)
  res.json(db.pages[index])
})

app.delete('/pages/:id', requireAuth, requireRole('ADMIN', 'SUPER_ADMIN'), (req, res) => {
  const db = readDb()
  db.pages = db.pages.filter((item) => item.id !== req.params.id)
  writeDb(db)
  res.status(204).send()
})

app.use((req, res) => {
  res.status(404).json({ message: 'Not found.' })
})

if (require.main === module) {
  ensureInitialSuperAdmin().then(() => {
    app.listen(PORT, () => {
      console.log(`Backend running on port ${PORT}`)
    })
  }).catch((error) => {
    console.error('Failed to initialize backend', error)
    process.exit(1)
  })
}

module.exports = {
  app,
  createUser,
  verifyPassword,
  buildUserPayload,
  normalizeRole,
  normalizeStatus,
  signToken,
  ensureInitialSuperAdmin,
}
