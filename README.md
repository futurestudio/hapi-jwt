<div align="center">
  <img src="https://github.com/futurestudio/hapi-jwt/blob/master/media/hapi-jwt.png?raw=true" alt="hapi-jwt logo" width="471" style="max-width:100%;">
  <br/>
  <br/>

  <p>
    Seamless JWT signing, decoding, and blacklisting in your hapi app.
  </p>

  <br/>
  <p>
    <a href="#installation"><strong>Installation</strong></a> ·
    <a href="#plugin-options"><strong>Plugin Options</strong></a> ·
    <a href="#usage"><strong>Usage</strong></a>
  </p>
  <br/>
  <br/>
  <p>
    <a href="https://travis-ci.com/futurestudio/hapi-jwt"><img src="https://travis-ci.com/futurestudio/hapi-jwt.svg?branch=master" alt="Build Status" data-canonical-src="https://travis-ci.com/futurestudio/hapi-jwt.svg?branch=master" style="max-width:100%;"></a>
    <a href="https://www.npmjs.com/package/@futurestudio/hapi-jwt"><img src="https://img.shields.io/npm/v/@futurestudio/hapi-jwt.svg" alt="hapi-jwt Version"></a>
    <a href="https://greenkeeper.io/" rel="nofollow"><img src="https://badges.greenkeeper.io/futurestudio/hapi-jwt.svg" alt="Greenkeeper badge" data-canonical-src="https://badges.greenkeeper.io/futurestudio/hapi-jwt.svg" style="max-width:100%;"></a>
  </p>
  <p>
    <em>Follow <a href="http://twitter.com/marcuspoehls">@marcuspoehls</a> for updates!</em>
  </p>
</div>

------

<p align="center"><sup>The <a href="https://futurestud.io">Future Studio University</a> supports development of this hapi plugin 🚀</sup>
<br><b>
Join the <a href="https://futurestud.io/university">Future Studio University and Skyrocket in Node.js</a></b>
</p>

------


## Introduction
`hapi-jwt` is a hapi plugin to create (sign) and access (decode) JSON web tokens (JWT).

Create a token via `request.jwt.for(user)` and retrieve the payload of an existing token via `request.jwt.payload()`


## Installation
Install `hapi-jwt` as a dependency to your project:

```bash
npm i @futurestudio/hapi-jwt
```


### Register the Plugin
Register `hapi-jwt` as a plugin to your hapi server.

```js
await server.register({
  plugin: require('@futurestudio/hapi-jwt'),
  options: {
    secret: 'your-secret' // this is the minimum required configuration to sign/decode JWTs
  }
})

// went smooth like hot chocolate :)
```


### Plugin Options
This plugin ships with a comprehensive [default configuration](https://github.com/futurestudio/hapi-jwt/blob/master/config/default.js). Please have a look at all available keys and related comments.

The following list outlines all options:

- **`secret`:** (string) the secret key used to sign and decode a JWT (with a symmetric algorithm). The secret is required if you don’t use a keypair provided in `keys`
- **`keys`:** (object) describing a key pair when using asymmetric algorithms
  - **`public`:** (string) the path to the public key. The public key must be in PEM format
  - **`private`:** (string) the path to the private key. The private key can be in PEM format, OpenSSH format works as well.
- **`algorithm`:** (string, default: HS256) the JWT signing algorithm
- **`ttl`:** (number, default: 15) the JWT lifetime in minutes
- **`blacklist`:** (object) configurating the blacklist
  - **`enabled`:** (boolean, default: false) enables the blacklist
  - **`cache`:** (object) configures a hapi cache instance for the JWT blacklist. These options are used to create a cache via [server.cache](https://hapi.dev/api/?v=18.4.0#-servercacheoptions)
     - **`name`:** (string) identifies both, the blacklisting cache name and segment
     - **`provider`:** (string) defines the catbox caching client, like `@hapi/catbox-redis`


## Usage
`hapi-jwt` decorates hapi’s request object with a JWT instance: `request.jwt`.


### Request Decorations
This decoration provides a convenient interface to interact with JWTs:

  - `await request.jwt.for(user)`: creates a signed JWT
  - `await request.jwt.payload()`: returns the decoded JWT payload. This expects a valid JWT as a bearer token in the authorization header.
  - `await request.jwt.invalidate()`: decodes the JWT on the request (see payload method) and adds it to to the blacklist
  - `await request.jwt.invalidate('forever')`: blacklists a JWT indefinitely


### Create a JWT
Creating a (signed) JWT is as simple as `await request.jwt.for({ id: 1, name: 'Marcus' })`:

When creating the JWT, `hapi-jwt` creates a handful of claims besides your provided data. It generates the following claims:

- `jti`: a token identifier
- `iat`: issued at date in seconds
- `nbf`: validity start date in seconds
- `exp`: expiration date in seconds, based on the TTL
- `iss`: retrieves the token issuer from the request domain
- `sub`: if the given `user` object contains an `id` field, it will be used for the `sub` claim


```js
server.route({
  method: 'POST',
  path: '/login',
  options: {
    auth: 'basic', // assume the login route requires basic authentication
    handler: async request => {
      const token = await request.jwt.for(request.auth.credentials)

      return token
    }
  }
})
```

You can debug a created JWT on [jwt.io](https://jwt.io/) and have a look at the token headers and payload.

A sample token payload looks like this:

```
{
  jti: 'babf5099a4561173c91f2cdc6c61c1aa',
  iss: 'http://localhost',
  iat: 1574094111,
  nbf: 1574094111,
  exp: 1574095011,
  sub: 1
}
```


### Decode a JWT and access the payload
You can access the JWT payload via `await request.jwt.payload()`. Accessing the payload expects a valid JWT in the authorization request header. The authorization header must be in a format like `Bearer <your-jwt>`.

Calling `request.jwt.payload()` returns a `Payload` instance containing the JWT claims set:

```js
server.route({
  method: 'GET',
  path: '/me',
  options: {
    auth: 'jwt',
    handler: async request => {
      const payload = await request.jwt.payload()

      const user = payload.has('sub')
        ? await User.findbyId(payload.get('sub'))
        : await User.findOne({ email: payload.get('email') })

      return token
    }
  }
})
```


#### Payload
A payload instance returned from `await request.jwt.payload()` has the following methods:

- **`toObject`:** returns a plain JavaScript object
- **`get(key)`:** returns the value identified by `key`
- **`has(key)`:** returns a boolean, `true` if the payload contains the claim identified by `key`, otherwise `false`
- **`missing(key)`:** returns a boolean, `true` if the payload **does not** contain the claim identified by key, otherwise `false`


## JWT Blacklist
Activating the JWT blacklist requires a cache. `hapi-jwt` uses hapi’s [`server.cache`](https://hapi.dev/api/?v=18.4.0#-servercacheoptions) method to provision a blacklist storage.

When using the blacklist, please ensure a persistent caching store, like Redis via [@hapi/catbox-redis](https://github.com/hapijs/catbox-redis) or Memcached via [@hapi/catbox-memcached](https://github.com/hapijs/catbox-memcached). Using hapi’s default internal caching instance stores the blacklist in-memory and will be gone when restarting the server.


## Links & Resources

- [hapi tutorial series](https://futurestud.io/tutorials/hapi-get-your-server-up-and-running) with 100+ tutorials


## Contributing

1.  Create a fork
2.  Create your feature branch: `git checkout -b my-feature`
3.  Commit your changes: `git commit -am 'Add some feature'`
4.  Push to the branch: `git push origin my-new-feature`
5.  Submit a pull request 🚀


## License

MIT © [Future Studio](https://futurestud.io)

---

> [futurestud.io](https://futurestud.io) &nbsp;&middot;&nbsp;
> GitHub [@futurestudio](https://github.com/futurestudio/) &nbsp;&middot;&nbsp;
> Twitter [@futurestud_io](https://twitter.com/futurestud_io)
