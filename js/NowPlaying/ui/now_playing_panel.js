Utils.namespace("NowPlaying.ui", {    
  NowPlayingPanel : function(element, datasource, config){
    config = config ? config : {
        	title: 'Now Playing',
        	contentEl:'now_playing',
          region:'north',
          height: 120,
          margins: '20 20 0 20',
        	bbar: new Ext.StatusBar({
                        id: 'now-playing-status',
                        text: 'Ok',
                        iconCls: 'ready-icon',
                    })
        };
    Utils.extend(this, Utils.Extendable);
    this.extend(new NowPlaying.ui.DataPanel());
    
    this.panel = new Ext.Panel(config);
    this.panel.getBottomToolbar().showBusy();
    
    this.element = element;
    
    this.linkHtml(datasource, "track", "track");
    this.linkHtml(datasource, "album", "album", "unknown");
    this.linkHtml(datasource, "artist", "artist");
    
    this.linkStatus(datasource, "status");
    datasource.connect("beginUpdate", this, function(){
      this.panel.getBottomToolbar().showBusy();
    });
    datasource.connect("endUpdate", this, function(){
      this.panel.getBottomToolbar().clearStatus();
    });
  }
});

//NowPlaying.ui.NowPlayingPanel.prototype = new NowPlaying.ui.DataPanel();
