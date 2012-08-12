
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , util = require('./util')
  , http = require('http')
  , path = require('path')
  , fs = require('fs')
  , wrench = require('wrench')
  , _ = require('underscore')

  , app = express()
  , database = {}
  , uploads_dir = path.join(__dirname, 'uploads');

/**
 * Configuration
 */


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
});










app.get('/', routes.index);

app.post('/upload', function (req, res) {
  
  var complete = util.parallel();

  complete.file_ids = {};
  complete.callback = function(){
    res.send( JSON.stringify(this.file_ids) );
    
  };
  console.log(req.files);
  _(req.files).each(complete(function(file, name){
    var file_id = _.uniqueId();
    // store file in DB
    database[file_id] = {
      name: name
    , type: file.type
    };

    complete.file_ids[name] = file_id;

    // move file
    fs.rename(file.path, uploads_dir + '/' + file_id );
    console.log('Saved ' + name + ' to: uploads/'+file_id);
  }));

});


wrench.rmdirSyncRecursive(uploads_dir, true);
fs.mkdirSync(uploads_dir);


http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
