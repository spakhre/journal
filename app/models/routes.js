const journal = require('./journal')
const { MongoClient, ObjectId } = require("mongodb")

module.exports = function (server, passport, db) {
  server.get('/entry', (req,res) => {
    // db.collection('entries').find({email: req.user.local.email}).toArray()
    res.render('entry.ejs')
  })

  server.get('/allEntries', async (req,res) => {

    let entries = await db.collection('entries').find({userId : ObjectId(req.user._id)}).toArray();

    res.json(entries)

  })

  server.post('/entry', (req,res) => {

    const entry = {
      userId: req.user._id,
      title: req.body.title,
      note: req.body.paragraph,
      tag: req.body.tag
    }
    db.collection('entries').insertOne(entry)
    res.redirect('/allEntries')
  })

 // =============================================================================
  // AUTHENTICATE (FIRST LOGIN) ==================================================
  // =============================================================================

  // locally --------------------------------
  // LOGIN ===============================
  // show the login form
  server.get('/login', function (req, res) {
    res.render('login.ejs', { message: req.flash('loginMessage') });
  });

  // process the login form
  server.post('/login', passport.authenticate('local-login', {
    successRedirect: '/entry', // redirect to the secure profile section
    failureRedirect: '/login', // redirect back to the signup page if there is an error
    failureFlash: true // allow flash messages
  }));
  
    // SIGNUP =================================
  // show the signup form
  server.get('/signup', function (req, res) {
    res.render('signup.ejs', { message: req.flash('signupMessage') });
  });

  // process the signup form
  server.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/entry', // redirect to the secure profile section
    failureRedirect: '/signup', // redirect back to the signup page if there is an error
    failureFlash: true // allow flash messages

  }))

}