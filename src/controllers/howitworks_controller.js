const showHowItWorks = function (req, res, next) {
    res.render("index", { layout: "./layout/howitworks.ejs" });
  };
  
  
  module.exports = {
    showHowItWorks,
  };