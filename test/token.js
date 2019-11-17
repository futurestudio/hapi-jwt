'use strict'

const Lab = require('@hapi/lab')
const Token = require('../src/token')
const { expect } = require('@hapi/code')

const { describe, it } = exports.lab = Lab.script()

describe('JWT Token', () => {
  it('plain', async () => {
    const token = new Token('jwt')
    expect(token.plain()).to.equal('jwt')
  })

  it('isValid', async () => {
    expect(new Token('').isValid()).to.be.false()
    expect(new Token('j.w.t').isValid()).to.be.true()
    expect(new Token('j.w.t.as.jwe').isValid()).to.be.true()
  })

  it('isSigned', async () => {
    expect(new Token('jwt').isSigned()).to.be.false()
    expect(new Token('j.w.').isSigned()).to.be.true()
    expect(new Token('j.w.s').isSigned()).to.be.true()
  })

  it('isEncrypted', async () => {
    expect(new Token('j.w.t.as.jwe').isEncrypted()).to.be.true()
    expect(new Token('jwt.as.jwe').isEncrypted()).to.be.false()
  })
})
