var unirest = require('unirest');
var express = require('express');
var events = require('events');

var getFromApi = function(endpoint, args, callback) {
    unirest.get('https://api.spotify.com/v1/' + endpoint)
           .qs(args)
           .end(function(response) {
                if (response.ok) {
                  return callback(null, response.body);
                }
                else {
                  return callback(response.code, null);
                }
            });
};

var getRelatedFromApi = function(endpoint, callback) {
    unirest.get('https://api.spotify.com/v1/artists/' + endpoint + '/related-artists')
           .end(function(response){
              if(response.ok) {
                return callback(null, response.body);
              }
              else{
                return callback(response.code, null);
              }
           });
};

var getTopTracksFromApi = function(endpoint, args, callback) {
    unirest.get('https://api.spotify.com/v1/artists/' + endpoint + '/top-tracks')
           .qs(args)
           .end(function(response){
             if(response.ok) {
               return callback(null, response.body);
             }
             else {
               return callback(response.code, null);
             }
           });
}

var app = express();
app.use(express.static('public'));

app.get('/search/:name', function(req, res) {
    var searchReq = getFromApi('search', {
      q: req.params.name,
      limit: 1,
      type: 'artist'
    }, function(error, item) {
        if(error)
          return res.sendStatus(error);

        var artist = item.artists.items[0];
        var artistID = artist.id;

        var relatedReq = getRelatedFromApi(artistID, function(error, relatedItems) {
          if(error)
            return res.sendStatus(404);

          var completed = 0;

          relatedItems.artists.forEach(function(relatedArtist) {
            getTopTracksFromApi(relatedArtist.id, {
              country: 'SG'
            }, function(error, topTracks) {
              completed += 1;

              if(error){
                console.log('Could not find top tracks for ' + relatedArtist.name);
              }
              else {
                relatedArtist.tracks = topTracks.tracks;
              }

              if(completed == relatedItems.artists.length) {
                artist.related = relatedItems.artists;
                return res.json(artist);
              }
            });
          });
      });
    });
});

app.listen(8080);
