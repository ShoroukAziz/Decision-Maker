const express = require('express');
const router = express.Router();
const sendEmail = require('../mailgun.js');

const pollsQueries = require('../db/queries/polls');
const newPollQueries = require('../db/queries/new_poll');
const getPollQueries = require('../db/queries/get_poll');
const votingQueries = require('../db/queries/create_votes');


router.get('/api', (req, res) => {
  const creatorId = 1; // replace by user
  pollsQueries.getAllPolls(creatorId)
    .then(polls => {
      return res.json(polls);
    })

    .catch(err => {
      res
        .status(500)
        .json({ error: err.message });
    });
})

router.get('/', (req, res) => {
  const creatorId = 1; // replace by user
  pollsQueries.getAllPolls(creatorId)
    .then(() => {
      res.render('index');
    })

    .catch(err => {
      res
        .status(500)
        .json({ error: err.message });
    });
});

router.post('/', (req, res) => {
  console.log("req Body", req.body);

  // change to req.session.userId later
  newPollQueries.createPoll(1, {
    title: req.body.title,
    question: req.body.question,
    options: Object.values(req.body).slice(2)
  })
    .then((data) => {
      const createdPollId = data.rows[0].id;
      const creatorEmail = data.rows[0].email
      // todo: helper function to build urls from id
      // todo : pass the urls and email to mailgun function

      sendEmail(`Your New poll is ready to share! - ${req.body.title}`, `

      Your new poll "${req.body.title}" is ready to share with your family & friends!\n
      Share URL:  http://localhost:8080/polls/${createdPollId}\n
      Results URL:  href="http://localhost:8080/polls/${createdPollId}/results

      `);

      res.redirect('/polls');
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: err.message });
    });
});

router.get('/:id', (req, res) => {

  getPollQueries.getPollAndOptionsByPollId(req.params.id)
    .then((data) => {

      const choices = [];
      data.forEach(element => {
        choices.push(
          {
            id: element.option_id,
            description: element.description
          }
        )
      });
      const templateVars = {
        id: data[0].id,
        title: data[0].title,
        question: data[0].question,
        choices
      };
      res.render('polls_vote', templateVars);
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: err.message });
    });
});


router.post('/:id', (req, res) => {

  console.log(req.body);

  votingQueries.insertVotes(req.params.id, req.body.name, req.body.results)
    .then((data) => {

      const creatorEmail = data.rows[0].email;
      // todo: helper function to build urls from id
      // todo : pass the urls and email to mailgun function


      res.redirect('/thank-you');
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: err.message });
    });
});


module.exports = router;
