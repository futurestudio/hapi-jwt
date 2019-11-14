'use strict'

const PendingTime = require('./pending-time')

class TimeUtils {
  /**
   * Returns a `PendingTime` instance providing convenient
   * methods around the current time. These time utils
   * always use UTC for time calculations.
   *
   * @returns {PendingTime}
   */
  static now () {
    return new PendingTime()
  }

  /**
   * Returns a `PendingTime` instance for the given `timestamp`.
   *
   * @returns {PendingTime}
   */
  static from (timestamp) {
    return new PendingTime(timestamp)
  }
}

module.exports = TimeUtils
