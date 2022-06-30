const { validationResult } = require("express-validator");
const { Passport } = require("passport/lib");
const Join = require("../model/join_model");
const passport = require("passport");
require("../config/passport_local")(passport);

const showMainPage = function (req, res, next) {
  res.render("index", { user: req.user, layout: "./layout/user_layout.ejs" });
};

const showProfil = function (req, res, next) {
  res.render("profil", { user: req.user, layout: "./layout/user_layout.ejs" });
};

const updateProfile = async function (req, res, next) {

  const updatedInfo = {
    name: req.body.name,
    lastname: req.body.lastname,
    language: req.body.language
  }

  try{
    console.log(req.body);
   const sonuc =  await User.findByIdAndUpdate(req.user.id, updatedInfo)
   
    if(sonuc){
      console.log("Updated");
    }

  }
  catch(hata){
    console.log(hata);

  }
};

const showJoinPage = function (req, res, next) {
  res.render("index", {
    user: req.user,
    layout: "./layout/create_meeting.ejs",
  });
};

const createRoom = async (req, res, next) => {
  const hatalar = validationResult(req);
  if (!hatalar.isEmpty()) {
    req.flash("validation_error", hatalar.array());
    req.flash("room", req.body.room);
    res.redirect("/user/user-create-meeting");
  } else {
    try {
      const _roomID = await Join.findOne({ room: req.body.room });
      console.log(hatalar);
      if (_roomID) {
        req.flash("validation_error", [{ msg: "This Room ID has been taken" }]);
        req.flash("room", req.body.room);
        res.redirect("/user/user-create-meeting");
      } else {
        const newRoom = new Join({
          room: req.body.room,
        });
        await newRoom.save();
        console.log("Room ID kaydedildi.");

        res.redirect("/chat?username="+req.body.username+"&room="+req.body.room+"&language="+req.body.language);
      }
    } catch (err) {
      console.log(err);
    }
  }
};

const showUserJoin = function (req, res, next) {
  res.render("index", {
    user: req.user,
    layout: "./layout/userjoin_layout.ejs",
  });
};

module.exports = {
  showMainPage,
  showProfil,
  updateProfile,
  showJoinPage,
  createRoom,
  showUserJoin,
};
