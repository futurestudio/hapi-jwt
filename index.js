'use strict'

const Plugin = require('./src/plugin')

exports.plugin = {
  once: true,
  pkg: require('./package.json'),
  requirements: { hapi: '>=18.0.0' },
  register: async (server, options) => {
    return new Plugin().register(server, options)
  }
}
