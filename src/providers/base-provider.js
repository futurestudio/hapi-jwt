'use strict'

const Fs = require('fs')
const { JWK } = require('jose')

class Provider {
  constructor ({ options }) {
    const { secret, keys, algorithm } = options

    this.keys = keys
    this.secret = secret
    this.algorithm = algorithm

    this.ensureValidAlgorithm()
  }

  /**
   * Returns the list of supported algorithms.
   *
   * @returns {Array}
   */
  get supportedAlgorithms () {
    return []
      .concat(this.noneAlgorithm)
      .concat(this.symmetricAlgorithms)
      .concat(this.asymmetricAlgorithms)
  }

  /**
   * Returns the list of symmetric algorithms.
   *
   * @returns {Array}
   */
  get noneAlgorithm () {
    return [
      'none'
    ]
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
   * Determines whether the used algorithm is
   * supported by all available algorithms.
   *
   * @throws
   */
  ensureValidAlgorithm () {
    if (this.supportedAlgorithms.includes(this.getAlgorithm())) {
      return
    }

    throw new Error(`Invalid algorithm. Supported algorithms: ${this.supportedAlgorithms}`)
  }

  /**
   * Returns the signing key, either the secret or private key.
   * This method ensures to read the private key from the
   * file system and returns the content string.
   *
   * @returns {String}
   */
  async getSigningKey () {
    if (this.isUnsigned()) {
      return this.getNoneKey()
    }

    return this.isAsymmetric()
      ? this.getPrivateKey()
      : this.getSecret()
  }

  /**
   * Determines whether to use the 'none' algorithm.
   *
   * @returns {Boolean}
   */
  isUnsigned () {
    return this.noneAlgorithm.includes(
      this.getAlgorithm()
    )
  }

  /**
   * Determines whether the used algorithm is asymmetric.
   *
   * @returns {Boolean}
   */
  isAsymmetric () {
    return this.asymmetricAlgorithms.includes(
      this.getAlgorithm()
    )
  }

  /**
   * Returns the 'None' key object that can be used with
   * the 'jose' package to opt-in for unsecured JWS.
   *
   * @returns {Object}
   */
  getNoneKey () {
    return JWK.None
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
   * @returns {String}
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
    if (await this.fileExists(file)) {
      return new Promise((resolve, reject) => {
        Fs.readFile(file, (error, content) => {
          return error
            ? reject(error)
            : resolve(content.toString())
        })
      })
    }

    throw new Error(`Key not found at path ${file}`)
  }

  /**
   * Determine whether the given file exists at `path`.
   * Always returns a boolean, false if the file is
   * not existent, and true if it exists.
   *
   * @returns {Boolean}
   */
  async fileExists (path) {
    return new Promise(resolve => {
      Fs.access(path, error => {
        return error ? resolve(false) : resolve(true)
      })
    })
  }
}

module.exports = Provider
