const express = require('express');
const emailController = require('../controllers/email.controller')

const router = express.Router();

router.post('/', emailController.sendEmail)
router.post('/template', emailController.createTemplate)
router.post('/sms', emailController.sendSms)


module.exports = router