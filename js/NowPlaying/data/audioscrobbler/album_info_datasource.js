
Utils.namespace("NowPlaying.data.audioscrobbler", { 
  AlbumInfoDatasource : function(artist, album){
    this.artist = artist;
    this.album = album;
    
    this.makeProp("album_reach");
    this.makeProp("album_image");
    this.makeProp("album_track_listing");
    
    this.update = function(){
      if(this.artist && this.artist.length > 0 && this.album && this.album.length > 0){
        var url = NowPlaying.data.Webservice.url("audioscrobbler/album_info", {artist : this.artist, album : this.album })
        var d = MochiKit.Async.sendJSONPRequest(url, "jsonp");
        d.addCallback(bind(this.onUpdate, this));
        return d
      }
    }

    this.onUpdate = function(album){
      this.album_reach(album.reach);
      this.album_image(album.image_small);
      this.album_track_listing(album.tracks);
    }
 }
});

NowPlaying.data.audioscrobbler.AlbumInfoDatasource.prototype = new NowPlaying.utils.DataBean();
