'use strict'

const Lab = require('@hapi/lab')
const Token = require('../src/token')
const { expect } = require('@hapi/code')

const { describe, it } = exports.lab = Lab.script()

describe('JWT Token', () => {
  it('ensures isValid', async () => {
    expect(() => new Token('')).to.throw()
    expect(() => new Token('jwt')).to.throw()
    expect(() => new Token('jwt.is.signed')).to.not.throw()
  })

  it('plain', async () => {
    const token = new Token('j.w.t')
    expect(token.plain()).to.equal('j.w.t')
  })

  it('isValid', async () => {
    expect(new Token('j.w.t').isValid()).to.be.true()
    expect(new Token('j.w.t.as.jwe').isValid()).to.be.true()
  })

  it('isSigned', async () => {
    expect(() => {
      new Token('jwt').isSigned()
    }).to.throw()
    expect(new Token('j.w.').isSigned()).to.be.true()
    expect(new Token('j.w.s').isSigned()).to.be.true()
  })

  it('isEncrypted', async () => {
    expect(new Token('j.w.t.as.jwe').isEncrypted()).to.be.true()
    expect(new Token('jwt.as.jwe').isEncrypted()).to.be.false()
  })
})
