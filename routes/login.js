const express = require('express');
const router = express.Router();


router.get('/', (req, res) => {
  req.session.userId = 1;
  req.session.userName = "John Smith";
  req.session.userEmail = "choicemateapp@gmail.com";
  res.redirect('/polls');
});

module.exports = router;
