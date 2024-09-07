const User = require('../models/userModel');

exports.login = (req, res) => {
  const { telegramId, username } = req.body;
  User.findOneAndUpdate({ telegramId }, { username }, { upsert: true, new: true })
    .then((user) => {
      req.session.userId = user._id;
      res.redirect('/');
    })
    .catch((err) => {
      res.status(500).send('Error logging in.');
    });
};

exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send('Error logging out.');
    }
    res.redirect('/');
  });
};
