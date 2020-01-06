# Changelog


## [2.0.0](https://github.com/futurestudio/hapi-jwt/compare/v1.0.0...v2.0.0) - 2020-xx-xx

### Added
- checks to ensure a token when decoding a JWT
- checks to ensure a payload when creating a JWT

### Updated
- bump dependencies
- moved TypeScript definitions file to `typings/index.d.ts`
- switch packages from `jws` to `jose` (`jose` comes with JWE support for encrypted tokens)


### Breaking Changes
- requires Node.js v12
- removed `'none'` algorithm in favor of increased security (and because `jose` doesn’t support unsigned tokens :))


## 1.0.0 - 2019-11-20

### Added
- `1.0.0` release 🚀 🎉
