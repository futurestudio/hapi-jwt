'use strict'

const Lab = require('@hapi/lab')
const HapiJWT = require('../src')
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
        enabled: false
      }
    }
  })

  return server
}

describe('JWT', () => {
  it('creates a JWT', async () => {
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

    expect(token).to.exist()
  })

  it('decdes a JWT', async () => {
    const user = { id: 1212, name: 'Marcus' }

    const server = await prepareServer()
    server.route([
      {
        method: 'GET',
        path: '/token',
        handler: async request => {
          return request.jwt.for(user)
        }
      },
      {
        method: 'GET',
        path: '/decode',
        handler: async request => {
          const payload = await request.jwt.check()

          return payload.toObject()
        }
      }
    ])

    const getTokenRequest = {
      method: 'GET',
      url: '/token'
    }

    const { result: token } = await server.inject(getTokenRequest)

    const decodeRequest = {
      method: 'GET',
      url: '/decode',
      headers: {
        authorization: `Bearer ${token}`
      }
    }

    const { result } = await server.inject(decodeRequest)
    expect(result.sub).to.equal(user.id)
    expect(result.exp).to.exist()
    expect(result.iat).to.exist()
    expect(result.nbf).to.exist()
    expect(result.iss).to.exist()
    expect(result.jti).to.exist().and.length(32)
  })
})
