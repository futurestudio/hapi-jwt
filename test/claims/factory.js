'use strict'

const Lab = require('@hapi/lab')
const { expect } = require('@hapi/code')
const ClaimFactory = require('../../src/claims/factory')

const { describe, it } = exports.lab = Lab.script()

describe('JWT Claims Factory', () => {
  it('creates default claims', async () => {
    const claimFactory = new ClaimFactory({
      options: { ttl: 10 },
      request: {
        root: () => { return 'hapi-jwt.testing' }
      }
    })

    expect(claimFactory.make('iss')).to.exist()
    expect(claimFactory.make('exp')).to.exist()
    expect(claimFactory.make('nbf')).to.exist()
    expect(claimFactory.make('iat')).to.exist()
    expect(claimFactory.make('jti')).to.exist()
  })

  it('throws for unknown claim', async () => {
    expect(() => {
      // eslint-ignore-next-line
      new ClaimFactory({ options: { ttl: 10 } }).make('sub')
    }).to.throw()
  })
})
