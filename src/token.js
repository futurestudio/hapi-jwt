'use strict'

class Token {
  /**
   * Create a token instance based on the given `value`.
   * The parameter of the constructure should be the
   * signed JWT in string format.
   *
   * @param {String} value - the signed JWT
   */
  constructor (value) {
    this.value = value

    this.ensureValidToken()
  }

  /**
   * Returns the plain JWT string.
   *
   * @returns {String}
   */
  plain () {
    return this.value
  }

  /**
   * Alias method for `.plain()` returning the plain JWT string.
   *
   * @returns {String}
   */
  toString () {
    return this.plain()
  }

  /**
   * Throws if the given JWT is invalid.
   *
   * @throws
   */
  ensureValidToken () {
    if (this.isValid()) {
      return
    }

    throw new Error(`Invalid JWT. Looks like the token is neither signed nor encrypted. Received token: ${this.value}`)
  }

  /**
   * Determines whether the token has a valid format by
   * checking whether the token is signed or encrypted.
   *
   * @returns {Boolean}
   */
  isValid () {
    return this.isUnsigned() || this.isSigned() || this.isEncrypted()
  }

  /**
   * Determines whether the token is an unsigned token (JWS). Unssigned
   * tokens consist of two parts with a trailing dot. The third part
   * of an unsigend token is empty in contrast to a signed token.
   *
   * @returns {Boolean}
   */
  isUnsigned () {
    const parts = this.value.split('.')

    return parts.length === 3 && parts[2] === ''
  }

  /**
   * Determines whether the token is a signed token (JWS). Signed
   * tokens consist of three parts, separated by two dots.
   *
   * @returns {Boolean}
   */
  isSigned () {
    const parts = this.value.split('.')

    return parts.length === 3 && parts[2] !== ''
  }

  /**
   * Determines whether the token is an encrypted token (JWE). Encrypted
   * tokens consist of five parts, separated by four dots.
   *
   * @returns {Boolean}
   */
  isEncrypted () {
    return this.value.split('.').length === 5
  }
}

module.exports = Token
