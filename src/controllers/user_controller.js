const showMainPage = function (req, res, next) {
  res.render("index", { layout: "./layout/user_layout.ejs" });
};

const showProfil = function (req, res, next) {
  res.render("profil", { user:req.user, layout: "./layout/user_layout.ejs" });
};

const updateProfile = function (req, res, next) {
  console.log(req.body);
};

module.exports = {
  showMainPage,
  showProfil,
  updateProfile
};
