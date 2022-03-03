const CONSTANTS = require('../env/sendgrid/apiKey')
const emailClient = require('@sendgrid/mail');
const client = require('@sendgrid/client');
const fs = require("fs");
pathToAttachment = `${__dirname}/../demo_docs/World_Wide_Corp_lorem.pdf`;
attachment = fs.readFileSync(pathToAttachment).toString("base64");
const responses = require('../constants/responses')
const templateFunctions = require('../utilities/sendgrid/templates')


emailClient.setApiKey(CONSTANTS.SENDGRID_API_KEY);
client.setApiKey(CONSTANTS.SENDGRID_API_KEY);

const emailList = [
    {
        to: 'chamatht20@gmail.com'
    },
    {
        to: 'hashandarshika@gmail.com'
    }
]

/*add email configurations*/
const message = {
    // to: emailList,
    personalizations: emailList,
    from: 'chamath@orelit.com',
    replyTo: 'chamath@orelit.com',
    subject: 'Sendgrid Test',
    text: 'Sengrid Test',
    html: '<h1>Sendgrid Test</h1>',
    template_id: 'd-10b15317d62844458515bcee0158d451',
    attachments: [
        {
          content: attachment,
          filename: "World_Wide_Corp_lorem.pdf",
          type: "application/pdf",
          disposition: "attachment"
        }
      ]
}

/*send email via sendgrid*/
const sendEmail = async (req, res, next) => {
    let templateId = null
    const templateName = await req.body.name
    try{
        const templateList = await templateFunctions.getTemplateList(client)
        if(templateList){
          templateList[0].body.result.map(template => {
            if(template.name === templateName){
              templateId = template.id
              return
            }
          })
          if(templateId){
            message.template_id = templateId
            await emailClient.send(message)
            responses.responseBody.results = ''
            return res.send(responses.responseBody)
          }
          else{
            responses.errorBody.error = "Template is not existing"
            return res.send(responses.errorBody)
          }
        }
        else{
          responses.errorBody.error = "There are no templates"
          return res.send(responses.errorBody)
        }    
    }
    catch(error){
        responses.errorBody.error = error
        res.status(500).send(responses.errorBody)
    }
}

/*fetch email details after complete via webhook*/
const getEmailStatus = async (req, res, next) => {
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

const createTemplateDataHeader = {
    "on-behalf-of": "The subuser's username. This header generates the API call as if the subuser account was making the call."
  };
  const createTemplateData = {
    "name": "example_name",
    "generation": "dynamic"
  };
  
  const createTemplateRequest = {
    url: `/v3/templates`,
    method: 'POST',
    // headers: createTemplateDataHeader,
    body: createTemplateData
  }

  const createTemplate = async (req, res, next) => {
    try{        
      const result = await client.request(createTemplateRequest)
      responses.responseBody.result = result
      res.send(responses.responseBody)
    }
    catch(error){
      responses.errorBody.error = error
      res.status(500).send(responses.errorBody)
    }
}





const getTemplateHeader = {
  "on-behalf-of": "The subuser's username. This header generates the API call as if the subuser account was making the call."
};
const getTemplateParams = {
  "generations": "dynamic",
  "page_size": 20
};

const getTemplateRequest = {
  url: `/v3/templates`,
  method: 'GET',
  // headers: getTemplateHeader,
  qs: getTemplateParams
}

const getTemplate = async (req, res, next) => {
  try{        
    const result = await client.request(getTemplateRequest)
    responses.responseBody.result = result
    res.send(responses.responseBody)
  }
  catch(error){
    responses.errorBody.error = error
    res.status(500).send(responses.errorBody)
  }
}



module.exports = {sendEmail, createTemplate, getEmailStatus, getTemplate}