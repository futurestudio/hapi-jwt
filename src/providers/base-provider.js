'use strict'

const Fs = require('fs')

class Provider {
  constructor ({ options }) {
    const { secret, keys, algorithm } = options

    this.keys = keys
    this.secret = secret
    this.algorithm = algorithm
  }

  /**
   * Returns the list of supported algorithms.
   *
   * @returns {Array}
   */
  get supportedAlgorithms () {
    return []
      .concat(this.symmetricAlgorithms)
      .concat(this.asymmetricAlgorithms)
  }

  /**
   * Returns the list of symmetric algorithms.
   *
   * @returns {Array}
   */
  get symmetricAlgorithms () {
    return [
      'HS256', 'HS384', 'HS512'
    ]
  }

  /**
   * Returns the list of asymmetric algorithms.
   *
   * @returns {Array}
   */
  get asymmetricAlgorithms () {
    return [
      'RS256', 'RS384', 'RS512',
      'ES256', 'ES384', 'ES512',
      'PS256', 'PS384', 'PS512'
    ]
  }

  /**
   * Returns the used algorithm.
   *
   * @returns {String}
   */
  getAlgorithm () {
    return this.algorithm
  }

  /**
   * Determines whether the used algorithm is asymmetric.
   *
   * @returns {Boolean}
   */
  isAsymmetric () {
    return this.asymmetricAlgorithms.includes(this.algorithm)
  }

  /**
   * Returns the signing key, either the secret or private key.
   * This method ensures to read the private key from the
   * file system and returns the content string.
   *
   * @returns {String}
   */
  async getSigningKey () {
    return this.isAsymmetric()
      ? this.getPrivateKey()
      : this.getSecret()
  }

  /**
   * Returns the signing key, either the secret or public key.
   * This method ensures to read the public key from the
   * file system and returns the content string.
   *
   * @returns {String}
   */
  async getVerificationKey () {
    return this.isAsymmetric()
      ? this.getPublicKey()
      : this.getSecret()
  }

  /**
   * Returns the signing secret.
   *
   * @returns {Array}
   */
  async getSecret () {
    return this.secret
  }

  /**
   * Returns the private key content by reading it from the file sytem.
   *
   * @returns {String}
   */
  async getPrivateKey () {
    return this.readFile(this.keys.private)
  }

  /**
   * Returns the public key content by reading it from the file sytem.
   *
   * @returns {String}
   */
  async getPublicKey () {
    return this.readFile(this.keys.public)
  }

  /**
   * Read the file content of a given file path.
   *
   * @returns {String}
   */
  async readFile (file) {
    return new Promise((resolve, reject) => {
      Fs.readFile(file, (err, content) => {
        if (err) { return reject(err) }

        resolve(content.toString())
      })
    })
  }
}

module.exports = Provider
