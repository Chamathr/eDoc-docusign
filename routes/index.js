var express = require('express');
var router = express.Router();
const documentController = require('../controllers/docs.controlller')

/*fetch document details after complete via webhook*/
// router.post('/docstatus', documentController.getDocumentStatus)

module.exports = router;
