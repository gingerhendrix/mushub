
Utils.namespace("mushub.model.musicbrainz", { 
  ArtistUrlsDatasource : function(artist){
    this.artist_mbid = artist.mbid;
    Utils.extend(this, new Datasource(
                                       { service : "musicbrainz/artist_urls",
                                         params : ["artist_mbid"]
                                       }));                                      
                    
    this.makeProp("artist_urls");

    this.onUpdate = function(response){
      this.artist_urls(response.urls);
    }

  }
});
  
