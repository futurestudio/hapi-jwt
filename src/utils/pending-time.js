'use strict'

const Dayjs = require('dayjs')
const UTC = require('dayjs/plugin/utc')

Dayjs.extend(UTC)

class PendingTime {
  /**
   * Creates a new UTC time instance,
   * starting at the current moment.
   */
  constructor (timestamp) {
    this.time = Dayjs(timestamp).utc()
  }

  /**
   * Returns the time in milliseconds.
   *
   * @returns {Number}
   */
  getInMilliseconds () {
    return this.time.valueOf()
  }

  /**
   * Returns the time in seconds.
   *
   * @returns {Number}
   */
  getInSeconds () {
    return this.time.unix()
  }

  /**
   * Add the given number of `minutes` to the
   * current time.
   *
   * @param {Number} minutes
   *
   * @returns {PendingTime}
   */
  addMinutes (minutes) {
    this.time.add(minutes, 'minute')

    return this
  }

  /**
   * Add the given number of `years` to the current time.
   *
   * @param {Number} years
   *
   * @returns {PendingTime}
   */
  addYears (years) {
    this.time.add(years, 'year')

    return this
  }
}

module.exports = PendingTime
