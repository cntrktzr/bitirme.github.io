const showJoin = function (req, res, next) {
  res.render("index", { layout: "./layout/join_layout.ejs" });
};

module.exports = {
  showJoin,
};
