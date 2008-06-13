Utils.namespace("NowPlaying.ui", {
  ContentPanel : function(config){
    Utils.extend(this, new NowPlaying.ui.DataPanel());
    config =  Utils.extend( {
          cls : 'contentpanel',
          bbar: new Ext.StatusBar()
        }, config);     
    this.panel = new Ext.Panel(config);
  
  }
});
