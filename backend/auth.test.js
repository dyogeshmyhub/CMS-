const test = require('node:test')
const assert = require('node:assert/strict')

const serverModule = require('./server.js')

test('server exports auth helpers', () => {
  assert.ok(serverModule.createUser)
  assert.ok(serverModule.verifyPassword)
  assert.ok(serverModule.buildUserPayload)
})
