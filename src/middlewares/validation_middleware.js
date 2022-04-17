const {body} = require('express-validator');

const validateNewUser = () =>{
    return [
        body('email')
            .trim()
            .isEmail().withMessage('Enter valid e-mail.'),
        
        body('password')
            .trim()
            .isLength({min:8}).withMessage('Minumum 8 character.')
            .isLength({max:20}).withMessage('Maximum 20 character.'),
        
        body('name')
            .trim()
            .isLength({min:3}).withMessage('Minumum 3 character.')
            .isLength({max:30}).withMessage('Maximum 30 character.'),
        
        body('lastname')
            .trim()
            .isLength({min:3}).withMessage('Minumum 3 character.')
            .isLength({max:30}).withMessage('Maximum 30 character.'),
        
        body('rpassword')
            .trim()
            .custom((value, {req}) => {
<<<<<<< HEAD
                if(value !== req.body.password){2
                    throw new Error('Passwords does not match.')
=======
                if(value !== req.body.password){
                    throw new Error('Passwords do not match.')
>>>>>>> 66bcaa617a9eb5ecb5a25053bfc02ed1763fe138
                }
                return true;

        }),

        body('language')
            .trim()
        
    ]
}

const validateLogin = () =>{
    return [
        body('email')
            .trim()
            .isEmail().withMessage('Enter valid e-mail.'),
        
        body('password')
            .trim()
            .isLength({min:8}).withMessage('Minumum 8 character.')
            .isLength({max:20}).withMessage('Maximum 20 character.'),
           
    ]
}

const validateEmail = () => {

    return [
        body('email')
            .trim()
            .isEmail().withMessage('Enter valid e-mail.'),        
    ]
}

const validateNewPassword = () =>{
    return [
        
        body('password')
            .trim()
            .isLength({min:8}).withMessage('Minumum 8 character.')
            .isLength({max:20}).withMessage('Maximum 20 character.'),

        body('rpassword')
            .trim()
            .custom((value, {req}) => {
                if(value !== req.body.password){
                    throw new Error('Passwords do not match.')
                }
                return true;
        }) 
    ]
}

module.exports = {
    validateNewUser,
    validateLogin,
    validateEmail,
    validateNewPassword

}