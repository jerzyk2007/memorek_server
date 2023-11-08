const express = require("express");
const router = express.Router();
const usersController = require("../../controllers/usersController");
const ROLES_LIST = require("../../config/roles_list");
const verifyRoles = require("../../middleware/verifyRoles");

// router
//   .route("/")
//   .get(verifyRoles(ROLES_LIST.Admin), usersController.getAllUsers)
//   .delete(verifyRoles(ROLES_LIST.Admin), usersController.deleteUser);

router
    .route("/change-name")
    .patch(verifyRoles(ROLES_LIST.User), usersController.handleChangeName);

router
    .route("/register")
    .post(verifyRoles(ROLES_LIST.Admin), usersController.handleNewUser);
// .post(usersController.handleNewUser);
// .put(verifyRoles(ROLES_LIST.User), usersController.changePassword);
module.exports = router;
