// load .env data into process.env
require('dotenv').config();

// Web server config
const sassMiddleware = require('./lib/sass-middleware');
const express = require('express');
const morgan = require('morgan');
const methodOverride = require('method-override');
const cookieSession = require('cookie-session');


const PORT = process.env.PORT || 8080;
const app = express();

app.set('view engine', 'ejs');

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(
  '/styles',
  sassMiddleware({
    source: __dirname + '/styles',
    destination: __dirname + '/public/styles',
    isSass: false, // false => scss, true => sass
  })
);
app.use(express.static('public'));
app.use(methodOverride('_method'))
app.use(cookieSession({
  name: 'session',
  keys: ['834975rjher43nf43895rjd98', 'gfjhg786675hg6756gf56gfhf7ui'],
}));


// Separated Routes for each Resource
// Note: Feel free to replace the example routes below with your own

const pollsRoutes = require('./routes/polls');
const thankYouRoutes = require('./routes/thank-you');
const errorRoutes = require('./routes/error');
const loginRoutes = require('./routes/login');
const logoutRoutes = require('./routes/logout');


// Mount all resource routes
// Note: Feel free to replace the example routes below with your own
// Note: Endpoints that return data (eg. JSON) usually start with `/api`
app.use('/polls', pollsRoutes);
app.use('/thank-you', thankYouRoutes);
app.use('/error', errorRoutes);
app.use('/login', loginRoutes);
app.use('/logout', logoutRoutes);

// Note: mount other resources here, using the same pattern above

// Home page
// Warning: avoid creating more routes in this file!
// Separate them into separate routes files (see above).


app.get('/', (req, res) => {
  let templateVars = {};
  if (req.session.userId) {
    templateVars = {
      user:
      {
        id: req.session.userId,
        email: req.session.userEmail,
        name: req.session.userName
      }
    }
  }
  res.render('home', templateVars);
});

app.listen(PORT, () => {
  console.log(`ChoiceMate app listening on port ${PORT}`);
});
