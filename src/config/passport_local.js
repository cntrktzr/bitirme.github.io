const LocalStrategy = require("passport-local").Strategy;
const User = require("../model/user_model");
const bcrypt = require("bcrypt");

module.exports = function (passport) {
  const options = {
    usernameField: "email",
    passwordField: "password",
  };

  passport.use(
    new LocalStrategy(options, async (email, password, done) => {
      try {
        const _foundUser = await User.findOne({ email: email });

        if (!_foundUser) {
          return done(null, false, { message: "User not found." });
        }
        const passwordControl = await bcrypt.compare(
          password,
          _foundUser.password
        );

        if (!passwordControl) {
          return done(null, false, { message: "Password is incorrect" });
        } else {
          if (_foundUser && _foundUser.emailAktif == false) {
            return done(null, false, { message: "Please verify your email" });
          } else {
            return done(null, _foundUser);
          }
        }
      } catch (err) {
        return done(err);
      }
    })
  );

  passport.serializeUser(function (user, done) {
    console.log("Session a kaydedildi" + user.id);
    done(null, user.id);
  });

  passport.deserializeUser(function (id, done) {
    console.log("ID bulundu");
    User.findById(id, function (err, user) {
      done(err, user);
    });
  });
};
