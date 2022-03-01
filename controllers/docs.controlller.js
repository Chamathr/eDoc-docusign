const authFunctions = require('../utilities/docusign/authentication')
const envelopFunctions = require('../utilities/docusign/envelop')
const CONSTANTS = require('../constants/docusign/constant')
const responses = require('../constants/responses')

/*docusign account constant variable*/
const docusignDetails = {
    // ccEmail: CONSTANTS.DOCUSIGN_CC_EMAIL,
    // ccName: CONSTANTS.DOCUSIGN_CC_NAME,

    clientId: CONSTANTS.DOCUSIGN_CLIENT_ID,
    userId: CONSTANTS.DOCUSIGN_USER_ID,
    instanceUri: CONSTANTS.DOCUSIGN_INSTANCE_URI,
    scope: CONSTANTS.DOCUSIGN_SCOPE,
  
    basePath: CONSTANTS.DOCUSIGN_BASE_PATH,
    accountId: CONSTANTS.DOCUSIGN_ACCOUNT_ID,
    envelopStatus: CONSTANTS.DOCUSIGN_ENVELOP_STATUS
  }

/*send document*/
const sendDocument = async (req, res, next) => {
    docusignDetails.templateCategory = await req.body.templateCategory;
    docusignDetails.signerDetails = await req.body.signerDetails;

    try{
      const accessToken = await authFunctions.requestJWTUserToken(docusignDetails);
      const results = await envelopFunctions.sendEnvelope(docusignDetails, accessToken)
      responses.responseBody.results = results
      res.send(responses.responseBody)
    }catch(error){
      responses.errorBody.error = error
      res.status(500).send(responses.errorBody)
    }
}

/*get document status using api passing envelop id*/ 
const getDocument = async (req, res, next) => {
    docusignDetails.signerEmail = await req.params.email
    docusignDetails.envelopeId = '38496f5f-4ddd-4d67-bd21-3856910e4902'
    try{
      const accessToken = await authFunctions.requestJWTUserToken(docusignDetails);
      const results = await envelopFunctions.getEnvelope(docusignDetails, accessToken)
      responses.responseBody.results = results
      res.send(responses.responseBody)
    }
    catch(error){
      responses.errorBody.error = error
      res.status(500).send(responses.errorBody)
    }
}

/*fetch document details after complete via webhook*/
const getDocumentStatus = async (req, res, next) => {
  try{
    const data = await req.body
    console.log(data);
    res.status(200).end()
  }
  catch(error){
    responses.errorBody.error = error
    res.status(500).send(responses.errorBody)
  }
}

  module.exports = {sendDocument, getDocument, getDocumentStatus}