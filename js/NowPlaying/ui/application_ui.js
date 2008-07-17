Utils.namespace("NowPlaying.ui", {
  ApplicationUI : function(datasource){
    this.datasource = datasource;
    
    var UI = NowPlaying.ui;
    var Data = NowPlaying.data;
    var appUI = Utils.namespace("NowPlaying.Application.ui");
    var appData = NowPlaying.Application.data;
     
    this.topbar = new UI.UsernamePanel({
          region:'north',
        	width: 800,
    });  
     
    this.infoPanel = new UI.NowPlayingPanel({datasource : datasource.now_playing});        
    
  //  var datasource1 = new Data.ArtistTabDatasource("Twisted Sister", "c6122fee-089f-41c4-a34f-e5f7e5607b05");
    var datasource2 = new Data.ArtistTabDatasource("The Flower Kings", "0a389268-6fd8-4f8c-ab6e-0dba5ecec66b");
    
    this.tabPanel = new Ext.TabPanel({
          region : 'center',
          margins: '20 20 0 20',
          activeTab : 1,
          deferredRender : false,
          items : [new NowPlaying.ui.ArtistTab({datasource : this.datasource.now_playing_tab }),
                   new NowPlaying.ui.ArtistTab({datasource : datasource2})
                  ]
    });
    
   // datasource1.update();
    datasource2.update();
    
    this.viewport = new Ext.Viewport({
               layout:'border',
               items: [this.topbar, 
                       new Ext.Panel({
                           layout: 'border',
                           region: 'center',
                           items: [this.infoPanel, this.tabPanel]
              })]
    });
    

  }
});
