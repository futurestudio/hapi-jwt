'use strict'

const JWS = require('jws')
const BaseProvider = require('./provider')

class JWTProvider extends BaseProvider {
  /**
     * Create a JWT. Returns the signed token.
     *
     * @param {Object} payload
     *
     * @returns {String}
     */
  async encode (payload) {
    const signer = JWS.createSign({
      header: {
        alg: this.getAlgo(),
        typ: typeof payload === 'object' ? 'JWT' : undefined
      },
      payload,
      privateKey: await this.getSigningKey()
    })

    return new Promise((resolve, reject) => {
      signer
        .on('done', token => resolve(token))
        .on('error', error => reject(error))
    })
  }

  /**
   * Decode a JWT. Returns the token payload.
   *
   * @param {String} token
   *
   * @returns {Object}
   */
  async decode (token) {
    const verifier = JWS.createVerify({
      signature: token,
      algorithm: this.getAlgo(),
      publicKey: await this.getVerificationKey()
    })

    return new Promise((resolve, reject) => {
      verifier
        .on('error', error => reject(error))
        .on('done', (valid, decoded) => {
          if (!valid) {
            throw new Error('Invalid token')
          }

          resolve(decoded.payload)
        })
    })
  }
}

module.exports = JWTProvider
