const docusign = require('docusign-esign');
const fs = require("fs-extra");
const path = require('path');
const demoDocsPath = path.resolve(__dirname, '../demo_docs');
const doc2File = 'World_Wide_Corp_lorem.pdf';
const jwt = require("jsonwebtoken");
const keyDirectory = path.resolve(__dirname, '../env');
const keyFile = 'docusign.pem';
const superagent = require('superagent');
const { token } = require('morgan');

const generateAndSignJWTAssertion = async () => {

  let MILLESECONDS_PER_SECOND = 1000,
    JWT_SIGNING_ALGO = "RS256",
    now = Math.floor(Date.now() / MILLESECONDS_PER_SECOND),
    later = Math.floor(now + (MILLESECONDS_PER_SECOND * 60 * 60))

  let jwtPayload = {
    iss: "bbc18eb9-9794-48d4-b6a7-5d052dc37575",
    sub: "9aa6fbf3-76b6-4f20-a9c1-4dca998a38bb",
    aud: "account-d.docusign.com",
    iat: now,
    exp: later,
    scope: "signature impersonation",
  };

  const privateKey = fs.readFileSync(path.resolve(keyDirectory, keyFile))

  return await jwt.sign(jwtPayload, privateKey, { algorithm: JWT_SIGNING_ALGO });
};

const sendJWTTokenRequest = async (assertion, oAuthBasePath) => {
  const response = await superagent.post("https://" + oAuthBasePath + "/oauth/token")
    // .timeout(exports.prototype.timeout)
    .set('Content-Type', 'application/x-www-form-urlencoded')
    .set('Cache-Control', 'no-store')
    .set('Pragma', 'no-cache')
    .send({
      'assertion': assertion,
      'grant_type': 'urn:ietf:params:oauth:grant-type:jwt-bearer'
    })
    const {body: {access_token}} = response
    return access_token;
  
};

const requestJWTUserToken = async () => {
    const assertion = await generateAndSignJWTAssertion();
    const accessToken = await sendJWTTokenRequest(assertion, "account-d.docusign.com")
    return accessToken
};

// const getAccessToken = async () => {

//   const privateKey = fs.readFileSync(path.resolve(keyDirectory, keyFile))

//   let header = {
//     "typ": "JWT",
//     "alg": "RS256",
//   };
  
//   let now = Date.now()/1000;
//   let later = now + (1000 * 60 * 60);
//   let body = {
//     iss: "85cebcdb-bb9a-4230-9dcd-53642dcc29e8",
//     sub: "9aa6fbf3-76b6-4f20-a9c1-4dca998a38bb",
//     iat: now,
//     exp: later,
//     aud: "account-d.docusign.com",
//     scope: "signature impersonation"
//   };

//   try{
//     header = Buffer.from(JSON.stringify(header)).toString('base64');
//     body = Buffer.from(JSON.stringify(body)).toString('base64');
  
//     let payload = header + "." + body;
//     let token = jwt.sign(body, privateKey, { algorithm: "RS256" });
//     console.log("token", token);
//     return token
//   }
//   catch(error){
//     return error
//   }
// }

const args = {
    signerName: 'Chamath',
    ccEmail: 'chamath@orelit.com',
    ccName: 'OREL IT',
  
    doc2File: path.resolve(demoDocsPath, doc2File),
    privateKey: fs.readFileSync(path.resolve(keyDirectory, keyFile)),

    clientId: "85cebcdb-bb9a-4230-9dcd-53642dcc29e8",
    userId: "9aa6fbf3-76b6-4f20-a9c1-4dca998a38bb",
    instanceUri: "account-d.docusign.com",
    scope: "signature impersonation",
  
    status: 'sent',
    accessToken: '',
    basePath: 'https://demo.docusign.net/restapi/',
    accountId: '6389afb0-1cff-457a-995f-c484936c9faf'
  }

  // const value = requestJWTUserToken()

const sendDocument = async (req, res, next) => {
    args.signerEmail = await req.params.email
    try{
        const accessToken = await requestJWTUserToken();
        const results = await sendEnvelope(args, accessToken)
        res.send(results)
      }catch(error){
        res.status(500).send({error})
      }
      
}

const getDocument = async (req, res, next) => {
    args.signerEmail = await req.params.email
    args.envelopeId = 'e1e57d1b-9cb6-46cd-b034-d20416ea3113'
    try{
        const results = await getEnvelope(args, accessToken)
        res.send(results)
    }
    catch(error){
        res.status(500).send({error})
    }
}

const getDocumentStatus = async (req, res, next) => {
  try{
    const data = await req.body
    res.status(200).end()
  }
  catch(error){
    res.status(500).send({error})
  }
}

const sendEnvelope = async (args, accessToken) => {

    let dsApiClient = new docusign.ApiClient();
    dsApiClient.setBasePath(args.basePath);
    dsApiClient.addDefaultHeader('Authorization', 'Bearer ' + accessToken);
    let envelopesApi = new docusign.EnvelopesApi(dsApiClient)
      , results = null;
  
    // Make the envelope request body
    let envelope = makeEnvelope(args)
  
    // Call Envelopes::create API method
    // Exceptions will be caught by the calling function

    try{
        results = await envelopesApi.createEnvelope(args.accountId,{envelopeDefinition: envelope});
    }
    catch(error){
        return error
    }

    let envelopeId = results.envelopeId;
  
    console.log(`Envelope was created. EnvelopeId ${envelopeId}`);
    return ({envelopeId: envelopeId, status: args.status})
  }
  
  
  const makeEnvelope = (args) => {
  
    let doc2DocxBytes;
    // read files from a local directory
    // The reads could raise an exception if the file is not available!
    doc2DocxBytes = fs.readFileSync(args.doc2File);
  
    // Create the envelope definition
    let envelopeDefinition = new docusign.EnvelopeDefinition();
    envelopeDefinition.emailSubject = 'Please sign this document set';

    //set notification configuration(expire date, warning email time interval)
    const notification = { 
        useAccountDefaults : false, 
        reminders : { 
            reminderEnabled : true, 
            reminderDelay : 1, 
            reminderFrequency : 1 
        }, 
        expirations : { 
             expirationEnabled : true, 
             expirationAfter : 2, 
             expirationWarn : 1 
        } 
    }

    envelopeDefinition.notification = notification;

    //set webhook configurations
    const eventNotification = {
      url: "https://webhook.site/ee03eaec-eaa4-4271-a314-3507fab639f5",
      // url: "https://15b9-119-235-9-146.ngrok.io/docstatus", 

      requireAcknowledgment: "true",
      loggingEnabled: "true",
      envelopeEvents: [
          // {envelopeEventStatusCode: "Sent"},
          // {envelopeEventStatusCode: "Delivered"},
          // {envelopeEventStatusCode: "Declined"},
          // {envelopeEventStatusCode: "Voided"},
          {envelopeEventStatusCode: "Completed"}
      ],
      // recipientEvents: [
      //     {recipientEventStatusCode: "Sent"},
      //     {recipientEventStatusCode: "Delivered"},
      //     {recipientEventStatusCode: "Completed"},
      //     {recipientEventStatusCode: "Declined"},
      //     {recipientEventStatusCode: "AuthenticationFailed"},
      //     {recipientEventStatusCode: "AutoResponded"}
      // ],
      eventData: {
          version: "restv2.1",
          format:  "json",
          // includeData: ["custom_fields", "extensions", "folders",
          //     "recipients", "powerform", "tabs", "payment_tabs","documents"]
      }
    }
    
    envelopeDefinition.eventNotification = eventNotification;
  
    // add the documents
    let doc1 = new docusign.Document(), 
        doc1b64 = Buffer.from(document1(args)).toString('base64'), 
        doc2b64 = Buffer.from(doc2DocxBytes).toString('base64');
  
    doc1.documentBase64 = doc1b64;
    doc1.name = 'Agreement'; // can be different from actual file name
    doc1.fileExtension = 'html'; // Source data format. Signed docs are always pdf.
    doc1.documentId = '1'; // a label used to reference the doc
  
    let doc2 = new docusign.Document.constructFromObject({
      documentBase64: doc2b64,
      name: 'Port City', // can be different from actual file name
      fileExtension: 'pdf',
      documentId: '2'});
  
    // The order in the docs array determines the order in the envelope
    envelopeDefinition.documents = [doc1,doc2];
  
    // create a signer recipient to sign the document, identified by name and email
    // We're setting the parameters via the object constructor
    let signer1 = docusign.Signer.constructFromObject({
        email: args.signerEmail,
        name: args.signerName,
        recipientId: '1',
        routingOrder: '1'});
    // routingOrder (lower means earlier) determines the order of deliveries
    // to the recipients. Parallel routing order is supported by using the
    // same integer as the order for two or more recipients.
  
    // create a cc recipient to receive a copy of the documents, identified by name and email
    // We're setting the parameters via setters
    let cc1 = new docusign.CarbonCopy();
    cc1.email = args.ccEmail;
    cc1.name = args.ccName;
    cc1.routingOrder = '2';
    cc1.recipientId = '2';
  
    // Create signHere fields (also known as tabs) on the documents,
    // We're using anchor (autoPlace) positioning
    //
    // The DocuSign platform searches throughout your envelope's
    // documents for matching anchor strings. So the
    // signHere2 tab will be used in both document 2 and 3 since they
    // use the same anchor string for their "signer 1" tabs.
    let signHere1 = docusign.SignHere.constructFromObject({
        anchorString: '**signature_1**',
        anchorYOffset: '10', anchorUnits: 'pixels',
        anchorXOffset: '20'})
    , signHere2 = docusign.SignHere.constructFromObject({
        anchorString: '/sn1/',
        anchorYOffset: '10', anchorUnits: 'pixels',
        anchorXOffset: '20'})
    ;
  
    // Tabs are set per recipient / signer
    let signer1Tabs = docusign.Tabs.constructFromObject({
    signHereTabs: [signHere1, signHere2]});
    signer1.tabs = signer1Tabs;
  
    // Add the recipients to the envelope object
    let recipients = docusign.Recipients.constructFromObject({
    signers: [signer1],
    carbonCopies: [cc1]});
    envelopeDefinition.recipients = recipients;
  
    // Request that the envelope be sent by setting |status| to "sent".
    // To request that the envelope be created as a draft, set to "created"
    envelopeDefinition.status = args.status;
  
    return envelopeDefinition;
  }
  
  
  const document1 = (args) => {
    return `
    <!DOCTYPE html>
    <html>
        <head>
          <meta charset="UTF-8">
        </head>
        <body style="font-family:sans-serif;margin-left:2em;">
        <h1 style="font-family: 'Trebuchet MS', Helvetica, sans-serif;
            color: darkblue;margin-bottom: 0;">World Wide Corp</h1>
        <h2 style="font-family: 'Trebuchet MS', Helvetica, sans-serif;
          margin-top: 0px;margin-bottom: 3.5em;font-size: 1em;
          color: darkblue;">Order Processing Division</h2>
        <h4>Ordered by ${args.signerName}</h4>
        <p style="margin-top:0em; margin-bottom:0em;">Email: ${args.signerEmail}</p>
        <p style="margin-top:0em; margin-bottom:0em;">Copy to: ${args.ccName}, ${args.ccEmail}</p>
        <p style="margin-top:3em;">
  Candy bonbon pastry jujubes lollipop wafer biscuit biscuit. Topping brownie sesame snaps sweet roll pie. Croissant danish biscuit soufflé caramels jujubes jelly. Dragée danish caramels lemon drops dragée. Gummi bears cupcake biscuit tiramisu sugar plum pastry. Dragée gummies applicake pudding liquorice. Donut jujubes oat cake jelly-o. Dessert bear claw chocolate cake gummies lollipop sugar plum ice cream gummies cheesecake.
        </p>
        <!-- Note the anchor tag for the signature field is in white. -->
        <h3 style="margin-top:3em;">Agreed: <span style="color:white;">**signature_1**/</span></h3>
        </body>
    </html>
  `
  }

  const getEnvelope = async (args, accessToken) => {
  
    let dsApiClient = new docusign.ApiClient();
    dsApiClient.setBasePath(args.basePath);
    dsApiClient.addDefaultHeader("Authorization", "Bearer " + accessToken);
    let envelopesApi = new docusign.EnvelopesApi(dsApiClient),
      results = null;
  
    // Step 1. Call Envelopes::get
    // Exceptions will be caught by the calling function
    try{
        results = await envelopesApi.getEnvelope(
            args.accountId,
            args.envelopeId,
            null
          );
    }
    catch(error){
        return error
    }
    
    return results;
  };

  module.exports = {sendDocument, getDocument, getDocumentStatus}