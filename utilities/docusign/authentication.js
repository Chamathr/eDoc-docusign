const fs = require("fs-extra");
const path = require('path');
const jwt = require("jsonwebtoken");
const keyDirectory = path.resolve(__dirname, '../../env/docusign');
const keyFile = 'docusign.pem';
const superagent = require('superagent');

const generateAndSignJWTAssertion = async (args) => {
    try{
      const MILLESECONDS_PER_SECOND = 1000,
      JWT_SIGNING_ALGO = "RS256",
      now = Math.floor(Date.now() / MILLESECONDS_PER_SECOND),
      later = Math.floor(now + (MILLESECONDS_PER_SECOND * 60 * 60))
  
      const jwtPayload = {
        iss: args.clientId,
        sub: args.userId,
        aud: args.instanceUri,
        iat: now,
        exp: later,
        scope: args.scope,
      };

      const privateKey = fs.readFileSync(path.resolve(keyDirectory, keyFile))
  
      return await jwt.sign(jwtPayload, privateKey, { algorithm: JWT_SIGNING_ALGO });
    }
    catch(error){
      return error
    }
  };
  
  const sendJWTTokenRequest = async (assertion, oAuthBasePath) => {
    try{
      const response = await superagent.post("https://" + oAuthBasePath + "/oauth/token")
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .set('Cache-Control', 'no-store')
      .set('Pragma', 'no-cache')
      .send({
        'assertion': assertion,
        'grant_type': 'urn:ietf:params:oauth:grant-type:jwt-bearer'
      })
      const {body: {access_token}} = response
      return access_token;
    }
    catch(error){
      return error
    }
  };
  
  /*return jwt tokent to access docusign APIs*/
  const requestJWTUserToken = async (args) => {
    try{
      const assertion = await generateAndSignJWTAssertion(args);
      const accessToken = await sendJWTTokenRequest(assertion, args.instanceUri)
      return accessToken
    }
    catch(error){
      return error
    }
      
  };

  module.exports = {requestJWTUserToken}