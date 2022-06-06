const router = require("express").Router();
const userController = require("../controllers/user_controller");
const authMiddleware = require("../middlewares/auth_middleware");

router.get("/", authMiddleware.loggedIn, userController.showMainPage);

module.exports = router;
