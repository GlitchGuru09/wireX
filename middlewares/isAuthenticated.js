module.exports.isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated && req.isAuthenticated()) {
      return next();
    }
    res.redirect("/users/login"); 
  };