const passport = require('passport');

module.exports = (app) => {
    app.get(
        '/auth/google',
        passport.authenticate('google', { scope: ['profile', 'email'] })
    );
    
    app.get(
        '/auth/google/callback', 
        passport.authenticate('google'),
       (req, res) => res.redirect('/surveys')
    );

    app.get('/api/current_user', (req, res) => {
        req.user ? res.send(req.user) : res.send({ error: 'Not logged in'});
    });

    app.get('/api/logout', (req, res) => {
        req.logout();
        res.redirect('/');
    })
};

