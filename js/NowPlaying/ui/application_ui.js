Utils.namespace("NowPlaying.ui", {
  ApplicationUI : function(datasource){
    this.datasource = datasource;
    
    var UI = NowPlaying.ui;
    var Panels = UI.panels;
    var Tabs = UI.tabs;
    var Windows = UI.windows;
    
    var Data = NowPlaying.data;
    var appUI = Utils.namespace("NowPlaying.Application.ui");
    var appData = NowPlaying.Application.data;
     
   /* this.topbar = new Panels.UsernamePanel({
          region:'north',
        	width: 800,
    });  
     */
    this.infoPanel = new Panels.UserInfoPanel({datasource : datasource.now_playing});        
    
    this.searchPanel = new Panels.SearchPanel();
    
  //  var datasource1 = new Data.ArtistTabDatasource("Twisted Sister", "c6122fee-089f-41c4-a34f-e5f7e5607b05");
  //  var datasource2 = new Data.ArtistTabDatasource("The Flower Kings", "0a389268-6fd8-4f8c-ab6e-0dba5ecec66b");
    
    this.tabPanel = new Ext.TabPanel({
          region : 'center',
          margins: '20 20 0 20',
          activeTab : 0,
          deferredRender : false,
          //plugins : new Ext.ux.TabCloseMenu(),   
          items : [new Tabs.ArtistTab({title : "Now Playing", 
                                       datasource : this.datasource.now_playing_tab,
                                       closable : false }),
                  ]
    });
    
   // datasource1.update();
   // datasource2.update();
    
    this.viewport = new Ext.Viewport({
               layout : 'border',
               items:  [new Ext.Panel({
                           layout: 'border',
                           region : 'center',
                           items: [ { region : 'north', height: 140, baseCls : '', type : "Ext.Panel", items : [this.searchPanel, this.infoPanel] },
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
  }
});
