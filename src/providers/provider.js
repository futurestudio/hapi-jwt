'use strict'

const Fs = require('fs')

class Provider {
  constructor ({ options }) {
    const { secret, algo, keys } = options

    this.algo = algo
    this.keys = keys
    this.secret = secret
  }

  /**
   * Returns the list of supported algorithms.
   *
   * @returns {Array}
   */
  get supportedAlgos () {
    return []
      .concat(this.symmetricAlgos)
      .concat(this.asymmetricAlgos)
  }

  /**
   * Returns the list of symmetric algorithms.
   *
   * @returns {Array}
   */
  get symmetricAlgos () {
    return [
      'HS256', 'HS384', 'HS512'
    ]
  }

  /**
   * Returns the list of asymmetric algorithms.
   *
   * @returns {Array}
   */
  get asymmetricAlgos () {
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
  getAlgo () {
    return this.algo
  }

  /**
   * Determines whether the used algorithm is asymmetric.
   *
   * @returns {Boolean}
   */
  isAsymmetric () {
    return this.asymmetricAlgos.includes(this.algo)
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
      ? this.privateKey()
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
      ? this.publicKey()
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
  async privateKey () {
    return this.readFile(this.keys.private)
  }

  /**
   * Returns the public key content by reading it from the file sytem.
   *
   * @returns {String}
   */
  async publicKey () {
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
