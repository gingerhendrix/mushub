
Utils.namespace("NowPlaying.data", { 
  ApplicationDatasource : function(username){
        var self = this;
        
        var Data = NowPlaying.data;
        var AS = NowPlaying.data.audioscrobbler;
        var MB = NowPlaying.data.musicbrainz;
        var WP = NowPlaying.data.wikipedia;
        var updateTimer;
        
        this.recent_tracks = new Data.RecentTracksDatasource(username);
        if(updateTimer){
          window.clearInterval(updateTimer);
        }
        updateTimer = window.setInterval(function(){
            self.recent_tracks.update();
        }, 30000);
        
        this.user_info = new Data.UserInfoDatasource(username);
        
        this.now_playing = new Data.NowPlayingDatasource(this.recent_tracks, this.user_info);
        this.album_info = new AS.AlbumInfoDatasource();
        this.top_albums = new AS.TopAlbumsDatasource();
        this.similar_artists = new AS.SimilarArtistsDatasource();
        
        this.now_playing.connect("album", function(album){
                                         self.album_info.artist = self.now_playing.artist(); 
                                         self.album_info.album = self.now_playing.album(); 
                                         self.album_info.update();  
                                    });
        this.now_playing.connect("artist", function(artist){ 
                                        self.top_albums.artist = artist; 
                                        self.top_albums.update(); 
                                        self.similar_artists.artist = artist; 
                                        self.similar_artists.update(); 
                                   });
  
  }
});
