const router = require("express").Router();
const chatController = require("../controllers/chat_controller");

router.get("/", chatController.showChat);


module.exports = router;
