'use strict'

class Payload {
  /**
   * Create an instance based on the given `payload` object.
   *
   * @param {ClaimSet} claimSet
   */
  constructor (claimSet) {
    this.claimSet = claimSet
  }

  /**
   * Returns the claims map.
   *
   * @returns {Map}
   */
  getClaims () {
    return this.claimSet
  }

  /**
   * Returns the payload as an object containing the claims.
   *
   * @returns {Object}
   */
  get () {
    return this.claimSet.toObject()
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
    return this.claimSet.has(name)
  }
}

module.exports = Payload
