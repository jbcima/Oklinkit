var uristring = process.env.MONGOLAB_URI 
  || process.env.MONGOHQ_URL 
  || 'mongodb://localhost/oklinkit',
  mongoose = require("mongoose");

var assets_dir = "./assets";

mongoose.connect(uristring, function(err, res) {
  if(err) {
    console.log('ERROR connecting to: ' + uristring + '. ' + err);
  } else {
    console.log('Succeeded connected to: ' + uristring);
  }
});

var db = mongoose.connection,
    Catchall, User;

db.on('error', console.error.bind(console, 'connection error'));
db.once('open', function() {

    // User collection
    var UserSchema = mongoose.Schema({
        'user': String,
        'name' : String,
        'password': String
    });

    // Main collection
    var CatchallSchema = mongoose.Schema({
        'request': {
           'author': String,
           'name': String,
           'description': String,
           'date': String,
           'expired': Boolean,
           'willing_to_pay': String
          },
         'responses': [
             {
               'author': String,
               'name': String,
               'body': String,
               'recommend': String
             }
           ],
         'hiree':
             {
               'name': String,
               'rehire': Boolean
             }
    });

  // Instantiate models
  Catchall = mongoose.model('catchall', CatchallSchema);
  User = mongoose.model('user', UserSchema);

});

/*
 * Serve JSON to our AngularJS client
 */

exports.name = function (req, res) {
  res.json({
  	name: 'Bob'
  });
};

exports.addUser = function (req, res) {
    var p = req.body;

    var newUser = new User({
        'user': p.user || "Joe@gmail.com",
        'name': p.name || "Joe Shmoe",
        'password': p.password || "lol"
    });

    newUser.save(function(err) {
        if(err)
          res.send(204, "Add user: failed");
        res.json(200);
    });
}

exports.getAllUsers = function (req, res) {
    var user = new User();
    user.user = "Jacqueline@gmail.com";
    user.name = "Jackqueline Ho";
    user.password = "lol";
    user.save();
    User.find(function (err, kittens) {
      if (err) // TODO handle err
        console.log(err);
      console.log(kittens)
    })
}

exports.addRequest = function(req, res) {
    var p = req.body;
    var newCatchall = new Catchall({
        'request': {
           'author': p.author || "Bo@gmail.com",
           'name': p.name || "Bo Lau",
           'description': p.description || "I'm looking for an interior designer to redesign my apartment",
           'date': p.date || "20130715",
           'expired': p.expired || false,
           'willing_to_pay': p.willing_to_pay || false,
        },
         'responses': [],
         'hiree': {}
    });

    newCatchall.save(function(err) {
        if(err)
          res.send(204, "Add request: failed");
        res.json(200);
      });
}

exports.getAllRequests = function(req, res) {
   Catchall.find(null, "request", function (err, kittens) {
     if (err) // TODO handle err
       console.log(err);
     console.log(kittens)
   });
}

// Get all requests I made
exports.getAllUserRequests = function(req, res) {
    var p = req.body;
    var author = p.author || "Joe@gmail.com"
    Catchall.find({'request.author' : author}, "request", function (err, kittens) {
      if (err) // TODO handle err
        console.log(err);
      console.log(kittens)
    });
}

exports.getAllUserResponses = function(req, res) {
    var p = req.body;
    var author = p.author || "Bo@gmail.com"
    Catchall.find({'request.author' : author}, "responses", function (err, kittens) {
      if (err) // TODO handle err
        console.log(err);
      console.log(kittens)
    });
}

// Get all requests where I'm recommended
exports.getAllRequestsWithMe = function(req, res) {
    var p = req.body;
    var author = p.author || "Joe@gmail.com";
    Catchall.find(
        {
        'responses.recommend' : {
          $regex : author,
          $options: 'i'
         }
        }, "request", function (err, kittens) {
      if (err) // TODO handle err
        console.log(err);
      res.json(kittens);
      //console.log(kittens)
    });
    // find all the requests that have me in the recommendation
}

exports.addResponse = function(req, res) {
    var p = req.body;
    var reqId = req.param('reqId') || '51ebf7af6934b61732000002';
    // comma separated list
    var recommendList = req.param('recommended') || "Joe@gmail.com";
    var newResponse = {
        'author' : p.author || "janebrucelee@gmail.com",
        'name' : p.name || "Jane Lee",
        'body' : p.body || "Yo I'll solve it ok? geez",
        'recommend': recommendList
    }

    // Update call
    Catchall.findByIdAndUpdate(
        reqId,
        { $push: { responses: newResponse } },
        { upsert: false },
        function(err){
            if(err)
                console.log("Failed to add response " + err);
            console.log("Yay, added response");
        }
    );

}

exports.getAllResponses = function(req, res) {
    var requestId = req.param('reqId') || '51eb95fa4c896b32803e4c44';
    // Search all the responses for specific id
    if(requestId) {
        Catchall.findById(requestId, function (err, responses) {
            if(!err) {
                console.log(responses);
            }
        });
    }
}
