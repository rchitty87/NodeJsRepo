var unirest = require('unirest');
var express = require('express');
var events = require('events');

var getFromApi = function(endpoint, args) {
    var emitter = new events.EventEmitter();
    unirest.get('https://api.spotify.com/v1/' + endpoint)
           .qs(args)
           .end(function(response) {
                if (response.ok) {
                    emitter.emit('end', response.body);
                }
                else {
                    emitter.emit('error', response.code);
                }
            });
    return emitter;
};

var getRelatedFromApi = function(endpoint) {
    var emitter = new events.EventEmitter();
    unirest.get('https://api.spotify.com/v1/artists/' + endpoint + '/related-artists')
           .end(function(response){
              if(response.ok) {
                emitter.emit('end', response.body);
              }
              else{
                emitter.emit('error', response.code);
              }
           });
    return emitter;
};

var getTopTracksFromApi = function(endpoint, args){
    var emitter = new events.EventEmitter();
    unirest.get('https://api.spotify.com/v1/artists/' + endpoint + '/top-tracks')
           .qs(args)
           .end(function(response){
             if(response.ok) {
               emitter.emit('end', response.body);
             }
             else {
               emitter.emit('error', response.code);
             }
           });
    return emitter;
}

var app = express();
app.use(express.static('public'));

app.get('/search/:name', function(req, res) {
    var searchReq = getFromApi('search', {
        q: req.params.name,
        limit: 1,
        type: 'artist'
    });

    searchReq.on('end', function(item) {
        var artist = item.artists.items[0];
        var artistID = artist.id;

        var relatedReq = getRelatedFromApi(artistID)
            .on('end', function(relatedItems){
                var completed = 0;

                var checkCompleted = function() {
                   if(completed === relatedItems.artists.length) {
                     artist.related = relatedItems.artists;
                     res.json(artist).sendStatus(200);
                   }
                }

                relatedItems.artists.forEach(function(relatedArtist) {
                  getTopTracksFromApi(relatedArtist.id, {
                    country: 'SG'
                  }).on('end', function(topTracks) {
                    relatedArtist.tracks = topTracks.tracks;
                    completed += 1;
                    checkCompleted();
                  }).on('error', function(){
                    console.log('Could not find top tracks for ' + relatedArtist.name);
                  })
                });
            })
            .on('error', function(code){
                res.sendStatus(404);
            });
    });

    searchReq.on('error', function(code) {
        res.sendStatus(code);
    });
});

app.listen(8080);
