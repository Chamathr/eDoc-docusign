const express = require('express');
const emailController = require('../controllers/email.controller')

const router = express.Router();

router.post('/', emailController.sendEmail)
router.post('/template', emailController.createTemplate)
router.post('/status', emailController.getEmailStatus)
router.get('/template', emailController.getTemplate)


module.exports = router