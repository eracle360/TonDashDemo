const User = require('../models/userModel');
const Admin = require('../models/adminModel');

exports.ensureAuthenticated = (req, res, next) => {
  if (req.session.userId) {
    User.findById(req.session.userId)
      .then((user) => {
        if (!user) {
          return res.redirect('/');
        }
        req.user = user;
        next();
      })
      .catch((err) => res.status(500).send('Error authenticating user.'));
  } else {
    res.redirect('/');
  }
};

exports.ensureAdminAuthenticated = (req, res, next) => {
  if (req.session.adminId) {
    Admin.findById(req.session.adminId)
      .then((admin) => {
        if (!admin) {
          return res.redirect('/admin/login');
        }
        req.admin = admin;
        next();
      })
      .catch((err) => res.status(500).send('Error authenticating admin.'));
  } else {
    res.redirect('/admin/login');
  }
};
