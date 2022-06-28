const showChat = function (req, res, next) {
  res.render("index", { layout: "./layout/chat_layout.ejs" });
};


module.exports = {
  showChat,
};
