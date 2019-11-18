'use strict'

const HapiJWT = require('..')
const Hapi = require('@hapi/hapi')

async function kickOff () {
  const server = new Hapi.Server({
    port: 3000
  })

  const options = {
    secret: '12345678'.repeat(4), // creates a string with 32 chars :) DON'T USE THIS IN YOUR APP!,
    blacklist: {
      cache: {
        name: 'hapi-jwt:example',
        provider: '@hapi/catbox-redis'
      }
    }
  }

  await server.register({
    plugin: HapiJWT,
    options
  })

  server.route({
    method: 'GET',
    path: '/',
    handler: async request => {
      const user = { id: 1, name: 'Marcus' }

      const token = await request.jwt.for(user)
      const payload = await request.jwt.provider.decode(token)

      return { token, payload }
    }
  })

  await server.start()
  console.log('Server started at http://localhost:3000')
}

kickOff()
