
Utils.namespace("NowPlaying.data.yahoo_music", { 
  VideoDatasource : function(artist){
    Utils.extend(this, new NowPlaying.data.Datasource(
                                       { service : "yahoo_music/videos",
                                         params : [{ name : "artist", prop : "artist" }]
                                       }));                                      
                    
    this.artist = artist;
    this.makeProp("videos");

    this.onUpdate = function(response){
      this.videos(response.videos);
    }

  }
});

