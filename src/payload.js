'use strict'

class Payload {
  /**
   * Create an instance based on the given `payload` object.
   *
   * @param {ClaimCollection} claims
   */
  constructor (claims) {
    this.claims = claims
  }

  /**
   * Returns the claims map.
   *
   * @returns {Map}
   */
  getClaims () {
    return this.claims
  }

  /**
   * Returns the payload as an object containing the claims.
   *
   * @returns {Object}
   */
  get () {
    return Object.fromEntries(this.claims)
  }

  /**
   * Alias for .get(). Returns the payload as an object.
   *
   * @returns {Object}
   */
  asObject () {
    return this.get()
  }

  /**
   * Determines whether the payload contains a claim with the given `name`.
   *
   * @param {String} name
   *
   * @returns {Boolean}
   */
  has (name) {
    return this.claims.has(name)
  }
}

module.exports = Payload
