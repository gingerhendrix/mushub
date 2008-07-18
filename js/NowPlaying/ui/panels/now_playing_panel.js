Utils.namespace("NowPlaying.ui.panels", {    
  NowPlayingPanel : Ext.extend(Ext.Panel, {
      	title: 'Now Playing',
       	contentEl:'now_playing',
        region:'north',
        height: 120,
        margins: '20 20 0 20',
        cls : 'contentpanel',
        //bbar: new Ext.StatusBar(),
        initComponent : function(){
            NowPlaying.ui.NowPlayingPanel.superclass.initComponent.apply(this, arguments);
            
            Utils.extend(this, new NowPlaying.ui.DataPanel());         
            
            this.panel = this;
            this.element = this.el;
            this.linkImage(this.datasource, "avatar", "avatar");
            this.linkHtml(this.datasource, "track", "track");
            this.linkHtml(this.datasource, "album", "album", "unknown");
            this.linkHtml(this.datasource, "artist", "artist");
            //this.linkStatus(this.datasource);
       }
  })
});
