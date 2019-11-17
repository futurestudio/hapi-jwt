'use strict'

const Lab = require('@hapi/lab')
const Crypto = require('crypto')
const Hapi = require('@hapi/hapi')
const { expect } = require('@hapi/code')
const Payload = require('../src/payload')
const ClaimSet = require('../src/claims/set')
const Blacklist = require('../src/blacklist')
const TimeUtils = require('../src/utils/time')
const CatboxRedis = require('@hapi/catbox-redis')
const PayloadFactory = require('../src/payload-factory')

const { describe, it, before } = exports.lab = Lab.script()

const blacklist = new Blacklist({ options: { blacklist: { enabled: true } } })

function jti () {
  return Crypto.randomBytes(20).toString('hex')
}

describe('JWT Blacklist', () => {
  before(async () => {
    const server = new Hapi.Server()
    const cacheName = 'test-jwt-blacklist'

    await server.cache.provision({ name: cacheName, provider: CatboxRedis })
    blacklist.cache = server.cache({ cache: cacheName, segment: cacheName })

    await server.initialize()
  })

  it('token without exp', async () => {
    const payload = new PayloadFactory({
      request: {
        root: () => 'hapi-jwt.test'
      },
      options: { ttl: 1 }
    }).make()

    payload.claimSet.delete('exp')

    await blacklist.add(payload)
    expect(await blacklist.has(payload)).to.be.true()
  })

  it('token exp', async () => {
    const claimSet = new ClaimSet(Object.entries({
      sub: 1,
      jti: jti(),
      exp: TimeUtils.now().addMinutes(1).getInSeconds()
    }))

    const payload = new Payload(claimSet)

    await blacklist.add(payload)
    expect(await blacklist.has(payload)).to.be.true()
  })

  it('forever', async () => {
    const claimSet = new ClaimSet(Object.entries({
      sub: 1,
      jti: jti(),
      exp: TimeUtils.now().addMinutes(1).getInSeconds()
    }))

    const payload = new Payload(claimSet)

    await blacklist.forever(payload)
    expect(await blacklist.has(payload)).to.be.true()
  })

  it('returns early when already on the blacklist', async () => {
    const claimSet = new ClaimSet(Object.entries({
      sub: 1,
      jti: jti(),
      exp: TimeUtils.now().addMinutes(1).getInSeconds()
    }))

    const payload = new Payload(claimSet)
    expect(await blacklist.has(payload)).to.be.false()
    await blacklist.add(payload)
    expect(await blacklist.has(payload)).to.be.true()
    await blacklist.add(payload)
    expect(await blacklist.has(payload)).to.be.true()
  })

  it('removes from the blacklist', async () => {
    const claimSet = new ClaimSet(Object.entries({
      sub: 1,
      jti: jti(),
      exp: TimeUtils.now().addMinutes(1).getInSeconds()
    }))

    const payload = new Payload(claimSet)

    await blacklist.add(payload)
    expect(await blacklist.has(payload)).to.be.true()
    await blacklist.remove(payload)
    expect(await blacklist.has(payload)).to.be.false()
  })

  it('uses a token ID generator', async () => {
    const tokenId = jti()
    const claimSet = new ClaimSet(Object.entries({
      jti: tokenId,
      sub: 1,
      exp: TimeUtils.now().addMinutes(1).getInSeconds()
    }))

    const payload = new Payload(claimSet)

    expect(await blacklist.tokenIdentifier(payload)).to.equal(tokenId)
  })

  it('is enabled/disabled', async () => {
    const blacklistDisabled = new Blacklist({ options: { blacklist: { enabled: false } } })
    expect(blacklistDisabled.isDisabled()).to.be.true()
    expect(blacklistDisabled.isEnabled()).to.be.false()

    const blacklistEnabled = new Blacklist({ options: { blacklist: { enabled: true } } })
    expect(blacklistEnabled.isEnabled()).to.be.true()
    expect(blacklistEnabled.isDisabled()).to.be.false()
  })
})
