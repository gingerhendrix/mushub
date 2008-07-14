Utils.namespace("NowPlaying.ui", {
  ApplicationUI : function(datasource){
    this.datasource = datasource;
    
     var UI = NowPlaying.ui;
     var Data = NowPlaying.data;
     var appUI = Utils.namespace("NowPlaying.Application.ui");
     var appData = NowPlaying.Application.data;
        
     this.now_playing = new UI.NowPlayingPanel($("now_playing"), datasource.now_playing);        
     this.top_albums = new UI.TopAlbumsPanel($("top_albums_list"), datasource.top_albums);
     this.similar_artists = new UI.SimilarArtistsPanel($("similar_artists_list"), datasource.similar_artists);
     this.album_info = new UI.AlbumInfoPanel($("album_info"), new Data.AlbumInfoDatasource(datasource.now_playing, datasource.album_info));
     this.artist_info = new UI.ArtistInfoPanel($("artist_info"), 
                                              new Data.ArtistInfoDatasource(datasource.now_playing,  
                                                                            new Data.musicbrainz.ArtistUrlsDatasource(),
                                                                            new Data.wikipedia.WikipediaDatasource()));
  
  }
});
