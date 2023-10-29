// const express = require('express');
// const router = express.Router();
// const phrasesController = require('../../controllers/phrasesController');
// const ROLES_LIST = require('../../config/roles_list');
// const verifyRoles = require('../../middleware/verifyRoles');

// router.route('/')
//     .get(phrasesController.getAllPhrases)
//     .post(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), phrasesController.createNewPhrases)
//     .put(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), phrasesController.updatePhrase)
//     .delete(verifyRoles(ROLES_LIST.Admin), phrasesController.deletePhrase);

// router.route('/one')
//     .get(phrasesController.getSamplePhrase);

// router.route('/:id')
//     .get(phrasesController.getPhrase);



// module.exports = router;


const express = require('express');
const router = express.Router();
const phrasesController = require('../../controllers/phrasesController');
const ROLES_LIST = require('../../config/roles_list');
const verifyRoles = require('../../middleware/verifyRoles');

// router.route('/')
//     .get(phrasesController.getAllPhrases)
//     .post(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), phrasesController.createNewPhrases)
//     .put(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), phrasesController.updatePhrase)
//     .delete(verifyRoles(ROLES_LIST.Admin), phrasesController.deletePhrase);

// router.route('/one')
//     .get(phrasesController.getSamplePhrase);

router.route('/:collections')
    .get(phrasesController.getAllPhrases);

// router.route('/:collections/:id')
// .get(phrasesController.getAllPhrases);

module.exports = router;