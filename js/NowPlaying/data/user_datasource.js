
Utils.namespace("NowPlaying.data", { 
  UserDatasource : function (){
    Utils.extend(this, new NowPlaying.utils.DataBean());
    var updateTimer = false;
    var self = this;
    
    this.makeProp("username");
    
    this.recent_tracks = new NowPlaying.data.audioscrobbler.RecentTracksDatasource();
    this.user_info = new NowPlaying.data.audioscrobbler.UserInfoDatasource();
    this.now_playing = new NowPlaying.data.NowPlayingDatasource(this.recent_tracks, this.user_info);
       
    this.onError = function(e){
      this.signal("onError", this, e);
    }    

    
    this.user_info.connect("onError", this, "onError");
    this.recent_tracks.connect("onError",  this, "onError" );
    this.now_playing.connect("onError",  this, "onError" );
    
    this.connect("username", this, function(username){
          self.user_info.username = username;
          self.recent_tracks.username = username;
          self.user_info.update();
          self.recent_tracks.update();
          if(updateTimer){  window.clearInterval(updateTimer); }
          updateTimer = window.setInterval(function(){
            self.recent_tracks.update();
          }, 30000);
        });
      
  }
  
        
        
  
});
