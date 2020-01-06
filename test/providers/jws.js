'use strict'

const Fs = require('fs')
const Path = require('path')
const Lab = require('@hapi/lab')
const Crypto = require('crypto')
const Forge = require('node-forge')
const { expect } = require('@hapi/code')
const Token = require('../../src/token')
const MockKeys = require('../mocks/keys')
const JWS = require('../../src/providers/jws')

const { describe, it, before, after } = exports.lab = Lab.script()

const keyDir = Path.resolve(__dirname, 'fixtures')
const publicKeyPath = Path.resolve(keyDir, 'public_key')
const privateKeyPath = Path.resolve(keyDir, 'private_key')

const secret = Crypto.randomBytes(10).toString('hex')

async function createFile (path, content) {
  await new Promise(resolve => Fs.mkdir(keyDir, resolve))

  return new Promise((resolve, reject) => {
    Fs.writeFile(path, content, (error) => {
      return error ? reject(error) : resolve()
    })
  })
}

async function deleteFile (path) {
  return new Promise((resolve, reject) => {
    Fs.unlink(path, (error) => {
      return error ? reject(error) : resolve()
    })
  })
}

describe('JWS Provider', () => {
  before(async () => {
    const { privateKey, publicKey } = Forge.pki.rsa.generateKeyPair(1024)

    await createFile(publicKeyPath, Forge.pki.publicKeyToPem(publicKey))
    await createFile(privateKeyPath, Forge.pki.privateKeyToPem(privateKey))
  })

  after(async () => {
    await deleteFile(publicKeyPath)
    await deleteFile(privateKeyPath)
  })

  it('encode an decode a symmetric JWS, HS256)', async () => {
    const payload = { jti: 1 }

    const jws = new JWS({ options: { secret, algorithm: 'HS256' } })
    const jwt = await jws.encode(payload)

    const token = new Token(jwt)
    expect(token.isValid()).to.be.true()

    const decoded = await jws.decode(token.plain())
    expect(decoded).to.equal(payload)
  })

  it('encodes and decodes a JWS (asymmetric, RS256)', async () => {
    const keys = {
      public: publicKeyPath,
      private: privateKeyPath
    }

    const payload = { jti: 1, sub: 'Marcus' }
    const jws = new JWS({ options: { secret, keys, algorithm: 'RS256' } })
    const jwt = await jws.encode(payload)
    const token = new Token(jwt)
    expect(token.isValid()).to.be.true()

    const result = await jws.decode(token.plain())
    expect(result).to.equal(payload)
  })

  it('encodes and decodes a JWS using a private key in OpenSSH and public key in PEM format (asymmetric, RS256)', async () => {
    const { privateKey, publicKey } = Forge.pki.rsa.generateKeyPair(1024)
    const publicKeyAsPem = Forge.pki.publicKeyToPem(publicKey)
    const privateKeyAsOpenSSH = Forge.ssh.privateKeyToOpenSSH(privateKey)

    const payload = { jti: 1, sub: 'Marcus' }
    const jws = new JWS({ options: { keys: {}, algorithm: 'RS256' } })
    jws.getSigningKey = async () => { return privateKeyAsOpenSSH }
    jws.getVerificationKey = async () => { return publicKeyAsPem }

    const jwt = await jws.encode(payload)
    const token = new Token(jwt)
    expect(token.isValid()).to.be.true()

    const result = await jws.decode(token.plain())
    expect(result).to.equal(payload)
  })

  it('encodes and decodes a JWS using ED25519 keys (asymmetric, ES256)', async () => {
    const payload = { jti: 1, sub: 'Marcus' }
    const jws = new JWS({ options: { keys: {}, algorithm: 'ES256' } })
    jws.getSigningKey = async () => { return MockKeys.es256.private }
    jws.getVerificationKey = async () => { return MockKeys.es256.public }

    const jwt = await jws.encode(payload)
    const token = new Token(jwt)
    expect(token.isValid()).to.be.true()

    const result = await jws.decode(token.plain())
    expect(result).to.equal(payload)
  })

  it('creates a token with string payload', async () => {
    const payload = 'Hello Marcus'

    const jws = new JWS({ options: { secret, algorithm: 'HS256' } })
    const jwt = await jws.encode(payload)

    const token = new Token(jwt)
    expect(token.isValid()).to.be.true()

    const decoded = await jws.decode(token.plain())
    expect(decoded).to.equal(payload)
  })

  it('throws when creating a token without payload', async () => {
    const jws = new JWS({ options: { secret, algorithm: 'HS256' } })
    await expect(jws.encode()).to.reject()
  })

  it('throws when creating a token with null payload', async () => {
    const jws = new JWS({ options: { secret, algorithm: 'HS256' } })
    await expect(jws.encode(null)).to.reject()
  })

  it('ensures valid algorithm', async () => {
    expect(() => {
      // eslint-disable-next-line
      new JWS({ options: { secret, algorithm: 'not-available' } })
    }
    ).to.throw()
  })

  it('throws on error when encoding', async () => {
    const jws = new JWS({ options: { secret, algorithm: 'HS256' } })
    jws.getAlgorithm = () => { return 'invalid' }
    await expect(jws.encode('value')).to.reject()
  })

  it('throws when decoding an empty token', async () => {
    const jws = new JWS({ options: { secret, algorithm: 'HS256' } })
    await expect(jws.decode()).to.reject('Cannot decode JWT, received: undefined')
  })

  it('throws when decoding a null token', async () => {
    const jws = new JWS({ options: { secret, algorithm: 'HS256' } })
    await expect(jws.decode(null)).to.reject('Cannot decode JWT, received: null')
  })

  it('throws when decoding an invalid token', async () => {
    const jws = new JWS({ options: { secret, algorithm: 'HS256' } })
    await expect(jws.decode('token.notMatching.theSecret')).to.reject('Invalid token')
  })

  it('throws when using non-existent key', async () => {
    const keys = {
      private: './wrong-path'
    }

    const jws = new JWS({ options: { secret, keys, algorithm: 'RS256' } })
    await expect(jws.encode('payload')).to.reject()
  })

  it('throws on error when reading a key file', async () => {
    const keys = {
      private: './wrong-path'
    }

    const jws = new JWS({ options: { secret, keys, algorithm: 'RS256' } })
    jws.fileExists = () => { return true }
    await expect(jws.encode('payload')).to.reject()
  })
})
