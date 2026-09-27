const express = require("express");
const adminController = require("../controllers/admin-controller");
const authMiddleware = require("../middlewares/auth-middleware");
const adminMiddleware = require("../middlewares/admin-middleware");

const router = express.Router(); 

router
.route('/users')
.get(authMiddleware,adminMiddleware,adminController.getAllUsers);

router
.route("/users/:id")
.get(authMiddleware,adminMiddleware,adminController.getUserById)

router
.route("/users/update/:id")
.patch(authMiddleware,adminMiddleware,adminController.updateUserById);

router
.route("/users/delete/:id")
.delete(authMiddleware,adminMiddleware,adminController.deleteUserById)

router
.route("/contacts")
.get(authMiddleware,adminMiddleware,adminController.getContacts);

router
.route("/contacts/delete/:id")
.delete(authMiddleware,adminMiddleware,adminController.deleteContactById);

router
.route("/menu")
.get(authMiddleware,adminMiddleware,adminController.getMenu);

router
.route("/menu/:day")
.patch(authMiddleware,adminMiddleware,adminController.updateMenuByDay);

router
.route("/recipes")
.get(authMiddleware,adminMiddleware,adminController.getRecipes)
.put(authMiddleware,adminMiddleware,adminController.upsertRecipe);

router
.route("/services")
.get(authMiddleware,adminMiddleware,adminController.getServices);

module.exports = router;                               
