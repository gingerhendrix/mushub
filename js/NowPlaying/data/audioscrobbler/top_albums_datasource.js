Utils.namespace("NowPlaying.data.audioscrobbler", {
  TopAlbumsDatasource : function(artist){
    this.artist = artist;
    
    this.makeProp("top_albums");
    
    this.update = function(){
      var url = NowPlaying.data.Webservice.url("audioscrobbler/top_albums", {artist : this.artist})
      var d = sendJSONPRequest(url, "jsonp");
      d.addCallback(bind(this.onUpdate, this));
      return d
    }

    this.onUpdate = function(response){
      this.top_albums(response);
    }

  }
});

NowPlaying.data.TopAlbumsDatasource.prototype = new NowPlaying.utils.DataBean();
