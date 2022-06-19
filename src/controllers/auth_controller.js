const { validationResult } = require("express-validator");
const { Passport } = require("passport/lib");
const User = require("../model/user_model");
const passport = require("passport");
require("../config/passport_local")(passport);
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");

const loginForm = (req, res, next) => {
  res.render("login", { layout: "./layout/auth_layout.ejs" });
};

const login = (req, res, next) => {
  const hatalar = validationResult(req);

  req.flash("email", req.body.email);
  req.flash("password", req.body.password);
  if (!hatalar.isEmpty()) {
    req.flash("validation_error", hatalar.array());
    res.redirect("/login");
  } else {
    passport.authenticate("local", {
      successRedirect: "/user",
      failureRedirect: "login",
      failureFlash: true,
    })(req, res, next);
  }
};

const registerForm = (req, res, next) => {
  res.render("register", { layout: "./layout/auth_layout.ejs" });
};

const register = async (req, res, next) => {
  const hatalar = validationResult(req);
  if (!hatalar.isEmpty()) {
    req.flash("validation_error", hatalar.array());
    req.flash("email", req.body.email);
    req.flash("name", req.body.name);
    req.flash("lastname", req.body.lastname);
    req.flash("password", req.body.password);
    req.flash("rpassword", req.body.rpassword);
    req.flash("language", req.body.language);
    res.redirect("/register");
  } else {
    try {
      const _user = await User.findOne({ email: req.body.email });

      if (_user && _user.emailAktif == true) {
        req.flash("validation_error", [{ msg: "This e-mail has been taken" }]);
        req.flash("email", req.body.email);
        req.flash("name", req.body.name);
        req.flash("lastname", req.body.lastname);
        req.flash("password", req.body.password);
        req.flash("rpassword", req.body.rpassword);
        res.redirect("/register");
      } else if ((_user && _user.emailAktif == false) || _user == null) {
        if (_user) {
          await User.findByIdAndRemove({ _id: _user._id });
        }
        const newUser = new User({
          email: req.body.email,
          name: req.body.name,
          lastname: req.body.lastname,
          password: await bcrypt.hash(req.body.password, 10),
          language: req.body.language,
        });
        await newUser.save();
        console.log("Kullanıcı kaydedildi.");

        //jwt
        const jwtInfo = {
          id: newUser.id,
          mail: newUser.email,
        };

        const jwtToken = jwt.sign(
          jwtInfo,
          process.env.CONFIRM_MAIL_JWT_SECRET,
          { expiresIn: "1d" }
        );
        //console.log(jwtToken);

        //verify account

        const url = process.env.WEB_SITE_URL + "verify?id=" + jwtToken;
        console.log("gidilecek url: " + url);

        req.flash("success_message", [{ msg: "Please click here to verify your account. " + url} ]);
        res.redirect("/login");
      }
    } catch (err) {}
  }
};


const logout = (req, res, next) => {
  req.logout();
  req.session.destroy((error) => {
    res.clearCookie("connect.sid");
    //req.flash('success_message', [{msg: 'Başarıyla çıkış yapıldı.'}]);
    res.render("login", {
      layout: "./layout/auth_layout.ejs",
      success_message: [{ msg: "Başarıyla çıkış yapıldı." }],
    });
    //res.redirect('/login');
  });
};

const verifyMail = (req, res, next) => {
  const token = req.query.id;
  if (token) {
    try {
      jwt.verify(
        token,
        process.env.CONFIRM_MAIL_JWT_SECRET,
        async (e, decoded) => {
          if (e) {
            req.flash("error", "Kod Hatalı veya Süresi Geçmiş");
            res.redirect("/login");
          } else {
            const tokenID = decoded.id;
            const sonuc = await User.findByIdAndUpdate(tokenID, {
              emailAktif: true,
            });

            if (sonuc) {
              req.flash("success_message", [
                { msg2: "E-mail başarıyla onaylandı" },
              ]);
              res.redirect("/login");
            } else {
              req.flash("error", "Lütfen tekrar kayıt olunuz");
              res.redirect("/login");
            }
          }
        }
      );
    } catch (err) {}
  } else {
    console.log("Token yok");
  }
};



module.exports = {
  loginForm,
  registerForm,
  register,
  login,
  logout,
  verifyMail,

};
