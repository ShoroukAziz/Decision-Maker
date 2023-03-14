const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.render('polls_new');
});


module.exports = router;
