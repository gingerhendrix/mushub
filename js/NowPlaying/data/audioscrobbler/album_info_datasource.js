
Utils.namespace("NowPlaying.data.audioscrobbler", { 
  AlbumInfoDatasource : function(artist, album){
    this.artist = artist;
    this.album = album;
    
    Utils.extend(this, new NowPlaying.data.Datasource(
                                       { service : "audioscrobbler/album_info",
                                         params : ["artist", "album" ]
                                       }));    
    
    this.makeProp("album_reach");
    this.makeProp("album_image");
    this.makeProp("album_track_listing");

    this.onUpdate = function(album){
      this.album_reach(album.reach);
      this.album_image(album.image_large);
      this.album_track_listing(album.tracks);
    }
 }
});

