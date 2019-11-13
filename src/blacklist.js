'use strict'

class Blacklist {
  constructor ({ storage }) {
    this.storage = storage
  }

  /**
   * Unique key in the token payload.
   *
   * @returns {String}
   */
  get identifier () {
    return 'jti'
  }

  /**
   * Add a token to the blacklist using the unique token
   * identifier (jti) from the given `payload`.
   *
   * @param {Payload} payload
   */
  async add (payload) {
    if (payload.missing('exp')) {
      return this.forever(payload)
    }

    if (await this.has(payload)) {
      return
    }

    const value = 'blacklisted'
    const ttl = 1234 // calculate ttl

    await this.storage.set(this.getTokenIdentifier(), value, ttl)
  }

  /**
   * Add a token to the blacklist indefinitely.
   *
   * @param {Payload} payload
   */
  async forever (payload) {

  }

  /**
   * Determine whether the token is alreay on the blacklist.
   *
   * @param {Payload} payload
   *
   * @returns {Boolean}
   */
  async has (payload) {
    //
  }

  /**
   * Remove a token from the blacklist.
   *
   * @param {Payload} payload
   */
  async remove () {

  }

  /**
   * Returns the token identifier.
   *
   * @param {Payload} payload
   *
   * @returns {Boolean}
   */
  getTokenIdentifier (payload) {
    return payload[this.identifier]
  }
}

module.exports = Blacklist
