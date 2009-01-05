Utils.namespace("NowPlaying.ui", {
  ApplicationUI : function(datasource){
    var self = this;
    this.datasource = datasource;
    
    var UI = NowPlaying.ui;
    var Panels = UI.panels;
    var Tabs = UI.tabs;
    var Windows = UI.windows;
    
    var Data = NowPlaying.data;
    var appUI = Utils.namespace("NowPlaying.Application.ui");
    var appData = NowPlaying.Application.data;

    this.userPanel = new Panels.UserPanel({datasource : this.datasource.user});        
    this.searchPanel = new Panels.SearchPanel();
    
    this.nowPlayingTab = new Tabs.ArtistTab({title : "Now Playing", 
                                       datasource : this.datasource.now_playing_tab,
                                       closable : false })
    
    this.tabPanel = new Ext.TabPanel({
          region : 'center',
          margins: '20 20 0 20',
          activeTab : 0,
          deferredRender : false,
          items : [ new Tabs.HomeTab(),
                    this.nowPlayingTab,
                  ]
    });
    
    if(!this.datasource.user.username()){
      this.nowPlayingTab.disable();
      
      this.datasource.user.connect("username", function(){
         self.nowPlayingTab.enable();     
      })
    }
    
    this.viewport = new Ext.Viewport({
               layout : 'border',
               items:  [new Ext.Panel({
                           layout: 'border',
                           region : 'center',
                           items: [ { region : 'north', height: 140, baseCls : '', type : "Ext.Panel", items : [this.searchPanel, this.userPanel] },
                                    this.tabPanel
                                  ]
                         })
                      ]
    });
    
    this.openArtistTab = function(artist_name, artist_mbid){
      var datasource = new Data.ArtistTabDatasource(artist_name, artist_mbid);
      console.log("datasource: %o", datasource);
      var tab = new Tabs.ArtistTab({title: artist_name, datasource : datasource });
      this.tabPanel.add(tab);
      this.tabPanel.activate(tab);
      this.tabPanel.doLayout();
      datasource.update();
    }
    
    this.openAlbumWindow = function(artist, album, mbid){
      var datasource = new Data.audioscrobbler.AlbumInfoDatasource(artist, album);
      var window = new Windows.AlbumInfoWindow({title : album, datasource : datasource, modal : false});
      //this.tabPanel.getActiveTab().add(window);
      datasource.update();
      window.show();
    }
    
    this.openRecentTracksWindow = function(){
      var datasource = this.datasource.user.recent_tracks;
      var window = new Windows.RecentTracksWindow({datasource: datasource});
      window.show();
    }
  }
});
