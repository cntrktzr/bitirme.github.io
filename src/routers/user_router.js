const router = require("express").Router();
const userController = require("../controllers/user_controller");
const authMiddleware = require("../middlewares/auth_middleware");

router.get("/", authMiddleware.loggedIn, userController.showMainPage);
router.get("/profil", authMiddleware.loggedIn, userController.showProfil);

router.post("/change-profile", authMiddleware.loggedIn, userController.updateProfile);

module.exports = router;
