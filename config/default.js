'use strict'

module.exports = {
  /**
   * Tba.
   */
  secret: process.env.JWT_SECRET,

  /**
   * Tba.
   */
  keys: {
    public: process.env.JWT_PUBLIC_KEY_PATH,

    private: process.env.JWT_PRIVATE_KEY_PATH
  },

  /**
   * JWT algorithm
   */
  algorithm: process.env.JWT_ALGORITHM || 'HS256',

  /**
   * JWT life time (in minutes)
   */
  ttl: process.env.JWT_TTL || 15,

  /**
   * JWT blacklist config
   */
  blacklist: {
    /**
     * Blacklisting enabled? If yes, it requires a (persistent) cache instance
     */
    enabled: true,

    /**
     * Hapi cache configuration to persistently store blacklisted tokens
     */
    cache: {
      /**
       * Tba.
       */
      name: process.env.JWT_BLACKLIST_NAME || 'jwt/blacklist',

      /**
       * Tba.
       */
      provider: '@hapi/catbox-redis'
    }
  }
}
