const express = require('express');
const documentController = require('../controllers/docs.controlller')

const router = express.Router();

router.post('/:email', documentController.sendDocument);
router.get('/:email', documentController.getDocument);



module.exports = router;