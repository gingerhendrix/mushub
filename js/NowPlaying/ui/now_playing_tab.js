Utils.namespace("NowPlaying.ui", {
  NowPlayingTab : Ext.extend(Ext.Panel, {
      title : "Now Playing",
      layout : 'column',
      active: true,
      autoScroll : true,
      initComponent : function(){
       var UI = NowPlaying.ui;
       var Data = NowPlaying.data;
       
       var top_albums = new UI.TopAlbumsPanel($("top_albums_list"), this.datasource.top_albums);
       var similar_artists = new UI.SimilarArtistsPanel($("similar_artists_list"), this.datasource.similar_artists);
       var album_info = new UI.AlbumInfoPanel($("album_info"), new Data.AlbumInfoDatasource(this.datasource.now_playing, this.datasource.album_info));
       var artist_info = new UI.ArtistInfoPanel($("artist_info"), 
                                              new Data.ArtistInfoDatasource(this.datasource.now_playing,  
                                                                            new Data.musicbrainz.ArtistUrlsDatasource(),
                                                                            new Data.wikipedia.WikipediaDatasource()));
       var artistInfoPanel = new Ext.Panel({
          border: false,
          baseCls: '',
          width: 640,
        	items : [artist_info.panel,
        	         top_albums.panel,
        	         similar_artists.panel]
        });
        
        this.items = [artistInfoPanel, album_info.panel];
        UI.NowPlayingTab.superclass.initComponent.apply(this, arguments);
      }
  })
});
