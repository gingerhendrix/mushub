
Utils.namespace("NowPlaying.data", { 
  NowPlayingDatasource : function (recentTracksDatasource){
    this.makeProp("album");
    this.makeProp("track");
    this.makeProp("artist");
    this.makeProp("artist_mbid");
    
    this.onUpdate = function(recent_tracks){
      var now_playing = recent_tracks[0];
      this.track(now_playing.name);
      this.artist(now_playing.artist);
      this.album(now_playing.album);
      this.artist_mbid(now_playing.artist_mbid);
      MochiKit.Signal.signal(this, "endUpdate");    
    }
     
    recentTracksDatasource.connect("recent_tracks", this, "onUpdate");
    recentTracksDatasource.connect("beginUpdate", this, function(){
       MochiKit.Signal.signal(this, "beginUpdate");    
    });
 }
});

NowPlaying.data.NowPlayingDatasource.prototype = new NowPlaying.utils.DataBean();
