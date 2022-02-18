const express = require('express');
const documentController = require('../controllers/docs.controlller')

const router = express.Router();

router.post('/', documentController.sendDocument);


module.exports = router;