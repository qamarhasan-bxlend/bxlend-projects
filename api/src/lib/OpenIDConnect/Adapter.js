"use strict";

const { OIDC_ADAPTER_MODEL } = require("@src/constants");
const { OAuthInteraction, OAuthSession, OAuthGrant, Token } = require("@src/models");
const { OIDCModelToTokenKind, OIDCGrantTypeToTokenGty } = require("@src/utils");
const { Types } = require("mongoose");

class Adapter {
  /**
   * Creates an instance of Adapter for an oidc-provider model.
   *
   * @param {"Grant"|"Session"|"AccessToken"|"AuthorizationCode"|"RefreshToken"|"ClientCredentials"|"Client"|"InitialAccessToken"|"RegistrationAccessToken"|"DeviceCode"|"Interaction"|"ReplayDetection"|"PushedAuthorizationRequest"} name - Name of the oidc-provider model.
   */
  constructor(name) {
    this.name = name;

    switch (name) {
      case OIDC_ADAPTER_MODEL.INTERACTION:
        this.Model = OAuthInteraction;
        break;
      case OIDC_ADAPTER_MODEL.SESSION:
        this.Model = OAuthSession;
        break;
      case OIDC_ADAPTER_MODEL.GRANT:
        this.Model = OAuthGrant;
        break;
      case OIDC_ADAPTER_MODEL.ACCESS_TOKEN:
      case OIDC_ADAPTER_MODEL.AUTHORIZATION_CODE:
      case OIDC_ADAPTER_MODEL.REFRESH_TOKEN:
      case OIDC_ADAPTER_MODEL.CLIENT_CREDENTIALS:
      case OIDC_ADAPTER_MODEL.INITIAL_ACCESS_TOKEN:
      case OIDC_ADAPTER_MODEL.REGISTRATION_ACCESS_TOKEN:
      case OIDC_ADAPTER_MODEL.DEVICE_CODE:
        this.Model = Token;
        break;
      // TODO: the rest
    }
  }

  /**
   * Update or Create an instance of an oidc-provider model.
   *
   * @param {string} id - Identifier that oidc-provider will use to reference this model instance for
   * future operations.
   * @param {Object} payload - Object with all properties intended for storage.
   * @param {integer} expiresIn - Number of seconds intended for this model to be stored.
   * @returns {Promise} - Promise fulfilled when the operation succeeded. Rejected with error when
   * encountered.
   */
  async upsert(id, payload) {
    const { name, Model } = this;

    switch (name) {
      case OIDC_ADAPTER_MODEL.INTERACTION: {
        /**
         * Short-lived Interaction model payload contains the following properties:
         * - jti {string} - unique identifier of the interaction session
         * - kind {string} - "Interaction" fixed string value
         * - exp {number} - timestamp of the interaction's expiration
         * - iat {number} - timestamp of the interaction's creation
         * - returnTo {string} - after resolving interactions send the user-agent to this url
         * - deviceCode {string} - [DeviceCode user flows only] deviceCode reference
         * - params {object} - parsed recognized parameters object
         * - lastSubmission {object} - previous interaction result submission
         * - trusted {string[]} - parameter names that come from a trusted source
         * - result {object} - interaction results object is expected here
         * - grantId {string} - grant identifier if there's a preexisting one
         * - session {object}
         * - session.uid {string} - uid of the session this Interaction belongs to
         * - session.cookie {string} - jti of the session this Interaction belongs to
         * - session.acr {string} - existing acr of the session Interaction belongs to
         * - session.amr {string[]} - existing amr of the session Interaction belongs to
         * - session.accountId {string} - existing account id from the seession Interaction belongs to
         */

        const {
          iat,
          exp,
          returnTo,
          prompt,
          params,
          jti,
          lastSubmission,
          trusted,
          result,
          grantId,
          session,
        } = payload;

        const interactionData = {
          issued_at: new Date(iat * 1000),
          expires_at: new Date(exp * 1000),
          return_to: returnTo,
          params,
          jti,
        };

        if (prompt != null) interactionData.prompt = prompt;
        if (lastSubmission != null) interactionData.last_submission = lastSubmission;
        if (trusted != null) interactionData.trusted = trusted;
        if (result != null) interactionData.result = result;
        if (grantId != null) interactionData.grant_id = grantId;
        if (session != null) {
          interactionData.session = {
            uid: session.uid,
            cookie: session.cookie,
            account_id: Types.ObjectId(session.accountId),
          };

          if (session.acr != null) interactionData.session.acr = session.acr;
          if (session.amr != null) interactionData.session.amr = session.amr;
        }

        const interaction = await Model.findOneAndUpdate(
          {
            jti: id,
          },
          interactionData,
          {
            returnOriginal: false,
            upsert: true,
          },
        );


        return interaction.toJSON();
      }
      case OIDC_ADAPTER_MODEL.SESSION: {
        /**
         *  OIDC Session model payload contains the following properties:
         * - jti {string} - Session's unique identifier, it changes on some occasions
         * - uid {string} - Session's unique fixed internal identifier
         * - kind {string} - "Session" fixed string value
         * - exp {number} - timestamp of the session's expiration
         * - iat {number} - timestamp of the session's creation
         * - accountId {string} - the session account identifier
         * - authorizations {object} - object with session authorized clients and their session identifiers
         * - loginTs {number} - timestamp of user's authentication
         * - acr {string} - authentication context class reference value
         * - amr {string[]} - Authentication methods references
         * - transient {boolean} - whether the session is using a persistant or session cookie
         * - state: {object} - temporary objects used for one-time csrf and state persistance between
         *     form submissions
         */

        const {
          iat,
          exp,
          jti,
          uid,
          accountId,
          loginTs,
          authorizations,
          acr,
          amr,
          transient,
          state,
        } = payload;

        const sessionData = {
          issued_at: new Date(iat * 1000),
          expires_at: new Date(exp * 1000),
          jti,
          uid,
          account_id: Types.ObjectId(accountId),
          logged_in_at: new Date(loginTs * 1000),
        };

        if (authorizations != null) sessionData.authorizations = authorizations;
        if (acr != null) sessionData.acr = acr;
        if (amr != null) sessionData.amr = amr;
        if (transient != null) sessionData.transient = transient;
        if (state != null) sessionData.state = state;

        const session = await Model.findOneAndUpdate(
          {
            jti: id,
          },
          sessionData,
          {
            returnOriginal: false,
            upsert: true,
          },
        );

        return session.toJSON();
      }
      case OIDC_ADAPTER_MODEL.GRANT: {
        /**
         *  Grant model payload contains the following properties:
         * - jti {string} - Grant's unique identifier
         * - kind {string} - "Grant" fixed string value
         * - exp {number} - timestamp of the grant's expiration. exp will be missing when expiration
         *     is not configured on the Grant model.
         * - iat {number} - timestamp of the grant's creation
         * - accountId {string} - the grant account identifier
         * - clientId {string} - client identifier the grant belongs to
         * - openid {object}
         * - openid.scope {string} - Granted OpenId Scope value
         * - openid.claims {string[]} - Granted OpenId Claim names
         * - resources {object}
         * - resources[resourceIndicator] {string} - Granted Scope value for a Resource Server
         *     (indicated by its resource indicator value)
         * - rejected {object}
         * - rejected.openid {object}
         * - rejected.openid.scope {string} - Rejected OpenId Scope value
         * - rejected.openid.claims {string[]} - Rejected OpenId Claim names
         * - rejected.resources {object}
         * - rejected.resources[resourceIndicator] {string} - Rejected Scope value for a Resource Server
         *     (indicated by its resource indicator value)
         */

        const {
          iat,
          exp,
          accountId,
          clientId,
          jti,
          openid,
          resources,
          rejected,
        } = payload;

        const grantData = {
          issued_at: new Date(iat * 1000),
          expires_at: new Date(exp * 1000),
          account_id: Types.ObjectId(accountId),
          client_id: clientId,
          jti,
        };

        if (openid != null) {
          grantData.openid = {};

          if (openid.scope != null) grantData.openid.scopes = openid.scope.split(" ");
          if (openid.claims != null) grantData.openid.claims = openid.claims;
        }
        if (resources != null) grantData.resources = resources;
        if (rejected != null) {
          grantData.rejected = {};

          if (rejected.openid != null) {
            grantData.rejected.openid = {
              scopes: rejected.openid.scopes.split(" "),
            };

            if (rejected.openid.claims != null) grantData.rejected.openid.claims = rejected.openid.claims;
          }

          if (rejected.resources != null) grantData.rejected.resources = rejected.resources;
        }

        const grant = await Model.findOneAndUpdate(
          {
            jti: id,
          },
          grantData,
          {
            returnOriginal: false,
            upsert: true,
          },
        );

        return grant.toJSON();
      }
      case OIDC_ADAPTER_MODEL.ACCESS_TOKEN:
      case OIDC_ADAPTER_MODEL.AUTHORIZATION_CODE:
      case OIDC_ADAPTER_MODEL.REFRESH_TOKEN:
      case OIDC_ADAPTER_MODEL.CLIENT_CREDENTIALS:
      case OIDC_ADAPTER_MODEL.INITIAL_ACCESS_TOKEN:
      case OIDC_ADAPTER_MODEL.REGISTRATION_ACCESS_TOKEN:
      case OIDC_ADAPTER_MODEL.DEVICE_CODE: {
        /**
         * When this is one of AccessToken, AuthorizationCode, RefreshToken, ClientCredentials,
         * InitialAccessToken, RegistrationAccessToken or DeviceCode the payload will contain the
         * following properties:
         *
         * Note: This list is not exhaustive and properties may be added in the future, it is highly
         * recommended to use a schema that allows for this.
         *
         * - jti {string} - unique identifier of the token
         * - kind {string} - token class name
         * - exp {number} - timestamp of the token's expiration
         * - iat {number} - timestamp of the token's creation
         * - accountId {string} - account identifier the token belongs to
         * - clientId {string} - client identifier the token belongs to
         * - aud {string} - audience of a token
         * - authTime {number} - timestamp of the end-user's authentication
         * - claims {object} - claims parameter (see claims in OIDC Core 1.0)
         * - extra {object} - extra claims returned by the extraTokenClaims helper
         * - codeChallenge {string} - client provided PKCE code_challenge value
         * - codeChallengeMethod {string} - client provided PKCE code_challenge_method value
         * - sessionUid {string} - uid of a session this token stems from
         * - expiresWithSession {boolean} - whether the token is valid when session expires
         * - grantId {string} - grant identifier
         * - nonce {string} - random nonce from an authorization request
         * - redirectUri {string} - redirect_uri value from an authorization request
         * - resource {string|string[]} - resource indicator value(s) (auth code, device code, refresh token)
         * - rotations {number} - [RefreshToken only] - number of times the refresh token was rotated
         * - iiat {number} - [RefreshToken only] - the very first (initial) issued at before rotations
         * - acr {string} - authentication context class reference value
         * - amr {string[]} - Authentication methods references
         * - scope {string} - scope value from an authorization request
         * - sid {string} - session identifier the token comes from
         * - 'x5t#S256' {string} - X.509 Certificate SHA-256 Thumbprint of a certificate bound access or
         *     refresh token
         * - 'jkt' {string} - JWK SHA-256 Thumbprint (according to [RFC7638]) of a DPoP bound
         *     access or refresh token
         * - gty {string} - [AccessToken, RefreshToken only] space delimited grant values, indicating
         *     the grant type(s) they originate from (implicit, authorization_code, refresh_token or
         *     device_code) the original one is always first, second is refresh_token if refreshed
         * - params {object} - [DeviceCode only] an object with the authorization request parameters
         *     as requested by the client with device_authorization_endpoint
         * - userCode {string} - [DeviceCode only] user code value
         * - deviceInfo {object} - [DeviceCode only] an object with details about the
         *     device_authorization_endpoint request
         * - inFlight {boolean} - [DeviceCode only]
         * - error {string} - [DeviceCode only] - error from authnz to be returned to the polling client
         * - errorDescription {string} - [DeviceCode only] - error_description from authnz to be returned
         *     to the polling client
         * - policies {string[]} - [InitialAccessToken, RegistrationAccessToken only] array of policies
         * - request {string} - [PushedAuthorizationRequest only] Pushed Request Object value
         */

        const {
          kind,
          iat,
          exp,
          accountId,
          grantId,
          nonce,
          redirectUri,
          scope,
          sessionUid,
          jti,
          clientId,
          expiresWithSession,
          gty,
          sid,
          claims,
          audience,
          authTime,
          extra,
          codeChallenge,
          codeChallengeMethod,
          resource,
          rotations,
          iiat,
          acr,
          amr,
          jkt,
          params,
          userCode,
          deviceInfo,
          inFlight,
          error,
          errorDescription,
          policies,
          request,
        } = payload;

        const tokenData = {
          kind: OIDCModelToTokenKind(kind),
          issued_at: new Date(iat * 1000),
          expires_at: new Date(exp * 1000),
          account_id: Types.ObjectId(accountId),
          grant_id: grantId,
          nonce,
          redirect_uri: redirectUri,
          scopes: scope.split(" "),
          session_uid: sessionUid,
          jti,
          client_id: clientId,
          expires_with_session: expiresWithSession,
        };

        if (gty != null) tokenData.gty = OIDCGrantTypeToTokenGty(gty);
        if (sid != null) tokenData.sid = sid;
        if (claims != null) tokenData.claims = claims;
        if (audience != null) tokenData.audience = audience;
        if (authTime != null) tokenData.authenticated_at = new Date(authTime * 1000);
        if (extra != null) tokenData.extra = extra;
        if (codeChallenge != null) tokenData.code_challenge = codeChallenge;
        if (codeChallengeMethod != null) tokenData.code_challenge_method = codeChallengeMethod;
        if (resource != null) tokenData.resources = Array.isArray(resource) ? resource : [resource];
        if (rotations != null) tokenData.rotations = rotations;
        if (iiat != null) tokenData.initially_issued_at = new Date(iiat * 1000);
        if (acr != null) tokenData.acr = acr;
        if (amr != null) tokenData.amr = amr;
        if (jkt != null) tokenData.jkt = jkt;
        if (params != null) tokenData.params = params;
        if (userCode != null) tokenData.user_ode = userCode;
        if (deviceInfo != null) tokenData.device_info = deviceInfo;
        if (inFlight != null) tokenData.in_flight = inFlight;
        if (error != null) tokenData.error = error;
        if (errorDescription != null) tokenData.error_description = errorDescription;
        if (policies != null) tokenData.policies = policies;
        if (request != null) tokenData.request = request;

        const token = await Model.findOneAndUpdate(
          {
            jti: id,
          },
          tokenData,
          {
            returnOriginal: false,
            upsert: true,
          },
        );

        return token.toJSON();
      }
      default:
        // TODO:
        throw new Error("Unexpected oidc model");
    }

    /**
     * Client model will only use this when registered through Dynamic Registration features and
     * will contain all client properties.
     */

    /**
     *  Replay prevention ReplayDetection model contains the following properties:
     * - jti {string} - unique identifier of the replay object
     * - kind {string} - "ReplayDetection" fixed string value
     * - exp {number} - timestamp of the replay object cache expiration
     * - iat {number} - timestamp of the replay object cache's creation
     */
  }

  /**
   * Return previously stored instance of an oidc-provider model.
   *
   * @param {string} id - Identifier of oidc-provider model
   * @returns {Promise<*>} - Promise fulfilled with what was previously stored for the id (when found and
   * not dropped yet due to expiration) or falsy value when not found anymore. Rejected with error
   * when encountered.
   */
  async find(id) {
    const { Model } = this;

    const instance = await Model.findOne({ jti: id });

    if (instance == null) return false;

    return instance.toJSON();
  }

  /**
   * Return previously stored instance of DeviceCode by the end-user entered user code. You only
   * need this method for the deviceFlow feature.
   *
   * @param {string} userCode - the user_code value associated with a DeviceCode instance.
   * @returns {Promise} - Promise fulfilled with the stored device code object (when found and not
   * dropped yet due to expiration) or falsy value when not found anymore. Rejected with error
   * when encountered.
   */
  async findByUserCode() {
    // TODO:
  }

  /**
   * Return previously stored instance of Session by its uid reference property.
   *
   * @param {string} uid - the uid value associated with a Session instance.
   * @returns {Promise} - Promise fulfilled with the stored session object (when found and not
   * dropped yet due to expiration) or falsy value when not found anymore. Rejected with error
   * when encountered.
   */
  async findByUid(uid) {
    const { name, Model } = this;

    if (name !== OIDC_ADAPTER_MODEL.SESSION) return false;

    const result = await Model.findOne({ uid });

    if (result == null) return false;

    return result.toJSON();
  }

  /**
   * Mark a stored oidc-provider model as consumed (not yet expired though!). Future finds for this
   * id should be fulfilled with an object containing additional property named "consumed" with a
   * truthy value (timestamp, date, boolean, etc).
   *
   * @param {string} id - Identifier of oidc-provider model
   * @returns {Promise} - Promise fulfilled when the operation succeeded. Rejected with error when
   * encountered.
   */
  async consume(id) {
    const { Model } = this;

    await Model.updateOne(
      { jti: id },
      {
        consumed_at: new Date(),
      },
    );
  }

  /**
   * Destroy/Drop/Remove a stored oidc-provider model. Future finds for this id should be fulfilled
   * with falsy values.
   *
   * @param {string} id - Identifier of oidc-provider model.
   * @returns {Promise} - Promise fulfilled when the operation succeeded. Rejected with error when
   * encountered.
   */
  async destroy(id) {
    const { Model } = this;

    await Model.deleteOne(
      {
        jti: id,
      },
    );
  }

  /**
   * Destroy/Drop/Remove a stored oidc-provider model by its grantId property reference. Future
   * finds for all tokens having this grantId value should be fulfilled with falsy values.
   *
   * @param {string} grantId - the grantId value associated with a this model's instance.
   * @returns {Promise} - Promise fulfilled when the operation succeeded. Rejected with error when
   * encountered.
   */
  async revokeByGrantId() {
    // TODO:
  }
}

module.exports = Adapter;

/**
 * @member {"Grant"|"Session"|"AccessToken"|"AuthorizationCode"|"RefreshToken"|"ClientCredentials"|"Client"|"InitialAccessToken"|"RegistrationAccessToken"|"DeviceCode"|"Interaction"|"ReplayDetection"|"PushedAuthorizationRequest"} name - Name of the oidc-provider model.
 * @memberOf Adapter
 * @instance
 * @const
 */

/**
 * @member {import("mongoose").Model} Model
 * @memberOf Adapter
 * @instance
 * @const
 */
