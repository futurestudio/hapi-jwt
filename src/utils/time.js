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
}

module.exports = TimeUtils
