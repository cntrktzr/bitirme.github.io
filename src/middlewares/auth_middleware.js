

const loggedIn = function (req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    req.flash("error", ["Please Login"]);
    res.redirect("/login");
  }
};

const notLoggedIn = function (req, res, next) {
  if (!req.isAuthenticated()) {
    return next();
  } else {
    res.redirect("/user");
  }
};



module.exports = {
  loggedIn,
  notLoggedIn,
};
