const showMainPage = function (req, res, next) {
  res.render("index", { layout: "./layout/user_layout.ejs" });
};

module.exports = {
  showMainPage,
};
