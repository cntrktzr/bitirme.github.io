const router = require("express").Router();
const joinController = require("../controllers/join_controller");

router.get("/", joinController.showJoin);

module.exports = router;
