
Utils.namespace("NowPlaying.data", { 
  ApplicationDatasource : function(){
        var self = this;
        
        var Data = NowPlaying.data;
        var AS = NowPlaying.data.audioscrobbler;
        var MB = NowPlaying.data.musicbrainz;
        var WP = NowPlaying.data.wikipedia;
        
        this.onError = function(){
          alert("Error!");
        }
        
        
        this.user = new Data.UserDatasource();
        this.user.connect("onError", this, "onError");
  
        this.now_playing_tab = new Data.ArtistTabDatasource();
        this.user.now_playing.connect("endUpdate", 
                                  function(data){ 
                                    if(self.now_playing_tab.artist != data.artist()
                                    || self.now_playing_tab.artist_mbid != data.artist_mbid() ){  
                                     
                                          self.now_playing_tab.artist = data.artist();
                                          self.now_playing_tab.artist_mbid = data.artist_mbid();  
                                          self.now_playing_tab.update();
                                    }
                                  });         

  }
});
