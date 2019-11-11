'use strict'

class Token {
  /**
   * Create a token instance based on the given `value`.
   *
   * @param {String} value
   */
  constructor (value) {
    this.value = value
  }

  /**
   * Returns the JWT.
   *
   * @returns {Object}
   */
  get () {
    return this.value
  }

  /**
   * Determines whether the token has a valid format by
   * checking whether the token is signed or encrypted.
   *
   * @returns {Boolean}
   */
  isValid () {
    return this.isSigned() || this.isEncrypted()
  }

  /**
   * Determines whether the token is a signed token (JWS).
   * Signed tokens consist of three parts, separated by
   * four dots.
   *
   * @returns {Boolean}
   */
  isSigned () {
    return this.value.split('.').length === 3
  }

  /**
   * Determines whether the token is an encrypted token (JWE).
   * Encrypted tokens consist of five parts, separated by
   * four dots.
   *
   * @returns {Boolean}
   */
  isEncrypted () {
    return this.value.split('.').length === 5
  }
}

module.exports = Token
