'use strict'

const JWT = require('./jwt')
const DefaultConfig = require('../config/default')

async function register (server, config) {
  await server.register({
    plugin: require('hapi-request-utilities')
  })

  const options = Object.assign({}, DefaultConfig, config)
  const cache = await createCache(server, options)

  server.decorate('request', 'jwt', (request) => {
    return new JWT({ request, cache, options })
  }, { apply: true })
}

async function createCache (server, options) {
  const { blacklist } = options
  const disabled = !blacklist.enabled

  if (disabled) {
    return
  }

  const { name, provider, ...rest } = blacklist.cache
  await server.cache.provision({ name, provider: require(provider) })

  return server.cache({ cache: name, segment: name, ...rest })
}

exports.plugin = {
  register,
  once: true,
  pkg: require('../package.json')
}
