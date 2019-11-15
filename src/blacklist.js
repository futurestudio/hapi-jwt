'use strict'

const TimeUtils = require('./utils/time')

class Blacklist {
  constructor ({ cache, options }) {
    this.cache = cache
    this.options = options.blacklist
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
   * Determine whether the blacklist is enabled.
   *
   * @returns {Boolean}
   */
  isEnabled () {
    return this.options.enabled
  }

  /**
   * Determine whether the blacklist is disabled.
   *
   * @returns {Boolean}
   */
  isDisabled () {
    return !this.isEnabled()
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

    await this.cache.set(
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
    const exp = payload.getClaim('exp')
    const now = TimeUtils.now().getInSeconds()

    return exp - now
  }

  /**
   * Add a token to the blacklist indefinitely.
   *
   * @param {Payload} payload
   */
  async forever (payload) {
    await this.cache.set(
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
    const value = await this.cache.get(this.tokenIdentifier(payload))

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
    await this.cache.drop(this.tokenIdentifier(payload))
  }

  /**
   * Returns the token identifier.
   *
   * @param {Payload} payload
   *
   * @returns {Boolean}
   */
  tokenIdentifier (payload) {
    return payload.getClaim(this.identifier)
  }
}

module.exports = Blacklist
