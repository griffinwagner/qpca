
  //load bcrypt
  var bCrypt = require('bcrypt-nodejs');
  var request = require('request');


module.exports = function(passport,user){

  var User = user;
  var LocalStrategy = require('passport-local').Strategy;


  passport.serializeUser(function(user, done) {
          done(null, user.id);
      });


  // used to deserialize the user
  passport.deserializeUser(function(id, done) {
      User.findById(id).then(function(user) {
        if(user){
          done(null, user.get());
        }
        else{
          done(user.errors,null);
        }
      });

  });


  passport.use('local-signup', new LocalStrategy(


    {
      usernameField : 'link',
      passwordField : 'password',
      passReqToCallback : true // allows us to pass back the entire request to the callback
    },

    function(req, link, password, done){


      var sessCode = req.session.code;
      console.log('||||||||||||||||||||||||||||||||||||||||||||||');
      var dash = link.indexOf("-", link.indexOf("-") + 1);
      var numAfterDash = link.substring(dash+1)
      console.log(numAfterDash);
      var parsedNumAfterDash = parseInt(numAfterDash);
      console.log(parsedNumAfterDash);
      console.log(typeof parsedNumAfterDash);
      console.log("Our Code Is " + sessCode);
      var item = link;
      if (item.indexOf('share') == -1 && item.substring(0,30)=='https://www.quora.com/profile/')  {
        if (link == 'https://www.quora.com/profile/'+req.body.firstname+'-'+req.body.lastname+'-'+parsedNumAfterDash && typeof(parsedNumAfterDash)== 'number') {
          request(link, function (error, response, body) {
            console.log('error:', error); // Print the error if one occurred
            console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
            console.log('body:', body); // Print the HTML for the Google homepage.
            var diditwork = body.indexOf(sessCode);
            console.log(diditwork);
            if (diditwork > 1) {
              var sessData = req.session;
              sessData.link = link;
              var generateHash = function(password) {
              return bCrypt.hashSync(password, bCrypt.genSaltSync(8), null);
              };

               User.findOne({where: {link:link}}).then(function(user){

              if(user)
              {
                return done(null, false,req.flash('signupmessage', 'Link taken.') );
              }

              else
              {
                var userPassword = generateHash(password);
                var data =
                { link:link,
                password:userPassword,
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                };


                User.create(data).then(function(newUser,created){
                  if(!newUser){
                    return done(null,false);
                  }

                  if(newUser){
                    return done(null,newUser);

                  }


                });
              }


            });
            }

          });
        } else if (link == 'https://www.quora.com/profile/'+req.body.firstname+'-'+req.body.lastname && numAfterDash== link){
          request(link, function (error, response, body) {
            console.log('error:', error); // Print the error if one occurred
            console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
            console.log('body:', body); // Print the HTML for the Google homepage.
            var diditwork = body.indexOf(sessCode);
            console.log(diditwork);
            if (diditwork > 1) {
              var sessData = req.session;
              sessData.link = link;
              var generateHash = function(password) {
              return bCrypt.hashSync(password, bCrypt.genSaltSync(8), null);
              };

               User.findOne({where: {link:link}}).then(function(user){

              if(user)
              {
                return done(null, false,req.flash('signupmessage', 'Link taken.') );
              }

              else
              {
                var userPassword = generateHash(password);
                var data =
                { link:link,
                password:userPassword,
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                };


                User.create(data).then(function(newUser,created){
                  if(!newUser){
                    return done(null,false);
                  }

                  if(newUser){
                    return done(null,newUser);

                  }


                });
              }


            });
            }

          });

        }

      }








  }



  ));

  //LOCAL SIGNIN
  passport.use('local-signin', new LocalStrategy(

  {

  // by default, local strategy uses username and password, we will override with email
  usernameField : 'link',
  passwordField : 'password',
  passReqToCallback : true // allows us to pass back the entire request to the callback
  },

  function(req, link, password, done) {
    var sessData = req.session;
    sessData.link = link;
    var User = user;

    var isValidPassword = function(userpass,password){
      return bCrypt.compareSync(password, userpass);
    }

    User.findOne({ where : { link: link}}).then(function (user) {

      if (!user) {
        return done(null, false, req.flash('loginMessage', 'No user found.'));
      }

      if (!isValidPassword(user.password,password)) {

        return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));

      }

      var userinfo = user.get();

      return done(null,userinfo);

    }).catch(function(err){

      console.log("Error:",err);

      return done(null, false, { message: 'Something went wrong with your Signin' });


    });

  }
  ));

  }
