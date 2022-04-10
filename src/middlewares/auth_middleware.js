const loggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    else {
        req.flash('error', ['Please Login']);
        res.redirect('/login')
    }
}

module.exports = {
    loggedIn
}