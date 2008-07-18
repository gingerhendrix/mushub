Utils.namespace("NowPlaying.ui.tabs", {
  ArtistTab : Ext.extend(Ext.Panel, {
      title : "Now Playing",
      layout : 'column',
      active: true,
      autoScroll : true,
      deferredRender : false,
      initComponent : function(){
       var UI = NowPlaying.ui;
       var Panels = UI.panels;
       var Tabs = UI.tabs;
       var Data = NowPlaying.data;
       
       var top_albums = new Panels.TopAlbumsPanel({datasource : this.datasource.top_albums });
       var similar_artists = new Panels.SimilarArtistsPanel({datasource : this.datasource.similar_artists});
       //var album_info = new UI.AlbumInfoPanel($("album_info"), new Data.AlbumInfoDatasource(this.datasource.now_playing, this.datasource.album_info));
       //var artist_info = new UI.ArtistInfoPanel($("artist_info"), this.datasource.artist_info);

       var artistInfoPanel = new Ext.Panel({
          border: false,
          baseCls: '',
          width: 640,
        	items : [//artist_info.panel,
        	         top_albums,
        	         similar_artists
        	        ]
        });
        
        this.items = [artistInfoPanel];
        Tabs.ArtistTab.superclass.initComponent.apply(this, arguments);
      }
  })
});
