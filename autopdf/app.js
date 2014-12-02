
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , path = require('path')
  , config = require('./config')
  , index = require('./routes/index')
  , passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy
  , ensureLoggedIn = require('./node_modules/connect-ensure-login/lib/ensureLoggedIn');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || config.port);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.cookieParser());
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.session({secret:'PDF BOT 9k54 VERSION 1'}))
  //passport
  app.use(passport.initialize());
  app.use(passport.session());
  //
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

var users = [{id: 1, username: 'user', password: 'password'}]

function findUser(username, done) {
  for(var i = 0; i<users.length;i++) {
    var user = users[i]
    if(user.username === username) {
      return done(null, user)
    }
  }
  return done(null, null)
}

function findID(id, done) {
  var idx = id-1
  if(users[idx]) {
    done(null, users[idx])
  }
  else {done(new Error("don't exist"))}
}

passport.serializeUser(function(user, done) {
  done(null, user.id)
})
passport.deserializeUser(function(id, done) {
  findID(id, function(err, user) {
    done(err, user)
  })
})

passport.use(new LocalStrategy(
  function(username, password, done) {
    findUser(username, function(err, user) {
      if(err) {return done(err)}
      if(!user) {return done(null, false, {message:"looks like you're not supposed to be here"})}
      if(user.password != password) {return done(null, false, {message: "nah sorry"})}
      return done(null, user)
    })
  }))

app.get('/', index.index);
app.get('/login', index.loginPage);
app.get('/companyList', ensureLoggedIn('/login'), index.companyList)
app.get('/:company', ensureLoggedIn('/login'), index.getPdfList);
app.post('/newOrg', index.newOrg);
app.post('/uploadPdf/:company', index.upload);
app.post('/loginAuth', passport.authenticate('local', {successReturnToOrRedirect:'/companyList'}), index.loginPost)

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
