
Utils.namespace("NowPlaying.data.audioscrobbler", { 
  SimilarArtistsDatasource : function(artist){
    this.artist = artist;
    
    this.makeProp("similar_artists");
    
    this.update = function(){
      var url = NowPlaying.data.Webservice.url("audioscrobbler/similar_artists",{artist : this.artist});
      var d = sendJSONPRequest(url, "jsonp");
      d.addCallback(bind(this.onUpdate, this));
      return d
    }

    this.onUpdate = function(response){
      this.similar_artists(response);
    }

  }
});

NowPlaying.data.SimilarArtistsDatasource.prototype = new NowPlaying.utils.DataBean();
