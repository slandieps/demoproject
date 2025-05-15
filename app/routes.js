console.log('✅ routes.js loaded');

module.exports = function(app, passport, db) {

    // normal routes ===============================================================
    
        // show the home page (will also have our login links)
        app.get('/', function(req, res) {
            console.log('tech baddies trying :3')
            res.render('main.ejs');
        });
    
        // PROFILE SECTION =========================
        app.get('/profile', isLoggedIn, function(req, res) {
            db.collection('posts').find().toArray((err, result) => {
              if (err) return console.log(err)
              res.render('profile.ejs', {
                user : req.user,
                posts: result,
              })
            })
        });
    
        // LOGOUT ==============================
        app.get('/logout', function(req, res) {
            req.logout(() => {
              console.log('User has logged out!')
            });
            res.redirect('/');
        });
    
        // real time video stream no login required
        app.get('/vid', function(req, res) {
            res.render('vid.ejs');
        });
    
        // video stream test route (no login required)
        app.get('/stream-test', function(req, res) {
            res.render('stream-test.ejs');
        });
    
    //theater routes ====================================================================
   app.get('/theater', (req, res) => {
    res.render('theater.ejs', { user: req.user });
        }); 
    
    // message board routes ===============================================================
    
        app.post('/posts', (req, res) => {
          db.collection('posts').save({name: req.body.name, msg: req.body.msg}, (err, result) => {
            if (err) return console.log(err)
            console.log('saved to database')
            res.redirect('/profile')
          })
        })
      

    // AUTH ROUTES REMAIN UNCHANGED BELOW ==============================================
    
        app.get('/login', function(req, res) {
            res.render('login.ejs', { message: req.flash('loginMessage') });
        });
    
        app.post('/login', passport.authenticate('local-login', {
            successRedirect : '/profile',
            failureRedirect : '/login',
            failureFlash : true
        }));
    
        app.get('/signup', function(req, res) {
            res.render('signup.ejs', { message: req.flash('signupMessage') });
        });
    
        app.post('/signup', passport.authenticate('local-signup', {
            successRedirect : '/profile',
            failureRedirect : '/signup',
            failureFlash : true
        }));
    
        app.get('/unlink/local', isLoggedIn, function(req, res) {
            var user = req.user;
            user.local.email = undefined;
            user.local.password = undefined;
            user.save(function(err) {
                res.redirect('/profile');
            });
        });
    };
    
    // route middleware to ensure user is logged in
    function isLoggedIn(req, res, next) {
        if (req.isAuthenticated())
            return next();
    
        res.redirect('/');
    }
    