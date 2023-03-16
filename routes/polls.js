const express = require('express');
const router = express.Router();
const sendEmail = require('../lib/mailgun.js');

const pollsQueries = require('../db/queries/polls');
const newPollQueries = require('../db/queries/poll_new');
const getPollQueries = require('../db/queries/poll_get');
const votingQueries = require('../db/queries/vote_new');
const pollCompleteQueries = require('../db/queries/poll_complete');
const queryPolls = require('../db/queries/poll_details');
const queryOptions = require('../db/queries/poll_options');
const sumConverter = require('../lib/sumsConverter');

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

router.get('/new', (req, res) => {
  res.render('polls_new');
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
      // todo: helper function to build urls from id
      // todo : pass the urls and email to mailgun function

      sendEmail(`Your New poll is ready to share! - ${req.body.title}`, `

      Your new poll "${req.body.title}" is ready to share with your family & friends!\n
      Share URL:  <a href='http://localhost:8080/polls/${createdPollId}'>Vote on - "${req.body.title}"\n</a>
      Results URL:  <a href='http://localhost:8080/polls/${createdPollId}/results'>Poll Results - "${req.body.title}"</a>

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

router.post('/:id/complete', (req, res) => {
  const pollId = req.params.id;
  pollCompleteQueries.completePoll(pollId)
    .then(poll => {
      res.sendStatus(204);
    })
    .catch((err) => {
      console.error('error:', err);
    });
})

router.post('/:id', (req, res) => {

  console.log(req.body);

  votingQueries.insertVotes(req.params.id, req.body.name, req.body.results)
    .then((data) => {

      const pollTitle = data.rows[0].title;
      // todo: helper function to build urls from id
      sendEmail(`New Poll Submission on - ${pollTitle} - by ${req.body.name}`, `

      Your new poll "${pollTitle}" is ready to share with your family & friends!\n
      Share URL:  <a href='http://localhost:8080/polls/${createdPollId}'>Vote on - "${pollTitle}"\n</a>
      Results URL:  <a href='http://localhost:8080/polls/${createdPollId}/results'>Poll Results - "${pollTitle}"</a>

      `);


      res.redirect('/thank-you');
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: err.message });
    });
});

router.get('/:id/results', (req, res) => {
  queryPolls.getPollDetails(req.params.id)
    .then(pollDetails => {
      console.log(pollDetails)
      if (pollDetails.length === 0) {
        res.statusCode = 404;
        return res.redirect('/error', {code: 404});
      }

      queryOptions.getPollOptions(req.params.id)
        .then(pollOptions => {
          const converted = sumConverter.toPercentage(pollOptions);
          const pollResultsQuery = {
            pollIdNum: pollDetails[0].id,
            pollTitle: pollDetails[0].title,
            numOfVoters: pollDetails[0].total_voters,
            pollQuestion: pollDetails[0].question,
            options: converted,
            buttonState: ""
          }

          if (pollDetails[0].complete) {
            pollResultsQuery.buttonState = 'disabled';
          }

          return res.render('polls_results', pollResultsQuery);
        })
        .catch(error => {
          res.statusCode = 404;
          return res.render('error', {code: 404});
        });
    })
    .catch(error => {
      res.statusCode = 400;
      return res.render('error', {code: 400});
    });
});

router.patch('/:id/results', (req, res) => {
  pollCompleteQueries.completePoll(req.params.id)
    .then(pollId => {
      return res.redirect('/polls');
    })
    .catch(error => {
      res.statusCode = 404;
      return res.render('error', {code: 404});
    });
});

module.exports = router;
