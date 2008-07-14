Utils.namespace("NowPlaying.ui", {
  ArtistInfoPanel : function(element, datasource){
    this.element = element;
    Utils.extend(this, new NowPlaying.ui.ContentPanel({
          title: 'Wikipedia',
        	contentEl:'artist_wikipedia',
    }));

    this.linkStatus(datasource, "status");
    
    this.linkHtml(datasource, "artist", "artist");
    this.link(datasource, "wikipedia_url", "wikipedia_url", function(el, val){
      el.href = val;
    });
    
    datasource.connect("beginUpdate", this, function(){
      this.panel.getBottomToolbar().showBusy();
    });
    datasource.connect("error", this, function(msg){
      this.panel.body.enableDisplayMode();
      this.panel.body.setVisible(false);
      this.panel.getBottomToolbar().setStatus({text : "Error - " + msg , iconCls : 'x-status-error'});
    });
    
    this.linkHtml(datasource, "wikipedia_content", "wikipedia_content");
  
  }
});

