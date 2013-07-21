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
        'password': String
    });

    // Main collection
    var CatchallSchema = mongoose.Schema({
        'request': {
           'author': String,
           'description': String,
           'date': String,
           'expired': Boolean,
           'willing_to_pay': String
              },
         'responses': [
             {
               'author': String,
               'body': String,
               'recommend': [String]
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
        'user': p.user || "Michael@gmail.com",
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
    user.user = "Jacqueline";
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
           'author': p.author || "Michael@gmail.com",
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

exports.addResponse = function(req, res) {
    var p = req.body;
    var reqId = req.param('reqId') || '51ebd277441ee9172a000002';
    var recommendList = req.param('recommended') || "Michael@gmail.com, janebrucelee@gmail.com";
    var newResponse = {
        'author' : p.author || "janebrucelee@gmail.com",
        'body' : p.body || "Yo I'll solve it ok? geez",
        'recommend': [recommendList]
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
