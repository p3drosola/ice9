
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'ice9' });
};

exports.test = function(req, res){
  res.render('test', {title: 'JS TEST'});
};