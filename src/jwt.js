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
   * Alias for `JWT.sign(user)` creating
   * a signed JWT for the given `user`.
   *
   * @param {Object} user
   *
   * @returns {String}
   */
  async for (user) {
    return this.provider.encode(
      this.createPayload(user).toObject()
    )
  }

  /**
   * Generate a JWT for the given `user`.
   *
   * @param {Object} user
   *
   * @returns {String}
   */
  async sign (user) {
    return this.for(user)
  }

  /**
   * Check and verify that the token is valid.
   *
   * @returns {Payload}
   *
   * @throws
   */
  async payload () {
    const payload = this.payloadFactory().addCustomClaims(
      await this.provider.decode(this.token().plain())
    ).make()

    if (this.blacklist.isEnabled() && await this.blacklist.has(payload)) {
      throw new Error('Token is blacklisted')
    }

    return payload
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

    const payload = await this.payload()

    return forever
      ? this.blacklist.forever(payload)
      : this.blacklist.add(payload)
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
    return this.payloadFactory().addCustomClaims(this.getSubjectClaimFor(user)).make()
  }

  /**
   * Create a new payload factory instance.
   *
   * @returns {PayloadFactory}
   */
  payloadFactory () {
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
