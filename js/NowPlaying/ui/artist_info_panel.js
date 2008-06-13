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
    this.linkHtml(datasource, "wikipedia_content", "wikipedia_content");
  
  }
});

