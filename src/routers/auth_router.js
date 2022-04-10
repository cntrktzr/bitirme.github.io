const router = require('express').Router();
const authController = require('../controllers/auth_controller');
const validatorMiddleware = require('../middlewares/validation_middleware');


router.get('/login', authController.loginForm);
router.post('/login', validatorMiddleware.validateLogin(), authController.login);

router.get('/register', authController.registerForm);
router.post('/register', validatorMiddleware.validateNewUser(),authController.register);

router.get('/forget-password', authController.forgetPasswordForm);
router.post('/forget_password', authController.forgetPassword);

module.exports = router;