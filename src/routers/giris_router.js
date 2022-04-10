const router = require('express').Router();
const girisController = require('../controllers/giris_controller')

router.get('/', girisController.showGiris);


module.exports = router;