const CONSTANTS = require('../env/sendgrid/constant')
const emailClient = require('@sendgrid/mail');

emailClient.setApiKey(CONSTANTS.SENDGRID_API_KEY);

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

/*add email configurations*/
const message = {
    to: 'chamatht20@gmail.com',
    from: 'chamath@orelit.com',
    subject: 'Sendgrid Test',
    text: 'Sengrid Test',
    html: '<h1>Sendgrid Test</h1>',
    template_id: 'd-1922942f6c5a4229a8db162162e6bfae'
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

module.exports = {sendEmail}