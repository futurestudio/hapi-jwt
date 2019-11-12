'use strict'

const Payload = require('./payload')
const ClaimSet = require('./claims/set')
const ClaimFactory = require('./claims/factory')

class PayloadFactory {
  constructor ({ request, options }) {
    this.claimSet = new ClaimSet()
    this.claimFactory = new ClaimFactory({ request, options })
  }

  /**
   * Returns the list of default claims added to the JWT payload.
   *
   * @returns {Array}
   */
  get defaultClaims () {
    return [
      'jti',
      'iss',
      'iat',
      'nbf',
      'exp'
    ]
  }

  /**
   * Add a claim to the claim set.
   *
   * @param {String} name
   * @param {*} value
   *
   * @returns {PayloadFactory}
   */
  addClaim (name, value) {
    this.claimSet.add(name, value)

    return this
  }

  /**
   * Add an object of custom claims to the claim set.
   *
   * @param {String} name
   * @param {*} value
   *
   * @returns {PayloadFactory}
   */
  addCustomClaims (claims) {
    Object.keys(claims).forEach(name => {
      this.addClaim(name, claims[name])
    })

    return this
  }

  /**
   * Returns the JWT payload instance.
   *
   * @returns {Payload}
   */
  make () {
    return this.buildClaimsMap().createPayload()
  }

  /**
   * Create the default claims and add them to the claims map.
   *
   * @returns {PayloadFactory}
   */
  buildClaimsMap () {
    this.defaultClaims.forEach(claim => {
      this.addClaim(claim, this.claimFactory.make(claim))
    })

    return this
  }

  /**
   * Create a payload instance based on the available claims.
   *
   * @returns {Payload}
   */
  createPayload () {
    return new Payload(this.claimSet)
  }
}

module.exports = PayloadFactory
