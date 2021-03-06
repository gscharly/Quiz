var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var methodOverride =  require('method-override');
var session = require('express-session');
var routes = require('./routes/index');
var partials = require('express-partials');

//var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(partials());
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser('Quiz 2015'));
app.use(session());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));


//logout
app.use(function(req,res,next){
    var actual = new Date();
    //console.log(actual);
    if(req.session.user){
        if(req.session.user.tiempo){
        var sesion = new Date(req.session.user.tiempo);
        //console.log( "Sesion: " +sesion);
        var difDate= actual - sesion;
        //console.log(difDate);
        if(difDate>120000){
            delete req.session.user;
            res.redirect("/");
            console.log("Han pasado 2 min");
            next();
            return;
            }
        }
            //req.session.user.tiempo= new Date();
    }
    next();
    
});
//Helpers dinamicos
app.use(function(req,res,next){
   
   //si no existe lo inicializa
   if(!req.session.redir){
        req.session.redir='/';
   }

    //guardar path en session.redir para despues de login
    if(!req.path.match(/\/login|\/logout|\/user/)){
        req.session.redir= req.path;
    }

    if(req.path.match(/\/user\/[0-9]\/favourites/)){
        if(!req.path.match(/favourites\/[0-9]/)){
            req.session.redir=req.path;
        }
        
    }

    //hacer visible req.sesssion en las vistas
    res.locals.session= req.session;
    next();
});



app.use('/', routes);
//app.use('/users', users);

/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err,
            errors: []
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {},
        errors: []
    });
});


module.exports = app;
