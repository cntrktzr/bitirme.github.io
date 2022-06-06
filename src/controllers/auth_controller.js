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
        console.log(jwtToken);

        //sending mail

        const url = process.env.WEB_SITE_URL + "verify?id=" + jwtToken;
        console.log("gidilecek url: " + url);

        let transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_SIFRE,
          },
        });

        await transporter.sendMail(
          {
            from: "T&I <info@TandI.com",
            to: newUser.email,
            subject: "Please confirm your email",
            text: "Please click the link to confirm your email " + url,
          },

          (error, info) => {
            if (error) {
              console.log("Hata" + error);
            }
            console.log("Mail gönderildi");
            console.log(info);
            transporter.close();
          }
        );

        req.flash("success_message", [{ msg: "Please check your mailbox." }]);
        res.redirect("/login");
      }
    } catch (err) {}
  }
};

const forgetPasswordForm = (req, res, next) => {
  res.render("forget_password", { layout: "./layout/auth_layout.ejs" });
};

const forgetPassword = async (req, res, next) => {
  const hatalar = validationResult(req);
  if (!hatalar.isEmpty()) {
    req.flash("validation_error", hatalar.array());
    req.flash("email", req.body.email);

    res.redirect("/forget-password");
  } else {
    try {
      const _user = await User.findOne({
        email: req.body.email,
        emailAktif: true,
      });

      if (_user) {
        const jwtInfo = {
          id: _user._id,
          email: _user.email,
        };
        const secret =
          process.env.RESET_PASSWORD_JWT_SECRET + "-" + _user.password;
        const jwtToken = jwt.sign(jwtInfo, secret, { expiresIn: "1d" });

        const url =
          process.env.WEB_SITE_URL +
          "reset-password/" +
          _user._id +
          "/" +
          jwtToken;

        let transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_SIFRE,
          },
        });

        await transporter.sendMail(
          {
            from: "T&I <info@TandI.com",
            to: _user.email,
            subject: "Reset Password",
            text: "Please click the link to reset your password " + url,
          },

          (error, info) => {
            if (error) {
              console.log("Hata" + error);
            }
            console.log("Mail gönderildi");
            console.log(info);
            transporter.close();
          }
        );

        req.flash("success_message", [{ msg: "Please check your mailbox." }]);
        res.redirect("/login");
      } else {
        req.flash("validation_error", [{ msg: "E-mail not found" }]);
        req.flash("email", req.body.email);
        res.redirect("forget-password");
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
                { msg: "E-mail başarıyla onaylandı" },
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

/*const saveNewPassword = async (req, res, next) => {

    const hatalar = validationResult(req);
    if(!hatalar.isEmpty()){

        req.flash('validation_error', hatalar.array());
        req.flash('password', req.body.password);
        req.flash('rpassword', req.body.rpassword);

        console.log("Formdan gelen değerler");
        console.log(req.body);

        res.redirect('/reset-password/'+req.body.id+"/"+req.body.token);
    }
    else{
        const _bulunanUser = await User.findOne({ _id: req.body.id, emailAktif:true });

        const secret = process.env.RESET_PASSWORD_JWT_SECRET + "-" + _bulunanUser.sifre;

        try {
            jwt.verify(req.body.token, secret, async (e, decoded) => {
            
                if (e) {
                    req.flash('error', 'Kod Hatalı veya Süresi Geçmiş');
                    res.redirect('/forget-password');
                } else {
                    
                    const hashedPassword = await bcrypt.hash(req.body.sifre, 10);
                    const sonuc = await User.findByIdAndUpdate(req.body.id, { sifre : hashedPassword });
            
                    if (sonuc) {
                        req.flash("success_message", [{ msg: 'Başarıyla şifre güncellendi' }]);
                        res.redirect('/login');
                    } else {
                        req.flash("error",'Lütfen tekrar şifre sıfırlama adımlarını yapın');
                        res.redirect('/login');
                    }
                }
            });
        } catch (err) {
            console.log("hata cıktı"+err);
      }


    }

}*/

const newPasswordForm = async (req, res, next) => {
  const linktekiID = req.params.id;
  const linktekiToken = req.params.token;

  if (linktekiID && linktekiToken) {
    const _bulunanUser = await User.findOne({ _id: linktekiID });
    const secret =
      process.env.RESET_PASSWORD_JWT_SECRET + "-" + _bulunanUser.password;

    try {
      jwt.verify(linktekiToken, secret, async (e, decoded) => {
        if (e) {
          req.flash("error", "Kod Hatalı veya Süresi Geçmiş");
          res.redirect("/forget-password");
        } else {
          res.render("new_password", { layout: "./layout/auth_layout.ejs" });
          //console.log("Yeni şifre işin ekran");
          /*const tokenID = decoded.id;
                    const sonuc = await User.findByIdAndUpdate(tokenID, {emailAktif : true})

                    if(sonuc){
                        req.flash("success_message", [{msg : 'E-mail başarıyla onaylandı'}]);
                        res.redirect('/login');
                    }else {
                        req.flash("error", 'Lütfen tekrar kayıt olunuz');
                        res.redirect('/login');
                    }*/
        }
      });
    } catch (err) {}
  } else {
    req.flash("validation_error", [{ msg: "Lütfen maildeki linke tıklayın" }]);
    res.redirect("forget-password");
  }
};

module.exports = {
  loginForm,
  registerForm,
  forgetPasswordForm,
  register,
  login,
  forgetPassword,
  logout,
  verifyMail,
  newPasswordForm,
  //saveNewPassword
};
