
Utils.namespace("NowPlaying.data.musicbrainz", { 
  ArtistUrlsDatasource : function(artist_mbid){
    this.artist_mbid = artist_mbid;
    
    this.makeProp("artist_urls");
    
    this.update = function(){
      if(this.artist_mbid && this.artist_mbid.length > 0){
        var url = NowPlaying.data.Webservice.url("musicbrainz/artist_urls",{artist_mbid : this.artist_mbid});
        var d = sendJSONPRequest(url, "jsonp");
        d.addCallback(bind(this.onUpdate, this));
        return d
      }
    }
    
    this.onUpdate = function(response){
      this.artist_urls(response.urls);
    }

  }
});

NowPlaying.data.musicbrainz.ArtistUrlsDatasource.prototype = new NowPlaying.utils.DataBean();
