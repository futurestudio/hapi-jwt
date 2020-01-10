# Changelog


## [2.0.0](https://github.com/futurestudio/hapi-jwt/compare/v1.0.0...v2.0.0) - 2020-01-10

### Added
- checks to ensure a token when decoding a JWT
- checks to ensure a payload when creating a JWT

### Updated
- moved TypeScript definitions file to `typings/index.d.ts`
- switch packages from `jws` to `jose` (`jose` comes with JWE support for encrypted tokens)

### Breaking Changes
- require Node.js v12
  - this change aligns with the hapi ecosystem requiring Node.js v12 with the release of hapi 19
- remove `'none'` algorithm in favor of increased security (and because `jose` doesn’t support unsigned tokens :))


## 1.0.0 - 2019-11-20

### Added
- `1.0.0` release 🚀 🎉
