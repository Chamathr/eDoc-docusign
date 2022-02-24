const express = require('express');
const documentController = require('../controllers/docs.controlller')

const router = express.Router();

router.post('/', documentController.sendDocument);
router.get('/:email', documentController.getDocument);
// router.post('/docstatus', documentController.getDocumentStatus)

module.exports = router;