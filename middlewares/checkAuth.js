// user must be authenticated to proceed to the next function
exports.isPrivate = (req, res, next) => {
  if(req.session.user) {
    return next();
  }
  else {
    res.redirect('/login');
  }
}

// user does not need to be authenticated to proceed to the next function
exports.isPublic = (req, res, next) => {
  if(req.session.user) {
    res.redirect('/');
  }
  else {
    return next();
  }
}