'use strict'

const JWT = require('./jwt')
const Joi = require('@hapi/joi')
const Merge = require('deepmerge')
const DefaultConfig = require('../config/default')

class Plugin {
  constructor () {
    this.cache = null
    this.options = DefaultConfig
  }

  /**
   * Returns the blacklist options.
   *
   * @returns {Object}
   */
  get blacklistOptions () {
    return this.options.blacklist
  }

  /**
   * Registers all plugin dependencies and creates a
   * cache instance for the JWT blacklist.
   *
   * @param {Server} server
   * @param {Object} config
   */
  async register (server, config) {
    await server.register({
      plugin: require('hapi-request-utilities')
    })

    this.createOptions(config)
    this.ensureValidOptions()
    await this.createCache(server)

    server.decorate('request', 'jwt', (request) => {
      return new JWT({
        request,
        cache: this.cache,
        options: this.options
      })
    }, { apply: true })
  }

  /**
   * Merge the default config with the user-land options.
   *
   * @param {Object} options
   */
  createOptions (options) {
    this.options = Merge(this.options, options)
  }

  /**
   * Validate the plugin options and throw if invalid.
   *
   * @throws
   */
  ensureValidOptions () {
    Joi.attempt(this.options, Joi.object({
      secret: Joi.string(),

      keys: Joi
        .object({
          public: Joi.string().when('secret', { is: Joi.string(), then: Joi.optional() }).required(),
          private: Joi.string().when('secret', { is: Joi.string(), then: Joi.optional() }).required()
        })
        .when('secret', { is: Joi.string().min(1), then: Joi.optional() }),

      algorithm: Joi.string().required(),

      ttl: Joi.number().required(),

      blacklist: Joi
        .object()
        .keys({
          enabled: Joi.boolean().required(),

          cache: Joi
            .object()
            .keys({
              name: Joi.string(),

              provider: Joi.string()
            })
            .required()
            .when('enabled', { is: true, then: Joi.object({ name: Joi.required(), provider: Joi.required() }) })
        })
    })
    )
  }

  /**
   * Determine whether the blacklist is enabled.
   *
   * @returns {Boolean}
   */
  blacklistEnabled () {
    return this.blacklistOptions.enabled
  }

  /**
   * Creates a cache instance for the JWT blacklist
   * if blacklisting is enabled.
   *
   * @param {Server} server
   * @param {Object} options
   */
  async createCache (server) {
    if (this.blacklistEnabled()) {
      const { name, provider, ...rest } = this.blacklistOptions.cache
      await server.cache.provision({ name, provider: require(provider) })

      this.cache = server.cache({ cache: name, segment: name, ...rest })
    }
  }
}

module.exports = Plugin
