const CONSTANTS = require('../env/sendgrid/apiKey')
const emailClient = require('@sendgrid/mail');
const client = require('@sendgrid/client');

emailClient.setApiKey(CONSTANTS.SENDGRID_API_KEY);
client.setApiKey(CONSTANTS.SENDGRID_API_KEY);

const twilioAccountSid = CONSTANTS.TWILIO_ACCOUNT_SID;
const twilioAuthToken = CONSTANTS.TWILIO_AUTH_TOKEN;
const twilioNumber = CONSTANTS.TWILIO_PHONE_NUMBER;
const twilioServiceId = CONSTANTS.TWILIO_MESSAGE_SERVICE_ID;

const smsClient = require('twilio')(twilioAccountSid, twilioAuthToken);

const numbersList = ['+94726660070','+94702654310']
// const numbersList = ['+94726660070']
// const numbersList = ['+94702654310']


/*send sms via sendgrid-twilio*/
const sendSms = async (req, res, next) => {
    try{
        numbersList.map(async number => {
            await smsClient.messages
            .create({
                body: 'This is a test message',
                from: twilioNumber,
                to: number
            })
        })
    
        res.send(`sent message successfully`)
    }
    catch(error){
        res.status(500).send({error})
    }
}


// const message = {
//     personalizations: [
//       {
//         to: [
//           {
//             email: 'chamatht20@gmail.com',
//             name: 'John Doe'
//           },
//           {
//             email: 'chamatht20@gmail.com',
//             name: 'Julia Doe'
//           }
//         ],
//         cc: [
//           {
//             email: 'chamatht20@gmail.com',
//             name: 'Jane Doe'
//           }
//         ],
//         bcc: [
//           {
//             email: 'chamatht20@gmail.com',
//             name: 'Jim Doe'
//           }
//         ]
//       },
//       {
//         from: {
//           email: 'chamath@orelit.com',
//           name: 'Example Sales Team'
//         },
//         to: [
//           {
//             email: 'chamatht20@gmail.com',
//             name: 'Janice Doe'
//           }
//         ],
//         bcc: [
//           {
//             email: 'chamatht20@gmail.com',
//             name: 'Jordan Doe'
//           }
//         ]
//       }
//     ],
//     from: {
//       email: 'chamath@orelit.com',
//       name: 'Example Order Confirmation'
//     },
//     replyTo: {
//       email: 'chamath@orelit.com',
//       name: 'Example Customer Service Team'
//     },
//     subject: 'Your Example Order Confirmation',
//     content: [
//       {
//         type: 'text/html',
//         value: '<p>Hello from Twilio SendGrid!</p><p>Sending with the email service trusted by developers and marketers for <strong>time-savings</strong>, <strong>scalability</strong>, and <strong>delivery expertise</strong>.</p><p>%open-track%</p>'
//       }
//     ],
//     attachments: [
//       {
//         content: 'PCFET0NUWVBFIGh0bWw+CjxodG1sIGxhbmc9ImVuIj4KCiAgICA8aGVhZD4KICAgICAgICA8bWV0YSBjaGFyc2V0PSJVVEYtOCI+CiAgICAgICAgPG1ldGEgaHR0cC1lcXVpdj0iWC1VQS1Db21wYXRpYmxlIiBjb250ZW50PSJJRT1lZGdlIj4KICAgICAgICA8bWV0YSBuYW1lPSJ2aWV3cG9ydCIgY29udGVudD0id2lkdGg9ZGV2aWNlLXdpZHRoLCBpbml0aWFsLXNjYWxlPTEuMCI+CiAgICAgICAgPHRpdGxlPkRvY3VtZW50PC90aXRsZT4KICAgIDwvaGVhZD4KCiAgICA8Ym9keT4KCiAgICA8L2JvZHk+Cgo8L2h0bWw+Cg==',
//         filename: 'index.html',
//         type: 'text/html',
//         disposition: 'attachment'
//       }
//     ],
//     categories: [
//       'cake',
//       'pie',
//       'baking'
//     ],
//     sendAt: 1617260400,
//     batchId: 'AsdFgHjklQweRTYuIopzXcVBNm0aSDfGHjklmZcVbNMqWert1znmOP2asDFjkl',
//     asm: {
//       groupId: 12345,
//       groupsToDisplay: [
//         12345
//       ]
//     },
//     ipPoolName: 'transactional email',
//     mailSettings: {
//       bypassListManagement: {
//         enable: false
//       },
//       footer: {
//         enable: false
//       },
//       sandboxMode: {
//         enable: false
//       }
//     },
//     trackingSettings: {
//       clickTracking: {
//         enable: true,
//         enableText: false
//       },
//       openTracking: {
//         enable: true,
//         substitutionTag: '%open-track%'
//       },
//       subscriptionTracking: {
//         enable: false
//       }
//     }
//   };

const emailList = [
    'chamatht20@gmail.com',
    'hashandarshika@gmail.com'
]

/*add email configurations*/
const message = {
    to: emailList,
    from: 'chamath@orelit.com',
    replyTo: 'chamath@orelit.com',
    subject: 'Sendgrid Test',
    text: 'Sengrid Test',
    html: '<h1>Sendgrid Test</h1>',
    template_id: 'd-2940887fae764e8c8894acb3ebee2d1a'
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


module.exports = {sendEmail, createTemplate, sendSms}