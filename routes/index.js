var express = require('express');
var router = express.Router();
const documentController = require('../controllers/docs.controlller')

router.post('/docstatus', documentController.getDocumentStatus)

module.exports = router;
