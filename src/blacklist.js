'use strict'

const TimeUtils = require('./utils/time')

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

    await this.storage.set(
      this.tokenIdentifier(payload),
      'blacklisted',
      this.getMillisecondsUntilExpired(payload)
    )
  }

  /**
   * Returns the number of milliseoncds until token expiry.
   *
   * @param {Payload} payload
   *
   * @returns {Number}
   */
  getMillisecondsUntilExpired (payload) {
    return TimeUtils.from(payload.exp).getInMilliseconds()
  }

  /**
   * Add a token to the blacklist indefinitely.
   *
   * @param {Payload} payload
   */
  async forever (payload) {
    await this.storage.set(
      this.tokenIdentifier(payload),
      'forever',
      TimeUtils.now().addYears(10).getInMilliseconds()
    )
  }

  /**
   * Determine whether the token is alreay on the blacklist.
   *
   * @param {Payload} payload
   *
   * @returns {Boolean}
   */
  async has (payload) {
    const value = await this.storage.get(this.tokenIdentifier(payload))

    return value === 'forever'
      ? true
      : !!value
  }

  /**
   * Remove a token from the blacklist.
   *
   * @param {Payload} payload
   */
  async remove (payload) {
    await this.storage.drop(this.tokenIdentifier(payload))
  }

  /**
   * Returns the token identifier.
   *
   * @param {Payload} payload
   *
   * @returns {Boolean}
   */
  tokenIdentifier (payload) {
    return payload[this.identifier]
  }
}

module.exports = Blacklist
