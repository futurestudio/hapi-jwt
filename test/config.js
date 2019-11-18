'use strict'

const Lab = require('@hapi/lab')
const { expect } = require('@hapi/code')

const { describe, it } = exports.lab = Lab.script()

describe('JWT Config', () => {
  it('has a default config', async () => {
    const file = require.resolve('../config/default')
    delete require.cache[file]

    const config = require('../config/default')
    expect(config).to.exist()
    expect(config.ttl).to.equal(15)
    expect(config.secret).to.be.undefined()
    expect(config.algorithm).to.equal('HS256')
    expect(config.keys.public).to.be.undefined()
    expect(config.keys.private).to.be.undefined()
    expect(config.blacklist.enabled).to.be.false()
    expect(config.blacklist.cache.provider).to.be.undefined()
    expect(config.blacklist.cache.name).to.be.equal('jwt:blacklist')
  })

  it('injects a secret', async () => {
    const file = require.resolve('../config/default')
    delete require.cache[file]

    process.env.JWT_SECRET = 'secret'
    const config = require('../config/default')
    expect(config.secret).to.equal('secret')
  })

  it('injects an algorithm', async () => {
    const file = require.resolve('../config/default')
    delete require.cache[file]

    process.env.JWT_ALGORITHM = 'my-algo'
    const config = require('../config/default')
    expect(config.algorithm).to.equal('my-algo')
  })

  it('injects a ttl', async () => {
    const file = require.resolve('../config/default')
    delete require.cache[file]

    process.env.JWT_TTL = 60
    const config = require('../config/default')
    expect(config.ttl).to.equal(60)
  })

  it('injects keys', async () => {
    const file = require.resolve('../config/default')
    delete require.cache[file]

    process.env.JWT_PUBLIC_KEY_PATH = 'my-public-key-path'
    process.env.JWT_PRIVATE_KEY_PATH = 'my-private-key-path'
    const config = require('../config/default')
    expect(config.keys.public).to.equal('my-public-key-path')
    expect(config.keys.private).to.equal('my-private-key-path')
  })

  it('injects blacklist cache configs', async () => {
    const file = require.resolve('../config/default')
    delete require.cache[file]

    process.env.JWT_BLACKLIST_ENABLED = false
    process.env.JWT_BLACKLIST_NAME = 'test-blacklist-name'
    process.env.JWT_BLACKLIST_PROVIDER = 'test-blacklist-provider'
    const config = require('../config/default')
    expect(config.blacklist.enabled).to.equal('false')
    expect(config.blacklist.cache.name).to.equal('test-blacklist-name')
    expect(config.blacklist.cache.provider).to.equal('test-blacklist-provider')
  })
})
