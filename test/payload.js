'use strict'

const Lab = require('@hapi/lab')
const { expect } = require('@hapi/code')
const Payload = require('../src/payload')
const ClaimSet = require('../src/claims/set')

const { describe, it } = exports.lab = Lab.script()

describe('JWT Payload', () => {
  it('get and object', async () => {
    const claims = {
      sub: 123,
      jti: 1
    }
    const claimSet = new ClaimSet(Object.entries(claims))

    const payload = new Payload(claimSet)
    expect(payload.get('sub')).to.equal(123)
    expect(payload.getClaim('sub')).to.equal(123)
    expect(payload.toObject()).to.equal(claims)
    expect(payload.getClaims()).to.equal(claimSet)
  })

  it('has/missing', async () => {
    const claimSet = new ClaimSet(Object.entries({
      sub: 123,
      jti: 1
    }))

    const payload = new Payload(claimSet)
    expect(payload.has('jti')).to.be.true()
    expect(payload.has('name')).to.be.false()
    expect(payload.missing('name')).to.be.true()
  })
})
