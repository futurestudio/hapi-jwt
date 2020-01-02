'use strict'

const JwSigner = require('jws')
const { JWS, errors } = require('jose')
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

    return this.isNoneAlgorithm()
      ? this.signWithoutAlgorithm(payload)
      : this.signWithAlgorithm(payload)
  }

  isNoneAlgorithm () {
    return this.getAlgorithm() === 'none'
  }

  async signWithoutAlgorithm (payload) {
    const signer = JwSigner.createSign({
      payload,
      header: this.header(),
      privateKey: await this.getSigningKey()
    })

    return new Promise((resolve, reject) => {
      signer
        .on('done', token => resolve(token))
        .on('error', error => reject(error))
    })
  }

  async signWithAlgorithm (payload) {
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
      throw error instanceof errors.JWSInvalid
        ? new Error('Invalid token')
        : error
    }
  }
}

module.exports = JWTProvider
