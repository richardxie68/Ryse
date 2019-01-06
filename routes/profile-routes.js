const router = require('express').Router();
const url = require('url');
const bodyParser = require('body-parser');
const Seeker = require('../model/user-seeker.model');


router.use(bodyParser.json());
var urlencodedParser = bodyParser.urlencoded({ extended: false });

router.get('/', ensureAuthenticated, (req, res) => {
    if (req.user.type === 'seeker') {
        res.render('seeker-profile', {
            first: req.user.first,
            last: req.user.last,
            location: req.user.location,
            phone: req.user.phone,
            email: req.user.email,
            skills: req.user.skills,
            q1: req.user.q1,
            q2: req.user.q2,
            q3: req.user.q3,
            q4: req.user.q4,
            q5: req.user.q5,
            q6: req.user.q6,
            q7: req.user.q7,
            q8: req.user.q8,
            q9: req.user.q9,
            q10: req.user.q10
        });
    } else if (req.user.type === 'recruiter') {
        res.render('recruiter-profile', {
            first: req.user.first,
            last: req.user.last,
            location: req.user.location,
            company: req.user.company,
            email: req.user.email,
            website: req.user.website,
            about: req.user.about,
            positions: req.user.positions,
            req: req.user.req,
            res: req.user.res
        });
    } else if(req.user.type === 'endorser') {
        res.render('endorser-profile', {
            first: req.user.first,
            last: req.user.last,
            organization: req.user.organization,
            about: req.user.about,
            email: req.user.email,
            location: req.user.location,
            position: req.user.position
        });
    }
});

router.get('/:username', (req, res) => {
    Seeker.findOne({'username': req.params.username}, (err, user) => {
        if(err) {
            console.log('error',err);
            return 0;
        }
        res.render('seeker-profile', {           
                first: user.first ,
                last: user.last,
                username: user.username,
                location: user.location,
                phone: user.phone,
                email: user.email,
                skills: user.skills,
                q1: user.q1,
                q2: user.q2,
                q3: user.q3,
                q4: user.q4,
                q5: user.q5,
                q6: user.q6,
                q7: user.q7,
                q8: user.q8,
                q9: user.q9,
                q10: user.q10
        });
    });
});

router.post('/recruiter/search', [ensureRecruiter, urlencodedParser], (req, res) => {
    res.render('recruiter-search', {
        skills: req.body.skills,
        location: req.body.location
    });
})

router.post('/recruiter/search/username', [ensureRecruiter, urlencodedParser], (req, res) => {
    res.redirect(`/profile/${req.body.username}`);
});

router.post('/endorse', [ensureEndorser, urlencodedParser], (req, res) => {
    console.log(req.user);
    var endorseObject = {
        first: req.user.first,
        last: req.user.last,
        position: req.user.position,
        organization: req.user.organization
    }

    console.log(endorseObject);

    Seeker.findOneAndUpdate({'username': req.body.username}, {$push: {'endorsements': endorseObject }});
    res.send('Endorsement successfully sent.')
});

function ensureEndorser(req, res, next) {
    console.log(req);
    if (req.user.type === 'endorser') {
        return next();
    } else {
        res.render('landing');
    }
}

function ensureRecruiter(req, res, next) {
    if (req.user.type === 'recruiter') {
        return next();
    } else {
        res.render('landing');
    }
}

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        res.render('login', {
            error: "You are not logged in."
        })
    }
}

module.exports = router;