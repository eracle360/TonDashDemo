const express = require('express');
const router = express.Router();
const Admin = require('../models/adminModel');
const App = require('../models/appModel');
const multer = require('multer');
const adminController = require('../controllers/adminController');
const upload = require('../middlewares/uploads'); // Ensure this path is correct

// Middleware to check if the user is logged in
function isAuthenticated(req, res, next) {
  if (req.session.adminId) {
    return next();
  } else {
    res.redirect('/admin/login');
  }
}

// Admin login
router.get('/login', (req, res) => {
  res.render('adminLogin');
});

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  Admin.findOne({ username, password })
    .then((admin) => {
      if (!admin) {
        return res.status(401).send('Invalid credentials.');
      }
      req.session.adminId = admin._id;
      res.redirect('/admin/dashboard');
    })
    .catch((err) => res.status(500).send('Error logging in.'));
});

// Admin dashboard
router.get('/dashboard', isAuthenticated, adminController.getDashboard);

// Admin logout
router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send('Error logging out.');
    }
    res.redirect('/admin/login');
  });
});

// Add App from admin dashboard
router.post('/add-app', isAuthenticated, (req, res, next) => {
  upload(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).send('File too large. Maximum allowed size is 50MB.');
      }
      return res.status(400).send(`Multer error: ${err.message}`);
    } else if (err) {
      return res.status(500).send(`Upload error: ${err.message}`);
    }
    adminController.addApp(req, res);
  });
});

// Approve app
router.post('/apps/:id/approve', isAuthenticated, adminController.approveApp);

// Delete app
router.post('/apps/:id/delete', isAuthenticated, adminController.deleteApp);

// Promote app
router.post('/apps/:id/promoted', isAuthenticated, adminController.promoteApp);

// Remove app from promoted
router.post('/apps/:id/remove-promoted', isAuthenticated, adminController.removeFromPromoted);

module.exports = router;
