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
    
      
    this.tabPanel = new Ext.TabPanel({
          region : 'center',
          margins: '20 20 0 20',
          activeTab : 0,
          items : [new NowPlaying.ui.NowPlayingTab({datasource : datasource})]
    });
       
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
