const Admin = require('../models/adminModel');
const App = require('../models/appModel');

exports.login = (req, res) => {
  const { username, password } = req.body;
  Admin.findOne({ username, password })
    .then((admin) => {
      if (!admin) {
        console.error('Invalid credentials');
        return res.status(401).send('Invalid credentials.');
      }
      req.session.adminId = admin._id;
      res.redirect('/admin/dashboard');
    })
    .catch((err) => {
      console.error('Error logging in:', err);
      res.status(500).send('Error logging in.');
    });
};

exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Error logging out:', err);
      return res.status(500).send('Error logging out.');
    }
    res.redirect('/admin/login');
  });
};

exports.getDashboard = (req, res) => {
  Promise.all([
    App.find({ status: 'pending' }),
    App.find({ status: 'promoted' }),
    App.find({ status: 'deleted' }),
    App.find({ status: 'approved' })
  ]).then(([pendingApps, promotedApps, deletedApps, approvedApps]) => {
    res.render('adminDashboard', { pendingApps, promotedApps, deletedApps, approvedApps, users: [] }); // Add users as per your requirement
  }).catch((err) => {
    console.error('Error retrieving apps:', err);
    res.status(500).send('Error retrieving apps.');
  });
};

exports.addApp = (req, res) => {
  const newApp = new App({
    ...req.body,
    screenshots: req.files['screenshots'] ? req.files['screenshots'].map(file => file.path) : [],
    icon: req.files['icon'] ? req.files['icon'][0].path : '',
    video: req.files['video'] ? req.files['video'][0].path : '',
    reviews: [],
    createdAt: new Date()
  });
  newApp.save()
    .then(() => res.redirect('/admin/dashboard'))
    .catch((err) => {
      console.error('Error adding app:', err);
      res.status(500).send('Error adding app.');
    });
};

exports.approveApp = (req, res) => {
  App.findByIdAndUpdate(req.params.id, { status: 'approved' }, { new: true })
    .then(() => res.redirect('/admin/dashboard'))
    .catch((err) => {
      console.error('Error approving app:', err);
      res.status(500).send('Error approving app.');
    });
};

exports.deleteApp = (req, res) => {
  App.findByIdAndUpdate(req.params.id, { status: 'deleted' }, { new: true })
    .then(() => res.redirect('/admin/dashboard'))
    .catch((err) => {
      console.error('Error deleting app:', err);
      res.status(500).send('Error deleting app.');
    });
};

exports.promoteApp = (req, res) => {
  App.findByIdAndUpdate(req.params.id, { status: 'promoted' }, { new: true })
    .then(() => res.redirect('/admin/dashboard'))
    .catch((err) => {
      console.error('Error promoting app:', err);
      res.status(500).send('Error promoting app.');
    });
};

exports.removeFromPromoted = (req, res) => {
  App.findByIdAndUpdate(req.params.id, { status: 'approved' }, { new: true })
    .then(() => res.redirect('/admin/dashboard'))
    .catch((err) => {
      console.error('Error removing app from promoted:', err);
      res.status(500).send('Error removing app from promoted.');
    });
};
