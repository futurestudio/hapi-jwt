'use strict'

const { JWS, errors: { JWSInvalid } } = require('jose')
const BaseProvider = require('./base-provider')

class JWTProvider extends BaseProvider {
  /**
     * Create a JWT. Returns the signed token.
     *
     * @param {Object} payload
     *
     * @returns {String}
     */
  async encode (payload) {
    if (!payload) {
      throw new Error('Cannot create a JWT from an empty payload')
    }

    return JWS.sign(payload, await this.getSigningKey(), this.header(payload))
  }

  header (payload) {
    return {
      alg: this.getAlgorithm(),
      typ: typeof payload === 'object' ? 'JWT' : undefined
    }
  }

  /**
   * Decode a JWT. Returns the token payload.
   *
   * @param {String} token
   *
   * @returns {Object}
   */
  async decode (token) {
    if (!token) {
      throw new Error(`Cannot decode JWT, received: ${token}`)
    }

    try {
      const result = JWS.verify(token, await this.getVerificationKey(), {
        algorithms: [this.getAlgorithm()]
      })

      return result
    } catch (error) {
      throw new JWSInvalid('Invalid token')
    }
  }
}

module.exports = JWTProvider
