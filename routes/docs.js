const express = require('express');
const documentController = require('../controllers/docs.controlller')

const router = express.Router();

router.post('/', documentController.sendDocument);
router.get('/', documentController.getDocument);
router.post('/status', documentController.getDocumentStatus)

module.exports = router;