
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

  complete.files = [];
  complete.callback = function(){
    res.send( JSON.stringify(this.files) );
    
  };
  console.log(req.files);
  _(req.files).each(complete(function(file, name){
    var file_id = _.uniqueId();
    // store file in DB
    database[file_id] = {
      id: file_id
    , name: name
    , type: file.type
    , raw_url: '/d/'+file_id
    , public_url: '/download/' + file_id
    };

    complete.files.push(database[file_id]);

    // move file
    fs.rename(file.path, uploads_dir +'/' +file_id );
    console.log('Saved ' + name + ' to: '+uploads_dir +'/' +file_id);
  }));

});


app.get('/d/:id', function(req, res){

  var filename = path.join(uploads_dir, req.params.id );

  path.exists(filename, function(exists) {
    if(!exists) {
      console.log("not exists: " + filename);
      res.writeHead(200, {'Content-Type': 'text/plain'});
      res.write('404 Not Found\n');
      res.end();
      return;
    }

    res.writeHead(200, {'Content-Type': database[req.params.id].type});
    var fileStream = fs.createReadStream(filename);
    fileStream.pipe(res);

    });
});


app.get('/download/:id', function(req, res){
  var id = req.params.id;

  if (!database[id]){
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.write('404 Not Found\n');
    res.end();
    return;
  }

  res.render('download', 
  { 
    title: 'ice9',
    file: database[id]
  });

});


wrench.rmdirSyncRecursive(uploads_dir, true);
fs.mkdirSync(uploads_dir);


http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
