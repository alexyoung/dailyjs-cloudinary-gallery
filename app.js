
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , cloudinary = require('cloudinary')
  , fs = require('fs')
  , crypto = require('crypto')
  ;

var app = express();

app.locals.title = "Alex's Awesome Gallery";

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
  cloudinary.config({ cloud_name: 'YOURS', api_key: 'YOURS', api_secret: 'YOURS' });
});

app.locals.api_key = cloudinary.config().api_key;
app.locals.cloud_name = cloudinary.config().cloud_name;

app.get('/', function(req, res, next){
  cloudinary.api.resources(function(items){
    res.render('index', { images: items.resources, cloudinary: cloudinary });
  });
});

app.post('/upload', function(req, res){
  var imageStream = fs.createReadStream(req.files.image.path, { encoding: 'binary' })
    , cloudStream = cloudinary.uploader.upload_stream(function() { res.redirect('/'); });

  imageStream.on('data', cloudStream.write).on('end', cloudStream.end);
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port', app.get('port'));
});
