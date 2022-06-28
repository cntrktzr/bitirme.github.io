
const showAboutUs = function (req, res, next) {
    res.render("index", { layout: "./layout/aboutus_layout.ejs" });
  };
  
  
  module.exports = {
    showAboutUs
  };