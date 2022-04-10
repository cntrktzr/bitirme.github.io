const LocalStrategy = require('passport-local').Strategy;
const User = require('../model/user_model');


module.exports = function(passport){

    const options = {
        usernameField: 'email',
        passwordField: 'password'
    };

    passport.use(new LocalStrategy(options, async (email, password, done)=>{

        try{
            const _foundUser = await User.findOne({email: email})

            if(!_foundUser){
                return done(null, false, {message: 'User not found.'})
            }

            if(_foundUser.password !== password) {
                return done(null, false, {message: 'Password is incorrect'});
            }

            else{
                return done(null, _foundUser);
            }

        }
        catch(err){
            return done(err);

        }

    }));

    passport.serializeUser(function(user, done){
        console.log("Session a kaydedildi"+ user.id);
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done){
        console.log("ID bulundu");
        User.findById(id, function(err, user){
            done(err, user);
        });
    });



}