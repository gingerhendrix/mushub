
Utils.namespace("NowPlaying.data.audioscrobbler", { 
  RecentTracksDatasource : function (username){
    this.username = username;
    Utils.extend(this, new NowPlaying.data.Datasource(
                                       { service : "audioscrobbler/recent_tracks",
                                         params : ["username"]
                                       }));   

    this.makeProp("recent_tracks");
    
    
    this.onUpdate = function(response){

      this.recent_tracks(response);
      MochiKit.Signal.signal(this, "endUpdate");    
    }
  } 
});

