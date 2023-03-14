/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into /users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();

router.get('/', (req, res) => {
  const pollResultsQuery = {
    pollTitle:'Cafe for Lunch',
    numOfVoters: 10,
    pollQuestion: 'Which cafe do you guys want to go to for lunch tomorrow?',
    options: {
      optOne: {name: 'Purebread', percentage: 90},
      optTwo: {name: 'Thierry Alberni', percentage: 60},
      optThree: {name: 'Breka Bakery & Cafe', percentage: 40},
      optFour: {name: 'Breka Bakery & Cafe', percentage: 50},
      optFive: {name: 'Breka Bakery & Cafe', percentage: 80}
    }
  }
  res.render('polls_results', pollResultsQuery);
});

module.exports = router;
