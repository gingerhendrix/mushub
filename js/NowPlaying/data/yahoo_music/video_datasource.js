
Utils.namespace("NowPlaying.data.yahoo_music", { 
  VideoDatasource : function(id){
    Utils.extend(this, new NowPlaying.data.Datasource(
                                       { service : "yahoo_music/video",
                                         params : [{ name : "id", prop : "id" }]
                                       }));                                      
                    
    this.id = id;
    this.makeProp("video");

    this.onUpdate = function(response){
      this.video(response);
    }

  }
});

