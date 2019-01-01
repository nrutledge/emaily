const Path = require('path-parser').default;
const { URL } = require('url');
const mongoose = require('mongoose');
const requireLogin = require('../middlewares/requireLogin');
const requireCredits = require('../middlewares/requireCredits');
const Mailer = require('../services/Mailer');
const surveyTemplate = require('../services/emailTemplates/surveyTemplate');

const Survey = mongoose.model('Survey');

module.exports = app => {
  app.get('/api/surveys', requireLogin, async (req, res) => {
    const surveys = await Survey.find({ _user: req.user.id }).select ({ recipients: false });

    res.send(surveys);
  });

    app.get('/api/surveys/:surveyId/:choice', (req, res) => {
      res.send('Thanks for voting!');
    });

    app.post('/api/surveys/webhooks', (req, res) => {
      const p = new Path('/api/surveys/:surveyId/:choice');

      const { events } = req.body.reduce((acc, curr) => {
        if (curr.event !== 'click' || !curr.email || !curr.url) return acc;

        const { email, url } = curr;
        const match = p.test(new URL(url).pathname);

        if (!match) return acc;

        // Track encountered email & survey ID combos and exclude any 
        // duplicates that are encountered. (Using separate object
        // for constant time lookup.)
        const emailWithSurveyId = email + match.surveyId;

        if (acc.prev[emailWithSurveyId]) return acc;

        return {
          prev: { ...acc.prev, emailWithSurveyId },
          events: [
            ...acc.events, 
            { email, surveyId: match.surveyId, choice: match.choice }
          ]
        }
      }, { prev: {}, events: [] });

      events.forEach(({ surveyId, email, choice }) => {
        Survey.updateOne(
          {
            _id: surveyId,
            recipients: {
              $elemMatch: { email: email, responded: false }
            }
          }, {
            $inc: { [choice]: 1 },
            $set: { 'recipients.$.responded': true },
            lastResponded: new Date()
          }
        ).exec();
      });

      res.send({});
    });

    app.post('/api/surveys', requireLogin, requireCredits, (req, res) => {
        const { title, subject, body, recipients } = req.body;

        const survey = new Survey({
            title,
            subject,
            body, 
            recipients: recipients.split(',').map(email => ({ email: email.trim() })),
            _user: req.user.id,
            dateSent: Date.now()
        });

        // Send email and update user credits
        const mailer = new Mailer(survey, surveyTemplate(survey));
        mailer.send()
          .then(() => survey.save())
          .then(() => {
            req.user.credits -= 1;
            return req.user.save();
          })
          .then(user => res.send(user))
          .catch(err => {
            console.log(err);
            res.status(422).send(err);
          });
    });
}