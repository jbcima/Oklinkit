
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index');
};

exports.nameofroute = function(req, res){
  res.render('nameofroute.html');
};


exports.partials = function (req, res) {
  var name = req.params.name;
  res.render('partials/' + name);
};