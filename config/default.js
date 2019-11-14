'use strict'

module.exports = {
  /**
   * --------------------------------------------------------------------------
   * JWT Secret
   * --------------------------------------------------------------------------
   *
   * This JWT secret key is used to sign a token for symmetric algorithms.
   * Symmetric algorithms (HMAC) start with "HS", like "HS256".
   * Ensure that the JWT secret has at least 32 characters.
   *
   * Symmetric algorithms:
   *   HS256, HS384, HS512
   *
   */
  secret: process.env.JWT_SECRET,

  /**
   * --------------------------------------------------------------------------
   * JWT Key Pair
   * --------------------------------------------------------------------------
   *
   * Using an asymmetric algorithm to sign your tokens requires a key pair
   * consisting of a public and private key.
   *
   * Asymmetric algorithms:
   *   RS256, RS384, RS512,
   *   ES256, ES384, ES512,
   *   PS256, PS384, PS512
   *
   */
  keys: {
    /**
     * --------------------------------------------------------------------------
     * JWT Public Key Path
     * --------------------------------------------------------------------------
     *
     * The path to your public key.
     *
     * For example: '/home/users/marcus/dev/my-project/storage/keys/id_rsa.pub'
     *
     */
    public: process.env.JWT_PUBLIC_KEY_PATH,

    /**
     * --------------------------------------------------------------------------
     * JWT Private Key Path
     * --------------------------------------------------------------------------
     *
     * The path to your private key.
     *
     * For example: '/home/users/marcus/dev/my-project/storage/keys/id_rsa'
     *
     */
    private: process.env.JWT_PRIVATE_KEY_PATH
  },

  /**
   * --------------------------------------------------------------------------
   * JWT Signing Algorithm
   * --------------------------------------------------------------------------
   *
   * Specify the JWT signing algorithm below. The algorithms prefixed with 'HS'
   * use a symmetric signing algorithm requiring a secret. In contrast, the
   * alrogithms prefixed with 'RS', 'ES', and 'PS' require a key pair.
   *
   * Allowed algorithms:
   *   HS256, HS384, HS512
   *   RS256, RS384, RS512,
   *   ES256, ES384, ES512,
   *   PS256, PS384, PS512
   *
   */
  algorithm: process.env.JWT_ALGORITHM || 'HS256',

  /**
   * --------------------------------------------------------------------------
   * JWT Lifetime
   * --------------------------------------------------------------------------
   *
   * This option defines the lifetime of a token (in minutes). The default
   * lifetime is 15 minutes.
   *
   */
  ttl: process.env.JWT_TTL || 15,

  /**
   * --------------------------------------------------------------------------
   * JWT Blacklist Settings
   * --------------------------------------------------------------------------
   *
   * This section defines the blacklisting options for JWTs. Blacklists use
   * the hapi server caches on top of catbox. When using blacklists, make
   * sure to have a persistent cache provider, like `catbox-redis` or
   * `catbox-memcached` and avoid memory-based cache storers.
   *
   */
  blacklist: {
    /**
     * --------------------------------------------------------------------------
     * JWT Blacklist Enabled
     * --------------------------------------------------------------------------
     *
     * The blacklist allows you to revoke tokens, for example on a user logout.
     * If you don't want or need this functionality, you may disable it here.
     *
     */
    enabled: true,

    /**
     * --------------------------------------------------------------------------
     * JWT Blacklist Cache
     * --------------------------------------------------------------------------
     *
     * The blacklist allows you to revoke tokens, for example on a user logout.
     * If you don't want or need this functionality, you may disable it here.
     * All options inside of this `cache` object are passed through to
     * hapi to provision the caching layer on using catbox.
     *
     */
    cache: {
      /**
       * --------------------------------------------------------------------------
       * JWT Blacklist Name
       * --------------------------------------------------------------------------
       *
       * Configure the caching segment (table) for tokens. This separates the
       * invalidated tokens from other caching properties of your application.
       *
       */
      name: process.env.JWT_BLACKLIST_NAME || 'jwt/blacklist',

      /**
       * --------------------------------------------------------------------------
       * JWT Blacklist Provider
       * --------------------------------------------------------------------------
       *
       * Use this option to provide the caching client package you want use to
       * provision the cache. Make sure to use a persistent cache. You must
       * add the provided package name explictely as a project dependency.
       *
       * For example, if you want to use Memcache as the caching layer, you may use
       * the `@hapi/catbox-memcached` caching client. You must then install the
       * `@hapi/catbox-memcached` package by yourself.
       *
       */
      provider: '@hapi/catbox-your-client'
    }
  }
}
