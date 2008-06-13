
Utils.namespace("NowPlaying.data.audioscrobbler", { 
  SimilarArtistsDatasource : function(artist){
    Utils.extend(this, new NowPlaying.data.Datasource(
                                       { service : "audioscrobbler/similar_artists",
                                         params : ["artist"]
                                       }));   

    this.artist = artist;
    this.makeProp("similar_artists");
    

    this.onUpdate = function(response){
      this.similar_artists(response);
    }

  }
});

NowPlaying.data.SimilarArtistsDatasource.prototype = new NowPlaying.utils.DataBean();
