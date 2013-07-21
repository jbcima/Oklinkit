
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index');
};

exports.can = function(req, res){
  res.render('can');
};


exports.partials = function (req, res) {
  var name = req.params.name;
  res.render('partials/' + name);
};