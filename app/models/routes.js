const journal = require('./journal')
const {getUnsplashPhoto } = require("./services");
const months = ['', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const { ObjectId } = require("mongodb")


module.exports = function (server, passport, db, multer, multerS3, s3, aws) {

  server.get('/', (req, res) => {
    res.render('index.ejs')
  })

  server.get('/entry', isLoggedIn, (req,res) => {
    // db.collection('entries').find({email: req.user.local.email}).toArray()
    res.render('entry.ejs')
  })

  server.get('/allEntries', isLoggedIn, async (req,res) => {

    let tag = req.query.tag
    if(tag === undefined || tag == 'All'){
      let entries = await db.collection('entries').find({userId : ObjectId(req.user._id)}).sort({"dateCreated": -1}).toArray();
      res.render('all-entries.ejs', {entries: entries})
    } else {    // handles filter by tag
      let entries = await db.collection('entries').find({userId : ObjectId(req.user._id), tag: tag}).toArray();
      res.render('all-entries.ejs', {entries: entries})
    }
  })

  server.post('/filteredEntries', isLoggedIn, async (req,res) => {
    
    let entries = await db.collection('entries').find({month: Number(req.body.month), year: Number(req.body.year)}).toArray();

   
    res.render('all-entries.ejs', {entries: entries})

  })

  //Multer s3 handling image upload
  aws.config.region = 'us-east-2';
  var uploadS3 = multer({
    storage: multerS3({
      s3: s3,
      bucket: 'day-book',
      acl: 'public-read',
      metadata: function(req, file, cb) {
        cb(null, {
          fieldName: file.fieldname
        });
      },
      key: function(req, file, cb) {
        cb(null, Date.now().toString() + '.png')
      }
    })
  })

// var cpUpload = uploadS3.fields([{name: 'image', maxCount: 1}])
// uploadS3.single('image')
server.post('/entry', uploadS3.single('image'), async (req, res) => {
 
  const tag = req.body.tag
  const image = !req.file ? await getUnsplashPhoto(tag) : req.file.location
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
      image: image,
      tag: tag
    }
    db.collection('entries').insertOne(entry)
    res.redirect('/allEntries')
  })

  server.post('/allEntries', (req, res) => {

    const { entryId, title, note, tag } = req.body
    
    const editedEntry = {
      title,
      note,
      tag
    }


  db.collection('entries').findOneAndUpdate(
      { _id: ObjectId(entryId) },
      { $set: editedEntry }
    )
      .then(result => {
        res.redirect('/allEntries')
      })
      .catch(error => console.error(error))

  })

  //testing for edit --sushma
server.get('/allEntries/:id', isLoggedIn, async(req, res)=>{
  let entry = await db.collection('entries').find({_id : ObjectId(req.params.id)}).toArray();
  res.render('edit.ejs', {entry: entry})

})


  server.delete('/allEntries', (req,res) => {
    const id = req.body.entryId;

    db.collection('entries').findOneAndDelete({_id : ObjectId(id)}, (err, result) => {
      if (err) return res.send(500, err)

      res.send('Message deleted!')
    })
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

  // logout
server.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

}

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated())
      return next();

  res.redirect('/');
}