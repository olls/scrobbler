var Discogs = require('disconnect').Client,
    LastFmNode = require('lastfm').LastFmNode,
    express = require('express'),
    session = require('express-session');

var LASTFM_KEY = 'ec9330db68f09f274c24270b4557de07';
var LASTFM_SECRET = '9cddd758938b88e6d31969de833931c3';

// function main () {

//   var discog = new Discogs().database();

//   var lastfm = new LastFmNode({
//     api_key: LASTFM_KEY,
//     secret: LASTFM_SECRET
//   });

//   get_session(lastfm);

//   // discog.release(1024257, function(err, data){

//   //   var request = lastfm.request("album.getInfo", {
//   //     artist: data.artists[0].name,
//   //     album: data.title,
//   //     handlers: {
//   //       success: function(data) {
//   //         console.log("Success: ", data);
//   //       },
//   //       error: function(error) {
//   //         console.log("Error: " + error.message);
//   //       }
//   //     }
//   //   });

//   // });


// }

// function get_session (lastfm, cb) {

//   // Get token

//   lastfm.session({
//     token: token,
//     handlers: {
//       error: function (error) {
//         console.error(error);
//       }
//     }
//   }).on('success', cb);

// }


var app = express();

app.set('view engine', 'jade');

app.use(session({
  secret: 'bannanas',
  resave: false,
  saveUninitialized: true
}));

app.get('/', function (req, res) {
  if (!req.session.lastfm_tok) {
    res.redirect('/login');
  } else {
    res.render('index', { title: 'Hey', message: req.session.lastfm_tok});
  }
})

app.get('/login', function (req, res) {
  res.redirect('http://www.last.fm/api/auth/?api_key=' + LASTFM_KEY + '&cb=http://' + req.hostname + ':' + server.address().port + '/loggedin');
});

app.get('/loggedin', function (req, res) {
  req.session.lastfm_tok = req.query.token;
  res.redirect('/');
});

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});
