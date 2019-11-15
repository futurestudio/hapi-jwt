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
   * Returns the claim identified by `name`.
   *
   * @param {String} name
   *
   * @returns {*}
   */
  get (name) {
    return this.getClaim(name)
  }

  /**
   * Alias for `.get(name)` returning the claim identified by `name`.
   *
   * @param {String} name
   *
   * @returns {*}
   */
  getClaim (name) {
    return this.claimSet.get(name)
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
  toObject () {
    return this.claimSet.toObject()
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

  /**
   * Determines whether the payload is missing a claim with the given `name`.
   *
   * @param {String} name
   *
   * @returns {Boolean}
   */
  missing (name) {
    return !this.claimSet.has(name)
  }
}

module.exports = Payload
