'use strict'

const Sinon = require('sinon')
const Lab = require('@hapi/lab')
const Crypto = require('crypto')
const JWT = require('../src/jwt')
const Merge = require('deepmerge')
const Token = require('../src/token')
const { expect } = require('@hapi/code')

const DefaultOptions = require('../config/default')

const { describe, it } = exports.lab = Lab.script()

const cache = {
  get: () => {},
  set: () => {}
}

const request = {
  root: () => { return 'hapi-jwt.testing' }
}

const getOptions = (options = {}) => {
  return Merge.all([DefaultOptions, { secret: Crypto.randomBytes(20).toString('hex'), blacklist: { enabled: true } }, options])
}

describe('JWT', () => {
  it('create and decodes a JWT', async () => {
    const user = { id: 1, name: 'Marcus' }
    const jwt = new JWT({ options: getOptions(), request, cache })

    const jws = await jwt.sign(user)
    request.bearerToken = () => { return jws }

    const token = new Token(jws)
    expect(token.isValid()).to.be.true()

    const decoded = await jwt.payload(token.plain())
    expect(decoded.get('jti')).to.exist()
    expect(decoded.get('exp')).to.exist()
    expect(decoded.get('iat')).to.exist()
    expect(decoded.get('nbf')).to.exist()
    expect(decoded.get('sub')).to.equal(user.id)
    expect(decoded.get('iss')).to.equal('hapi-jwt.testing')
  })

  it('proceeds decoding when the blacklist is disabled', async () => {
    const user = { id: 1, name: 'Marcus' }
    const jwt = new JWT({ options: getOptions({ blacklist: { enabled: false } }), request, cache })

    const jws = await jwt.for(user)
    request.bearerToken = () => { return jws }

    const token = new Token(jws)
    const decoded = await jwt.payload(token.plain())
    expect(decoded.get('jti')).to.exist()
  })

  it('throws if a token is on the blacklist', async () => {
    const user = { id: 1, name: 'Marcus' }
    const jwt = new JWT({ options: getOptions(), request, cache })

    const jws = await jwt.for(user)
    request.bearerToken = () => { return jws }

    const blacklistHas = Sinon.stub(jwt.blacklist, 'has').returns(true)
    await expect(jwt.payload()).to.reject()

    blacklistHas.restore()
  })

  it('throws when trying to invalidate a token when the blacklist is disabled', async () => {
    const options = { blacklist: { enabled: false } }
    const jwt = new JWT({ options: getOptions(options), request: {}, cache })
    await expect(jwt.invalidate('forever')).to.reject(Error)
  })

  it('invalidates a token', async () => {
    const user = { id: 1, name: 'Marcus' }
    request.bearerToken = () => { return jws }

    const jwt = new JWT({ options: getOptions(), request, cache })
    const add = Sinon.stub(jwt.blacklist, 'add')

    const jws = await jwt.for(user)
    await jwt.invalidate()

    await expect(add.calledOnce).to.be.true()

    add.restore()
  })

  it('invalidates a token forever', async () => {
    const user = { id: 1, name: 'Marcus' }
    request.bearerToken = () => { return jws }

    const jwt = new JWT({ options: getOptions(), request, cache })
    const add = Sinon.stub(jwt.blacklist, 'add')
    const forever = Sinon.stub(jwt.blacklist, 'forever')

    const jws = await jwt.for(user)
    await jwt.invalidate('forever')

    await expect(add.called).to.be.false()
    await expect(forever.calledOnce).to.be.true()

    add.restore()
    forever.restore()
  })
})
