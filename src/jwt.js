'use strict'

const Token = require('./token')
const Provider = require('./providers/jws')
const PayloadFactory = require('./payload-factory')

class JWT {
  constructor ({ options, request }) {
    this.token = undefined
    this.options = options
    this.request = request
    this.provider = new Provider({ options })
  }

  /**
   * Generate a JWT for the given `user`.
   *
   * @param {Object} user
   *
   * @returns {String}
   */
  async from (user) {
    const payload = this.createPayload(user)

    return this.provider.encode(payload.get())
  }

  async verify () {
    // TODO
  }

  async invalidate (token) {
    // TODO
  }

  setToken (token) {
    this.token = token instanceof Token ? token : new Token(token)

    return this
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
