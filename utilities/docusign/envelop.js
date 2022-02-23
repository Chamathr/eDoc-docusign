const docusign = require('docusign-esign');
const fs = require("fs-extra");
const path = require('path');
const docsDirectory = path.resolve(__dirname, '../../demo_docs');
const docsFile = 'World_Wide_Corp_lorem.pdf';

const pdfDocument = fs.readFileSync(path.resolve(docsDirectory, docsFile))
  
const sendEnvelope = async (args, accessToken) => {

    let dsApiClient = new docusign.ApiClient();
    dsApiClient.setBasePath(args.basePath);
    dsApiClient.addDefaultHeader('Authorization', 'Bearer ' + accessToken);
    let envelopesApi = new docusign.EnvelopesApi(dsApiClient), results = null;
  
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
    return ({envelopeId: envelopeId, status: args.envelopStatus})
  }
  
  
  const makeEnvelope = (args) => {
  
    let doc2DocxBytes;
    // read files from a local directory
    // The reads could raise an exception if the file is not available!
    doc2DocxBytes = pdfDocument;
  
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
    envelopeDefinition.status = args.envelopStatus;
  
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


module.exports = {sendEnvelope, getEnvelope}