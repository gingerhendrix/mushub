Utils.namespace("NowPlaying.data.audioscrobbler", {
  TopAlbumsDatasource : function(artist){
    this.artist = artist;
    Utils.extend(this, new NowPlaying.data.Datasource(
                                       { service : "audioscrobbler/top_albums",
                                         params : ["artist"]
                                       }));  
 
    this.makeProp("top_albums");
   
    this.onUpdate = function(response){
      //alert("TopAlbums : " + this.artist + ".onUpdate " + response);
      this.top_albums(response.top_albums);
    }
    
    this.toString = function(){
      return "TopAlbumsDatasource[" + this.artist + "]";
    }

  }
});

