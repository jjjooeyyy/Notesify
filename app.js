require('dotenv').config();

const express = require('express');
const methodOverride = require('method-override');
const expressLayouts = require('express-ejs-layouts');
const connectDB = require('./server/config/db');
const mongoose = require('mongoose');
// Keep user login 
const session = require('express-session');
const passport = require('passport');
const MongoStore = require('connect-mongo');

const app = express(); 
const port = 3000 || process.env.PORT;

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI
    })
}))

app.use(passport.initialize());
app.use(passport.session());


app.use(express.urlencoded({extended:true}));
app.use(express.json()); 
app.use(methodOverride("_method"));
// Connect to the Database 
connectDB(); 
 
// Static Files
app.use(express.static('public'));

// Templating Engine
app.use(expressLayouts);
app.set('layout','./layouts/main');
app.set('view engine','ejs');

// Routes
app.use('/', require('./server/routes/auth'));
app.use('/', require('./server/routes/index'));
app.use('/', require('./server/routes/dashboard'));

// Handle 404
app.get('*',(req,res)=> {
    res.status(404).render('404.ejs');
})

app.listen(port,()=> {
    console.log(`ON Port ${port}!`);
})  