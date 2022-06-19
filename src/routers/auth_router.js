const router = require("express").Router();
const authController = require("../controllers/auth_controller");
const validatorMiddleware = require("../middlewares/validation_middleware");
const authMiddleware = require("../middlewares/auth_middleware");

router.get("/login", authMiddleware.notLoggedIn, authController.loginForm);
router.post(
  "/login",
  authMiddleware.notLoggedIn,
  validatorMiddleware.validateLogin(),
  authController.login
);

router.get(
  "/register",
  authMiddleware.notLoggedIn,
  authController.registerForm
);
router.post(
  "/register",
  authMiddleware.notLoggedIn,
  validatorMiddleware.validateNewUser(),
  authController.register
);

router.get("/logout", authMiddleware.loggedIn, authController.logout);

module.exports = router;
