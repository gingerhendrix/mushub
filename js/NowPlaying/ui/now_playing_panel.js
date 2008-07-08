Utils.namespace("NowPlaying.ui", {    
  NowPlayingPanel : function(element, datasource){
    Utils.extend(this, Utils.Extendable);
    this.extend(new NowPlaying.ui.DataPanel());
    this.extend(this, new NowPlaying.ui.ContentPanel({
        	title: 'Now Playing',
        	contentEl:'now_playing',
          region:'north',
          height: 120,
          margins: '20 20 0 20',
    }));
    this.element = element;
    
    this.linkImage(datasource, "avatar", "avatar");
    this.linkHtml(datasource, "track", "track");
    this.linkHtml(datasource, "album", "album", "unknown");
    this.linkHtml(datasource, "artist", "artist");
    
    this.linkStatus(datasource);
  }
});
