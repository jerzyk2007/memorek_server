const express = require('express');
const router = express.Router();
// const phrasesController = require('../../controllers/phrasesController');
// const ROLES_LIST = require('../../config/roles_list');
// const verifyRoles = require('../../middleware/verifyRoles');
const getCollectionsName = require('../../controllers/collectionsController');

router.route('/')
    .get(getCollectionsName);



module.exports = router;