
Utils.namespace("NowPlaying.data", { 
  ApplicationDatasource : function(username){
        var self = this;
        
        var Data = NowPlaying.data;
        var AS = NowPlaying.data.audioscrobbler;
        var MB = NowPlaying.data.musicbrainz;
        var WP = NowPlaying.data.wikipedia;
        var updateTimer;
        
        this.recent_tracks = new AS.RecentTracksDatasource(username);
        if(updateTimer){
          window.clearInterval(updateTimer);
        }
        updateTimer = window.setInterval(function(){
          self.recent_tracks.update();
        }, 30000);
        
        this.user_info = new Data.UserInfoDatasource(username);
        
        this.now_playing = new Data.NowPlayingDatasource(this.recent_tracks, this.user_info);
        
        this.now_playing_tab = new Data.ArtistTabDatasource();
        this.now_playing.connect("endUpdate", function(data){ 
                                                              self.now_playing_tab.artist = data.artist();
                                                              self.now_playing_tab.artist_mbid = data.artist_mbid();  
                                                              self.now_playing_tab.update();
                                                            });         
        
  }
});
