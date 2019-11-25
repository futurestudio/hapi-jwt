/// <reference types='node' />

import { Plugin, Request } from '@hapi/hapi';


declare module '@hapi/hapi' {
    interface Request {
        /**
         * This `jwt` request decoration provides a handful of methods. The
         * available methods help you to create a signed JWT for a given
         * `user`. You can also retrieve the payload of a JWT available
         * as a bearer token in the authorization header of a request.
         */
        jwt: HapiJwt.JWT;
    }
}


declare namespace HapiJwt {
    interface JWT {
        /**
         * Generate a JWT for the given `user` object. When creating the JWT,
         * `hapi-jwt` creates a handful of claims besides your provided
         * data. It generates the following claims:
         * - `jti`: a token identifier
         * - `iat`: issued at date in seconds
         * - `nbf`: validity start date in seconds
         * - `exp`: expiration date in seconds, based on the TTL
         * - `iss`: retrieves the token issuer from the request domain
         * - `sub`: if the given `user` object contains an `id` field, it will be used for the `sub` claim
         *
         * @param {Object} user
         *
         * @returns Returns the signed JWT.
         */
        for(user): Promise<string | Error>;

        /**
         * Decodes the JWT and returns a payload instance containing the claims set.
         *
         * @returns Returns a payload instance.
         *
         * @throws
         */
        payload(): Promise<Payload | Error>;

        /**
         * Invalidate the JWT that is present as a bearer token in the authorization
         * request header by adding it to a blacklist.
         *
         * You may invalidate a token indefinitely by calling `.invalidate('forever')`.
         *
         * This method throws when blacklisting invalid JWTs.
         *
         * @throws
         */
        invalidate(forever: string | boolean): Promise<void>;

        /**
         * Returns a token instance wrapping the signed JWT.
         *
         * @returns {Token}
         */
        token(): Token;
    }


    interface Payload {
        /**
         * Returns the payload as a object containing all claims.
         *
         * @returns Returns an object containing all claims.
         */
        toObject(): object;

        /**
         * Determines whether the payload contains a claim with the given `name`.
         *
         * @param {String} name
         *
         * @returns Returns `true` if the key is present in the payload claims set, `false` otherwise.
         */
        has(key: string): boolean;

        /**
         * Determines whether the payload is missing a claim with the given `name`.
         *
         * @param {String} name
         *
         * @returns Returns `false` if the key is present in the payload claims set, `true` otherwise.
         */
        missing(key: string): boolean;
    }


    interface Token {
        /**
         * Returns the plain JWT string.
         *
         * @returns Returns the plain JWT string.
         */
        plain(): string;

        /**
         * Alias method for `.plain()` returning the plain JWT string.
         *
         * @returns Returns the plain JWT string.
         */
        toString(): string;

        /**
         * Determines whether the token has a valid format by checking whether the token is signed or encrypted.
         *
         * @returns Returns `true` if the token is valid, otherwise `false`.
         */
        isValid(): boolean;

        /**
         * Determines whether the token is a signed token (JWS).
         * Signed tokens consist of three parts, separated by two dots.
         *
         * @returns Returns `true` if the token is signed (JWS), otherwise `false`.
         */
        isSigned(): boolean;

        /**
         * Determines whether the token is an encrypted token (JWE).
         * Encrypted tokens consist of five parts, separated by four dots.
         *
         * @returns Returns `true` if the token is encrypted (JWE), otherwise `false`.
         */
        isEncrypted(): boolean;
    }


    /**
     * Available options when registering hapi-jwt as a plugin to the hapi server.
     */
    interface Options {
        /**
         * This JWT secret key is used to sign a token for symmetric algorithms.
         * Symmetric algorithms (HMAC) start with "HS", like "HS256".
         * Ensure that the JWT secret has at least 32 characters.
         *
         * Symmetric algorithms:
         *   HS256, HS384, HS512
         *
         */
        secret?: string;

        /**
         * Define a public/private key pair to use an asymmetric algorithm signing your JWTs.
         *
         * Asymmetric algorithms:
         *   RS256, RS384, RS512,
         *   ES256, ES384, ES512,
         *   PS256, PS384, PS512
         *
         */
        keys?: {
            /**
             * The path to your public key.
             *
             * For example: '/home/users/marcus/dev/my-project/storage/keys/id_rsa.pub'
             *
             */
            public: string;

            /**
             * The path to your private key.
             *
             * For example: '/home/users/marcus/dev/my-project/storage/keys/id_rsa'
             *
             */
            private: string;
        };

        /**
         * Specify the JWT signing algorithm below. The algorithms prefixed with 'HS'
         * use a symmetric signing algorithm requiring a secret. In contrast, the
         * alrogithms prefixed with 'RS', 'ES', and 'PS' require a key pair.
         *
         * Allowed algorithms:
         *   HS256, HS384, HS512
         *   RS256, RS384, RS512,
         *   ES256, ES384, ES512,
         *   PS256, PS384, PS512
         *
         */
        algorithm: string;

        /**
         * Defines the lifetime of a token (in minutes). The default lifetime is 15 minutes.
         *
         */
        ttl: number;

        /**
         * This section defines the blacklisting options for JWTs. Blacklists use
         * the hapi server caches on top of catbox. When using blacklists, make
         * sure to have a persistent cache provider, like `catbox-redis` or
         * `catbox-memcached` and avoid memory-based cache storers.
         *
         */
        blacklist?: {
            /**
             * A boolean value defining whether the blacklist is enabled.
             *
             */
            enabled?: boolean;

            /**
             * The blacklist allows you to revoke tokens, for example on a user logout.
             * If you don't want or need this functionality, you may disable it here.
             * All options inside of this `cache` object are passed through to
             * hapi to provision the caching layer on using catbox.
             *
             */
            cache: {
                /**
                 * Configure the caching segment (table) for tokens. This separates the
                 * invalidated tokens from other caching properties of your application.
                 *
                 */
                name?: string;

                /**
                 * Use this option to provide the caching client package you want use to
                 * provision the cache. Make sure to use a persistent cache. You must
                 * add the provided package name explictely as a project dependency.
                 *
                 * For example, if you want to use Memcache as the caching layer, you may use
                 * the `@hapi/catbox-memcached` caching client. You must then install the
                 * `@hapi/catbox-memcached` package by yourself.
                 *
                 */
                provider: string;
            }
        }
    }
}

declare var HapiJwt: Plugin<HapiJwt.Options>;

export = HapiJwt;
