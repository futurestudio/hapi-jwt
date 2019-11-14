'use strict'

const Crypto = require('crypto')
const TimeUtils = require('../utils/time')

class ClaimFactory {
  constructor ({ request, options }) {
    this.request = request
  }

  /**
   * Create the claim value.
   *
   * @param {String} name
   *
   * @returns {*}
   */
  make (name) {
    if (this.has(name)) {
      return this[name]()
    }

    throw new Error('Cannot resolve claim')
  }

  /**
   * Determine whether the method to create a claim value is available.
   *
   * @param {String} name
   *
   * @returns {Boolean}
   */
  has (name) {
    return !!this[name]
  }

  /**
   * Returns the JWT identifier (jti) value.
   *
   * @returns {String}
   */
  jti () {
    return Crypto
      .randomBytes(Math.ceil(64 * 0.75))
      .toString('hex')
      .slice(0, 32)
  }

  /**
   * Returns the issuer claim (iss) value.
   *
   * @returns {String}
   */
  iss () {
    return this.request.url.host // this.request.root()
  }

  /**
   * Returns the issued at claim (iat) value in milliseconds.
   *
   * @returns {Number}
   */
  iat () {
    return TimeUtils.now().getInSeconds()
  }

  /**
   * Returns the not before claim (nbf) value in milliseconds.
   *
   * @returns {Date}
   */
  nbf () {
    return TimeUtils.now().getInSeconds()
  }

  /**
   * Returns the expire claim (exp) value in milliseconds.
   *
   * @returns {Number}
   */
  exp () {
    return TimeUtils.now().addMinutes(15).getInSeconds()
  }
}

module.exports = ClaimFactory
