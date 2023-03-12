- GET   /polls                 => Admin panel if you're logged in
- GET   /polls/new             => Gets the create poll form
- POST  /polls                 => Creates a new poll
- GET   /polls/:id/results     => The poll results
- PATCH /polls/:id/complete    => Completes the poll

- GET   /polls/:id/            => Get the voting form (sets or removes the cookie & resets navbar)
- POST  /polls/:id/            => Votes on a poll

- GET   /thank-you
- GET   /error



