const express = require('express');
const router = express.Router();
const phrasesController = require('../../controllers/phrasesController');

router.route('/learn/:type/:collections')
    .get(phrasesController.getLearnPhrases);
router.route('/test/:type/:collections')
    .get(phrasesController.getTestPhrases);

module.exports = router;