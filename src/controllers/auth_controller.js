const {validationResult} = require('express-validator');
const { Passport } = require('passport/lib');
const User = require('../model/user_model');
const passport = require ('passport');
require('../config/passport_local')(passport);



const loginForm = (req, res, next) =>{
    res.render('login', {layout:'./layout/auth_layout.ejs'})
}

const login = (req, res, next) =>{
    const hatalar = validationResult(req);

    req.flash('email', req.body.email);
    req.flash('password', req.body.password);
    if(!hatalar.isEmpty()){

        req.flash('validation_error', hatalar.array());
        res.redirect('/login');
    }

    else{
        passport.authenticate('local', {
            successRedirect: '/user',
            failureRedirect: 'login',
            failureFlash: true
        })(req, res, next);
    }
}

const registerForm = (req, res, next) =>{
    res.render('register', {layout:'./layout/auth_layout.ejs'})
}

const register = async (req, res, next) =>{

    const hatalar = validationResult(req);
    if(!hatalar.isEmpty()){

        req.flash('validation_error', hatalar.array());
        req.flash('email', req.body.email);
        req.flash('name', req.body.name);
        req.flash('lastname', req.body.lastname);
        req.flash('password', req.body.password);
        req.flash('rpassword', req.body.rpassword);
        res.redirect('/register');
    }

    else{
        try{
            const _user = await User.findOne({email:req.body.email});

            if(_user){
                req.flash('validation_error', [{msg :"This e-mail has been taken"}]);
                req.flash('email', req.body.email);
                req.flash('name', req.body.name);
                req.flash('lastname', req.body.lastname);
                req.flash('password', req.body.password);
                req.flash('rpassword', req.body.rpassword);
                res.redirect('/register');
            }

            else{
                const newUser = new User({
                    email : req.body.email,
                    name : req.body.name,
                    lastname : req.body.lastname,
                    password : req.body.password

                });
                await newUser.save();
                console.log("Kullanıcı kaydedildi.")

                req.flash('success_message', [{msg : 'Kayıt olma işlemi başarılı.'}])
                res.redirect('/login');
            }
        }
        catch(err) {

        }
    
    }
    
}

const forgetPasswordForm = (req, res, next) =>{
    res.render('forget_password', {layout:'./layout/auth_layout.ejs'})
}

const forgetPassword = (req, res, next) =>{
    console.log(req.body);
    res.render('forget_password', {layout:'./layout/auth_layout.ejs'})
}


module.exports = {
    loginForm,
    registerForm,
    forgetPasswordForm,
    register,
    login,
    forgetPassword
}