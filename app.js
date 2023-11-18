require('dotenv').config();
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const methodOverride = require("method-override");
const connectDB = require('./server/config/db');
const session = require('express-session');
const passport = require('passport');
const MongoStore = require('connect-mongo');

const path = require('path'); // Added 'path' module

const app = express();
const port = process.env.PORT || 3000; // Adjusted port definition

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI
  }),
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));

// Connect to Database
connectDB();

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Set up Templating Engine
app.use(expressLayouts);
app.set('layout', 'layouts/main'); // Adjusted path to the layout file
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routes
app.use('/', require('./server/routes/auth'));
app.use('/', require('./server/routes/index'));
app.use('/', require('./server/routes/dashboard'));

// Handle 404
app.get('*', function(req, res) {
  res.status(404).render('404'); // Rendering '404.ejs' for all unmatched routes
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
