const CONSTANTS = require('../env/sendgrid/apiKey')
const emailClient = require('@sendgrid/mail');
const client = require('@sendgrid/client');
const fs = require("fs");
pathToAttachment = `${__dirname}/../demo_docs/World_Wide_Corp_lorem.pdf`;
attachment = fs.readFileSync(pathToAttachment).toString("base64");

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
    try{        
        await emailClient.send(message)
        res.send('Email sent successfully')
    }
    catch(error){
        res.status(500).send({error})
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
      res.status(500).send({error})
    }
  }

const headers = {
    "on-behalf-of": "The subuser's username. This header generates the API call as if the subuser account was making the call."
  };
  const data = {
    "name": "example_name",
    "generation": "dynamic"
  };
  
  const request = {
    url: `/v3/templates`,
    method: 'POST',
    headers: headers,
    body: data
  }

  const createTemplate = async (req, res, next) => {
    try{        
        const response = await client.request(request)
        res.send(response)
    }
    catch(error){
        res.status(500).send({error})
    }
}

module.exports = {sendEmail, createTemplate, getEmailStatus}