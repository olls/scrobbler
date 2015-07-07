var Discogs = require('disconnect').Client,
    LastFmNode = require('lastfm').LastFmNode,
    express = require('express'),
    session = require('express-session');

var LASTFM_KEY = 'KEY';
var LASTFM_SECRET = 'SECRET_GOES_HERE';

// function main () {

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

function time_to_ms (time) {
  var parts = time.split(':').reverse();
  return 1000 * (parts[0] + parts[1] * 60);
}

function scrobble_record (id, token, web_session) {
  discog.release(id, function (error, record) {
    if (error) {
      throw error;
    }

    lastfm.session({
      token: token,
      handlers: {
        error: function (error) {
          console.error(error);
        }
      }
    }).on('success', function (lfm_session) {

      var artist = record.artists[0];

      var dt = 0;
      var time = Math.floor(Date.now() / 1000); // In seconds

      web_session.tracklist = record.tracklist;

      record.tracklist.forEach(function (track) {
        setTimeout(function () {
          lastfm.update('nowPlaying', lfm_session, {
            artist: artist,
            track: track.title,
            album: record.title,
            trackNumber: track.position,
            timestamp: time + (dt / 1000)
          });

          web_session.now_playing = track;

          console.log('Set now playing.');
          console.log(web_session.now_playing);
        }, dt);

        dt = dt + time_to_ms(track.duration);

        // setTimeout(function () {
        //   lastfm.request('track.scrobble');
        // }, dt);
      });

    });
  });
}


var discog = new Discogs().database();
var lastfm = new LastFmNode({
  api_key: LASTFM_KEY,
  secret: LASTFM_SECRET
});

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
    if (req.query.id) {
      // Scrobble
      scrobble_record(req.query.id, req.session.lastfm_tok, req.session);

    }
    console.log(req.session.now_playing);
    res.render('index', {scrobbling: req.session.now_playing, tracks: req.session.tracklist});
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
