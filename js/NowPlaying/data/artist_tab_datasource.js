
Utils.namespace("NowPlaying.data", { 
  ArtistTabDatasource : function(artist, artist_mbid){
     Utils.extend(this, new NowPlaying.utils.DataBean());
     
     this.artist = artist;
     this.artist_mbid = artist_mbid;

     var Data = NowPlaying.data;
     var AS = NowPlaying.data.audioscrobbler;
     var MB = NowPlaying.data.musicbrainz;

     this.top_albums = new AS.TopAlbumsDatasource();
     this.similar_artists = new AS.SimilarArtistsDatasource();
     this.artist_info =  new Data.ArtistInfoDatasource();
     this.artist_links = new MB.ArtistUrlsDatasource();
     this.artist_members =  new MB.ArtistMembersDatasource();
     
     this.update = function(){

       this.top_albums.artist = this.artist; 
       this.top_albums.update(); 
       this.similar_artists.artist = this.artist; 
       this.similar_artists.update(); 
       this.artist_links.artist_mbid = this.artist_mbid;
       this.artist_links.update();
       this.artist_info.artist_mbid = this.artist_mbid;
       this.artist_info.update();
       this.artist_members.artist_mbid = this.artist_mbid;
       this.artist_members.update();
       
       MochiKit.Signal.signal(this, "endUpdate", this);             
     }   
  }
});
