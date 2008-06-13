
Utils.namespace("NowPlaying.data.musicbrainz", { 
  ArtistUrlsDatasource : function(artist_mbid){
    Utils.extend(this, new NowPlaying.data.Datasource(
                                       { service : "musicbrainz/artist_urls",
                                         params : [{ name : "artist_mbid", prop : "artist_mbid" }]
                                       }));                                      
                    
    this.artist_mbid = artist_mbid;
    this.makeProp("artist_urls");

    this.onUpdate = function(response){
      this.artist_urls(response.urls);
    }

  }
});

