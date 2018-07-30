const session = require('express-session');
const express = require('express');

module.exports = function(app, db, passport) {
  // reading data
  app.get('/', isLoggedIn, function(req, res) {
    console.log('we reading');
    console.log(req.user);
    let sql = 'SELECT * FROM users WHERE link = "'+ req.user.link+'";';
    db.query(sql, (err, results) => {
      if (err) throw err;
      // console.log(results);
      res.render('todo', {userData: results, user:req.user} );
    });
    var sessData = req.session;

    console.log(sessData.link);
  });

  // display sign up

  app.get('/signup', function (req, res) {
    var part1 = Math.random().toString(36).substring(7);
    var part2 = Math.random().toString(36).substring(7);
    var part3 = Math.random().toString(36).substring(3);
    var total = part1 + part2 + part3;
    var sessData = req.session;
    sessData.code =  total;
    console.log(total);
    res.render('createAccount', {message: req.flash('signupmessage'), secretcode: total});
    return total;
  });
// handling signup form
  app.post('/signup', passport.authenticate('local-signup',  {
     successRedirect: '/',
     failureRedirect: '/signup'}
   )
  );

  //displaying sign in
  app.get('/signin', function(req,res){

	   res.render('signin',  {message: req.flash('signinMessage')});

   });

   // halding sign in form

   app.post('/signin', passport.authenticate('local-signin',  {
      successRedirect: '/',
      failureRedirect: '/signin'}
     )
   );
   //destroy sessopm
   app.get('/logout',function(req,res){

        req.session.destroy(function(err) {
        res.redirect('/signin');
        });

      });

      // Math and Physics Voting (MP)
      app.post('/mpvote', isLoggedIn, function(req, res) {
        console.log("+++++++++++++++++++++++++++++++++++++++++++++++++++++");
        var sessData = req.session;

        console.log(sessData.link);
        console.log(req.body.vote);
        let sql = `UPDATE users SET MPvote = '` + req.body.vote +`' WHERE link ='` + sessData.link +`';`;
        console.log(sql);
        db.query(sql, (err, result)=> {
          console.log(result);
        })
        let sql2 = 'SELECT * FROM users WHERE link ="'+sessData.link + '";';
        db.query(sql2, (err, result)=> {
          console.log(result);
          res.render('todo', {user:{link:sessData.link}, userData:result})
        })
      })

      // Chem and Bio Voting (CB)
      app.post('/cbvote', isLoggedIn, function(req, res) {
        console.log("+++++++++++++++++++++++++++++++++++++++++++++++++++++");
        var sessData = req.session;

        console.log(sessData.link);
        console.log(req.body.vote);
        let sql = `UPDATE users SET CBvote = '` + req.body.vote +`' WHERE link ='` + sessData.link +`';`;
        console.log(sql);
        db.query(sql, (err, result)=> {
          console.log(result);
        })
        let sql2 = 'SELECT * FROM users WHERE link ="'+sessData.link + '";';
        db.query(sql2, (err, result)=> {
          console.log(result);
          res.render('todo', {user:{link:sessData.link}, userData:result})
        })
      })

      // IT voting (IT)
      app.post('/itvote', isLoggedIn, function(req, res) {
        console.log("+++++++++++++++++++++++++++++++++++++++++++++++++++++");
        var sessData = req.session;

        console.log(sessData.link);
        console.log(req.body.vote);
        let sql = `UPDATE users SET ITvote = '` + req.body.vote +`' WHERE link ='` + sessData.link +`';`;
        console.log(sql);
        db.query(sql, (err, result)=> {
          console.log(result);
        })
        let sql2 = 'SELECT * FROM users WHERE link ="'+sessData.link + '";';
        db.query(sql2, (err, result)=> {
          console.log(result);
          res.render('todo', {user:{link:sessData.link}, userData:result})
        })
      })

      app.get('/admin', function (req, res) {

          res.render('admin')

      })

      app.get('/vote/:category', function (req, res) {
        console.log('We checking');
        console.log(req.params.category);
        let sql = `SELECT DISTINCT ${req.params.category} as title, count(${req.params.category}) AS count FROM users GROUP BY ${req.params.category} HAVING COUNT >= 1;`;
        db.query(sql, (err, result)=> {
          console.log(result);
          res.render('categoryStats', {vote:result})
        })
      })











};

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/signin');
}
