'use strict'

class ClaimSet extends Map {
  /**
   * Add a claim to the claim set.
   *
   * @param {String} key
   * @param {*} value
   */
  add (key, value) {
    this.set(key, value)

    return this
  }

  /**
   * Coverts the claim set to an object.
   *
   * @returns {Object}
   */
  toObject () {
    const result = {}

    this.forEach((value, key) => {
      result[key] = value
    })

    return result
  }
}

module.exports = ClaimSet
