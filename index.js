const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const keys = require('./config/keys');
require('./models/User');
require('./services/passport');

mongoose.connect(keys.mongoURI, { useNewUrlParser: true })
    .then(() => console.log('successfully connected to Mongo'))
    .catch(err => console.log(err));

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieSession({
    // @TODO: reduce cookie maxAge after testing
    maxAge: 30 * 24 * 60 * 60 * 1000,
    keys: keys.cookieSessionKeys
}));
app.use(passport.initialize());
app.use(passport.session());

require('./routes/authRoutes')(app);
require('./routes/billingRouts')(app);

if (process.env.NODE_ENV === 'production') {
    // Serve production assets if no matching routes
    app.use(express.static('client/build'));

    // Serve index.html if no routes or assets (for React router to sort out)
    const path = require('path');
    app.get('*', (req, res) => {
        res.sendFile(path(__dirname, 'client', 'build', 'index.html'));
    });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT);