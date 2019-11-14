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
      secret: '123456789-123456789-123456789-123456789'
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
})
