/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into /users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();
const queryPolls = require('../db/queries/poll_results_details');
const queryOptions = require('../db/queries/poll_results_options');
const sumConverter = require('../public/scripts/sumsConverter');

router.get('/:id/results', (req, res) => {
  queryPolls.getPollDetails(req.params.id)
    .then(pollDetails => {
      queryOptions.getPollOptions(req.params.id)
        .then(pollOptions => {
          const converted = sumConverter.toPercentage(pollOptions);
          const pollResultsQuery = {
            pollTitle: pollDetails[0].title,
            numOfVoters: pollDetails[0].total_voters,
            pollQuestion: pollDetails[0].question,
            options: converted
          }
          return res.render('polls_results', pollResultsQuery);
        })
        .catch(error => {
          console.log("inner cought it");
          res.statusCode = 404;
          return res.render('error', {code: 404});
        });
    })
    .catch(error => {
      res.statusCode = 404;
      return res.render('error', {code: 404});
    });
});

module.exports = router;
