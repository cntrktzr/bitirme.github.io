const { body } = require("express-validator");

const validateNewUser = () => {
  return [
    body("email").trim().isEmail().withMessage("Enter valid e-mail."),

    body("password")
      .trim()
      .isLength({ min: 8 })
      .withMessage("Minumum 8 character.")
      .isLength({ max: 20 })
      .withMessage("Maximum 20 character."),

    body("name")
      .trim()
      .isLength({ min: 3 })
      .withMessage("Minumum 3 character.")
      .isLength({ max: 30 })
      .withMessage("Maximum 30 character."),

    body("lastname")
      .trim()
      .isLength({ min: 3 })
      .withMessage("Minumum 3 character.")
      .isLength({ max: 30 })
      .withMessage("Maximum 30 character."),

    body("rpassword")
      .trim()
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error("Passwords do not match.");
        }
        return true;
      }),

    body("language").trim(),
  ];
};

const validateLogin = () => {
  return [
    body("email").trim().isEmail().withMessage("Enter valid e-mail."),

    body("password")
      .trim()
      .isLength({ min: 8 })
      .withMessage("Minumum 8 character.")
      .isLength({ max: 20 })
      .withMessage("Maximum 20 character."),
  ];
};

const validateEmail = () => {
  return [body("email").trim().isEmail().withMessage("Enter valid e-mail.")];
};

const validateJoin = () => {
  return [

    body("room")
      .trim()
      .isLength({ min: 10 })
      .withMessage("Minumum 10 character.")
      .isLength({ max: 20 })
      .withMessage("Maximum 20 character."),
  ];
};




module.exports = {
  validateNewUser,
  validateLogin,
  validateEmail,
  validateJoin
};
