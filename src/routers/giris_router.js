const router = require("express").Router();
const girisController = require("../controllers/giris_controller");
const aboutUsController = require("../controllers/aboutus_controller");
const howItWorksController = require("../controllers/howitworks_controller")

router.get("/", girisController.showGiris);

router.get("/about-us", aboutUsController.showAboutUs );
router.get("/how-it-works", howItWorksController.showHowItWorks)

module.exports = router;
