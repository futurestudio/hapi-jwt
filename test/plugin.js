'use strict'

const Lab = require('@hapi/lab')
const Hapi = require('@hapi/hapi')
const Plugin = require('../src/plugin')
const { expect } = require('@hapi/code')

const { describe, it } = exports.lab = Lab.script()

const options = {
  secret: 'shhh',
  blacklist: {
    enabled: true,
    cache: {
      name: 'test-jwt',
      provider: '@hapi/catbox-redis'
    }
  }
}

describe('Plugin', () => {
  it('provisions a blacklist cache', async () => {
    const plugin = new Plugin()
    const server = new Hapi.Server()

    await server.register({
      plugin: {
        name: 'hapi-jwt',
        register: (server) => {
          return plugin.register(server, options)
        }
      }
    })

    expect(plugin.cache).to.exist()
  })
})
