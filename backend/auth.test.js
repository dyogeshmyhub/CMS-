const test = require('node:test')
const assert = require('node:assert/strict')

const serverModule = require('./server.js')

test('server exports auth helpers', () => {
  assert.ok(serverModule.createUser)
  assert.ok(serverModule.verifyPassword)
  assert.ok(serverModule.buildUserPayload)
})

test('public ads require active status and dates inside the current window', () => {
  const today = '2026-09-30'
  assert.equal(serverModule.isAdvertisementVisible({ status: 'ACTIVE', startDate: '2026-09-01', endDate: '2026-10-01' }, today), true)
  assert.equal(serverModule.isAdvertisementVisible({ status: 'INACTIVE', startDate: '', endDate: '' }, today), false)
  assert.equal(serverModule.isAdvertisementVisible({ status: 'ACTIVE', startDate: '2026-10-01', endDate: '' }, today), false)
  assert.equal(serverModule.isAdvertisementVisible({ status: 'ACTIVE', startDate: '', endDate: '2026-09-29' }, today), false)
})

test('only five active advertisements are allowed', () => {
  const ads = Array.from({ length: 5 }, (_, index) => ({ id: `ad-${index}`, status: 'ACTIVE' }))
  ads.push({ id: 'inactive-ad', status: 'INACTIVE' })

  assert.equal(serverModule.MAX_ACTIVE_ADVERTISEMENTS, 5)
  assert.equal(serverModule.canAddActiveAdvertisement(ads), false)
  assert.equal(serverModule.canAddActiveAdvertisement(ads, 'ad-0'), true)
})

test('advertisement input requires content and safe action URLs', () => {
  assert.match(serverModule.normalizeAdvertisement({}).error, /required/)
  assert.match(serverModule.normalizeAdvertisement({
    title: 'Ad', advertiser: 'Company', description: 'Details', ctaLink: 'javascript:alert(1)',
  }).error, /http\(s\) URL/)
  assert.equal(serverModule.normalizeAdvertisement({
    title: 'Ad', advertiser: 'Company', description: 'Details', status: 'ACTIVE', ctaLink: '/offer',
  }).data.status, 'ACTIVE')
})
