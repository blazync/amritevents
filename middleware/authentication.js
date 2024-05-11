// authMiddleware.js

// This middleware function checks if the user is authenticated
const isAuthenticated = (req, res, next) => {
  // Check if the user is logged in
  if (req.session && req.session.token) {
    // If logged in, allow access to the next middleware or route handler
    next();
  } else {
    // If not logged in, redirect the user to the login page
    res.redirect('/account');
  }
};

module.exports = isAuthenticated;
