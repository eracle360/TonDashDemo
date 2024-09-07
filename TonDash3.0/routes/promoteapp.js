const express = require('express');
const router = express.Router();

// Route to render Promoteapp.ejs
router.get('/', (req, res) => {
  res.render('Promoteapp');  // This renders Promoteapp.ejs
});

module.exports = router;
