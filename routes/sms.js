const express = require('express');
const smsController = require('../controllers/sms.controller')

const router = express.Router();

router.post('/', smsController.sendSms)


module.exports = router