'use strict'

class Payload {
  /**
   * Create an instance based on the given `payload` object.
   *
   * @param {Map} claims
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
    const result = {}

    this.claims.forEach((value, key) => {
      result[key] = value
    })

    return result
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
