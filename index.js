const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const cookieSession = require('cookie-session');
const keys = require('./config/keys');
require('./models/User');
require('./services/passport');

mongoose.connect(keys.mongoURI, { useNewUrlParser: true })
    .then(() => console.log('successfully connected to Mongo'))
    .catch(err => console.log(err));

const app = express();

app.use(cookieSession({
    // @TODO: reduce cookie maxAge after testing
    maxAge: 30 * 24 * 60 * 60 * 1000,
    keys: keys.cookieSessionKeys
}));
app.use(passport.initialize());
app.use(passport.session());

require('./routes/authRoutes')(app);

const PORT = process.env.PORT || 5000;
app.listen(PORT);