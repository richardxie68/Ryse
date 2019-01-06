const router = require('express').Router();
const passport = require('passport');
const bodyParser = require('body-parser');
const Endorser = require('../model/user-endorser.model');
const Seeker = require('../model/user-seeker.model');
const Recruiter = require('../model/user-recruiter.model');
var LocalStrategy = require('passport-local').Strategy;
var mongoose1 = require('../db/mongoose');
const bcrypt = require('bcrypt');

router.use(bodyParser.json());
var urlencodedParser = bodyParser.urlencoded({ extended: false });

router.get('/recruiter', (req, res) => {
    res.render('signup_recruiter');
});

router.get('/seeker', (req, res) => {
    res.render('signup_seeker');
});

router.get('/endorser', (req, res) => {
    res.render('signup_endorser');
});

router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

router.post('/submit/endorser', urlencodedParser, (req, res) => {
    var endorser = new Endorser({
        type: 'endorser',
        first:  req.body.first,
        last: req.body.last,
        location: req.body.location,
        email: req.body.email,
        organization: req.body.organization,
        position: req.body.position,
        about: req.body.about,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm
    });

    console.log(endorser);

    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(endorser.password, salt, (err, hash) => {
            endorser.password = hash;
            endorser.save().then(() => {
                res.render('landing');
            });
        });
    });
});

router.post('/submit/seeker', urlencodedParser, (req, res) => {
    var seeker = new Seeker({
        type: 'seeker',
        username: req.body.username,
        first:  req.body.first,
        last: req.body.last,
        email: req.body.email,
        location: req.body.location,
        phone: req.body.number,
        skills: req.body.skills,
        q1: req.body.q1,
        q2: req.body.q2,
        q3: req.body.q3,
        q4: req.body.q4,
        q5: req.body.q5,
        q6: req.body.q6,
        q7: req.body.q7,
        q8: req.body.q8,
        q9: req.body.q9,
        q10: req.body.q10,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm
    });

    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(seeker.password, salt, (err, hash) => {
            seeker.password = hash;
            seeker.save().then(() => {
                res.render('landing');
            });
        });
    });
});

router.post('/submit/recruiter', urlencodedParser, (req, res) => {
    var recruiter = new Recruiter({
        type: 'recruiter',
        first:  req.body.first,
        last: req.body.last,
        company: req.body.company,
        website: req.body.website,
        location: req.body.location,
        positions: req.body.positions,
        about: req.body.about,
        email: req.body.email,
        req: req.body.requirements,
        res: req.body.responsibilities,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm
    });

    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(recruiter.password, salt, (err, hash) => {
            recruiter.password = hash;
            recruiter.save().then(() => {
                res.render('landing');
            });
        });
    });
}); 


module.exports = router;