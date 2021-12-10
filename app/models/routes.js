const journal = require('./journal')
const months = ['', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const { ObjectId } = require("mongodb")

module.exports = function (server, passport, db) {

  server.get('/', (req, res) => {
    res.render('index.ejs')
  })

  server.get('/entry', (req, res) => {

    res.render('entry.ejs')
  })

  server.get('/allEntries', async (req, res) => {

    let entries = await db.collection('entries').find({ userId: ObjectId(req.user._id) }).toArray();
    console.log(entries)
    res.render('all-entries.ejs', { entries: entries })

  })

  server.post('/entry', (req, res) => {

    const date = new Date()
    // const month = months[date.getMonth() + 1]
    const entry = {
      userId: req.user._id,
      dateCreated: date,
      day: date.getDate(),
      month: date.getMonth() + 1,
      year: date.getFullYear(),
      title: req.body.title,
      note: req.body.paragraph,
      tag: req.body.tag
    }
    db.collection('entries').insertOne(entry)
    res.redirect('/allEntries')
  })

  server.put('/allEntries', async (req, res) => {

    const { entryId } = req.body
    
    let title = "hehe"
    let note = "hi"
    let tag = "there"

    const editedEntry = {
      title,
      note,
      tag
    }

    const updatedEntry = await db.collection('entries').findOneAndUpdate(
      { _id: ObjectId(entryId) },
      { $set: editedEntry }
    )
      .then(result => {
        res.json('Success')
      })
      .catch(error => console.error(error))


    return res.json(updatedEntry)

  })
  server.delete('/allEntries/:id', async (req, res) => {
    const id = req.params.id;
    console.log(id);
    await db.collection('entries').findOneAndDelete({ userId: ObjectId(id) })
    /*
    , (err, result) => {
      if (err) return res.send(500, err)
      res.send('Message deleted!')
    })
    */
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