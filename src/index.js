'use strict'

const JWT = require('./jwt')

async function register (server, options) {
  await server.register({
    plugin: require('hapi-request-utilities')
  })

  server.decorate('request', 'jwt', (request) => {
    return new JWT({ request, options })
  }, { apply: true })
}

exports.plugin = {
  register,
  once: true,
  pkg: require('../package.json')
}
