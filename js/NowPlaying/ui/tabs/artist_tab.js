Utils.namespace("NowPlaying.ui.tabs", {
  ArtistTab : Ext.extend(Ext.Panel, {
      title : "Artist Info",
      autoWidth : false,
      width: 960,
      active: true,
      autoScroll : true,
      deferredRender : false,
      closable : true,
      initComponent : function(){
       var UI = NowPlaying.ui;
       var Panels = UI.panels;
       var Tabs = UI.tabs;
       var Data = NowPlaying.data;
       
       var top_albums = new Panels.TopAlbumsPanel({datasource : this.datasource.top_albums });
       var similar_artists = new Panels.SimilarArtistsPanel({datasource : this.datasource.similar_artists});
       //var album_info = new UI.AlbumInfoPanel($("album_info"), new Data.AlbumInfoDatasource(this.datasource.now_playing, this.datasource.album_info));
       var artist_info = new Panels.ArtistInfoPanel({datasource : this.datasource.artist_info});
       var artist_links = new Panels.ArtistLinksPanel({datasource : { musicbrainz : this.datasource.artist_links, torrents : this.datasource}});
       var artist_members = new Panels.ArtistMembersPanel({datasource : this.datasource.artist_members});
       var artist_videos = new Panels.YahooVideoPanel({datasource : this.datasource.videos});
       
       var artistInfoPanel = new Ext.Panel({
          border: false,
         	autoScroll: true,
         	layout : "column",
        	items : [{ border: false, width: 660, items : [ artist_info, artist_videos, similar_artists ] },
        	         { border: false, width: 170, items : [ top_albums] },
        	         { border: false, width: 170, items : [ artist_links, artist_members] },
        	         
        	        ]
        });
        
        this.items = [artistInfoPanel];
        Tabs.ArtistTab.superclass.initComponent.apply(this, arguments);
      }
  })
});
