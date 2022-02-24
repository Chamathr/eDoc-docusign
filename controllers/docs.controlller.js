const authFunctions = require('../utilities/docusign/authentication')
const envelopFunctions = require('../utilities/docusign/envelop')
const CONSTANTS = require('../env/constant')


const docusignDetails = {
    ccEmail: CONSTANTS.DOCUSIGN_CC_EMAIL,
    ccName: CONSTANTS.DOCUSIGN_CC_NAME,

    clientId: CONSTANTS.DOCUSIGN_CLIENT_ID,
    userId: CONSTANTS.DOCUSIGN_USER_ID,
    instanceUri: CONSTANTS.DOCUSIGN_INSTANCE_URI,
    scope: CONSTANTS.DOCUSIGN_SCOPE,
  
    basePath: CONSTANTS.DOCUSIGN_BASE_PATH,
    accountId: CONSTANTS.DOCUSIGN_ACCOUNT_ID,
    envelopStatus: CONSTANTS.DOCUSIGN_ENVELOP_STATUS
  }

const sendDocument = async (req, res, next) => {
    docusignDetails.signerEmail = await req.body.email;
    docusignDetails.templateCategory = await req.body.templateCategory;
    docusignDetails.signerName = 'Chamath'
    try{
      const accessToken = await authFunctions.requestJWTUserToken(docusignDetails);
      const results = await envelopFunctions.sendEnvelope(docusignDetails, accessToken)
      res.send(results)
    }catch(error){
      res.status(500).send({error})
    }
}

const getDocument = async (req, res, next) => {
    docusignDetails.signerEmail = await req.params.email
    docusignDetails.envelopeId = '38496f5f-4ddd-4d67-bd21-3856910e4902'
    try{
        const accessToken = await authFunctions.requestJWTUserToken(docusignDetails);
        const results = await envelopFunctions.getEnvelope(docusignDetails, accessToken)
        res.send(results)
    }
    catch(error){
        res.status(500).send({error})
    }
}

const getDocumentStatus = async (req, res, next) => {
  try{
    const data = await req.body
    console.log(data);
    res.status(200).end()
  }
  catch(error){
    res.status(500).send({error})
  }
}

  module.exports = {sendDocument, getDocument, getDocumentStatus}