const Jetton = require('../models/jettonModel');

exports.addJetton = (req, res) => {
  const newJetton = new Jetton(req.body);
  newJetton.save()
    .then(() => res.redirect('/jettons'))
    .catch((err) => res.status(500).send('Error adding jetton.'));
};

exports.getAllJettons = (req, res) => {
  Jetton.find()
    .then((jettons) => res.render('jettons', { jettons }))
    .catch((err) => res.status(500).send('Error retrieving jettons.'));
};
