'use strict'

const HapiJWT = require('..')
const Lab = require('@hapi/lab')
const Hapi = require('@hapi/hapi')
const { expect } = require('@hapi/code')

const { describe, it } = exports.lab = Lab.script()

async function prepareServer () {
  const server = new Hapi.Server()
  await server.initialize()

  await server.register({
    plugin: HapiJWT,
    options: {
      secret: '123456789-123456789-123456789-123456789',
      blacklist: {
        enabled: true,
        cache: {
          provider: '@hapi/catbox-redis'
        }
      }
    }
  })

  return server
}

async function createJwt () {
  const server = await prepareServer()
  server.route({
    method: 'GET',
    path: '/',
    handler: async request => {
      const user = { id: 1, name: 'Marcus' }

      return request.jwt.for(user)
    }
  })

  const request = {
    method: 'GET',
    url: '/'
  }

  const { result: token } = await server.inject(request)

  return token
}

describe('JWT Blacklist', () => {
  it('blacklists a JWT', { timeout: 5000 }, async () => {
    const server = await prepareServer()

    server.route({
      method: 'GET',
      path: '/',
      handler: async request => {
        await request.jwt.invalidate()

        try {
          await request.jwt.check()

          return 'not blacklisted'
        } catch (error) {
          return 'blacklisted'
        }
      }
    })

    const token = await createJwt()

    const request = {
      method: 'GET',
      url: '/',
      headers: {
        authorization: `Bearer ${token}`
      }
    }

    const { result } = await server.inject(request)
    expect(result).to.equal('blacklisted')
  })
})
