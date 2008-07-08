Utils.namespace("NowPlaying.data.audioscrobbler", {
  TopAlbumsDatasource : function(artist){
    this.artist = artist;
    Utils.extend(this, new NowPlaying.data.Datasource(
                                       { service : "audioscrobbler/top_albums",
                                         params : ["artist"]
                                       }));  
 
    this.makeProp("top_albums");
   
    this.onUpdate = function(response){
      this.top_albums(response.top_albums);
    }

  }
});

