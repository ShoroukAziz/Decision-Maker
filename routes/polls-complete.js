const express = require('express');
const router  = express.Router();
const pollCompleteQueries = require('../db/queries/polls-complete');

router.post('/:id', (req, res) => {
  const pollId = req.params.id;
  pollCompleteQueries.completePoll(pollId)
    .then(poll => {
      res.sendStatus(204);
    })
    .catch((err) => {
      console.error('error:', err);
    });
})

module.exports = router;
