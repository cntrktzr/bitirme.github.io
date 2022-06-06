const showGiris = function (req, res, next) {
  res.render("index", { layout: "./layout/giris_layout.ejs" });
};

module.exports = {
  showGiris,
};
