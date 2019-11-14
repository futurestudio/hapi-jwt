'use strict'

const Token = require('./token')
const Blacklist = require('./blacklist')
const Provider = require('./providers/jws')
const PayloadFactory = require('./payload-factory')

class JWT {
  constructor ({ request, cache, options }) {
    this.options = options
    this.request = request
    this.provider = new Provider({ options })
    this.blacklist = new Blacklist({ cache, options })
  }

  /**
   * Generate a JWT for the given `user`.
   *
   * @param {Object} user
   *
   * @returns {String}
   */
  async for (user) {
    return this.provider.encode(
      this.createPayload(user).get()
    )
  }

  /**
   * Check and verify that the token is valid.
   *
   * @returns {Payload}
   */
  async check () {
    return this.factory().addCustomClaims(
      await this.provider.decode(this.token().get())
    ).make()
  }

  /**
   * Invalidate the `token` by adding it to a blacklist.
   *
   * @returns {JWT}
   */
  async invalidate (forever = false) {
    if (this.blacklist.isDisabled()) {
      throw new Error('You must enable the blacklist to invalidate a token')
    }

    return forever
      ? this.blacklist.forever(this.check())
      : this.blacklist.add(this.check())
  }

  /**
   * Returns a token instance wrapping the signed JWT.
   *
   * @returns {Token}
   */
  token () {
    return new Token(this.request.bearerToken())
  }

  /**
   * Create the JWT payload.
   *
   * @param {Object} user
   *
   * @returns {Payload}
   */
  createPayload (user) {
    return this.factory().addCustomClaims(this.getSubjectClaimFor(user)).make()
  }

  /**
   * Create a new payload factory instance.
   *
   * @returns {PayloadFactory}
   */
  factory () {
    return new PayloadFactory({
      request: this.request,
      options: this.options
    })
  }

  /**
   * Create an object containing the subject claim (sub)
   * for the given `user` object.
   *
   * @param {Object} user
   *
   * @returns {Object}
   */
  getSubjectClaimFor (user) {
    return {
      sub: user.id
    }
  }
}

module.exports = JWT
