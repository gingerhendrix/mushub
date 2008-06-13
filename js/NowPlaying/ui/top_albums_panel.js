Utils.namespace("NowPlaying.ui", { 
  TopAlbumsPanel : function(element, datasource, config){
    config = {
        	title: 'Top Albums',
        	contentEl:'top_albums',
        	columnWidth: .40,
          cls : 'contentpanel',
        }
        
    this.panel = new Ext.Panel(config);
    
    this.onChange = function(top_albums){
      element.innerHTML = "";
      var max_reach = top_albums[0].reach;
      
      top_albums.slice(0, 10).forEach(function(album){
        album_li = document.createElement("li");
        album_li.innerHTML = album.name + " (" + Math.round(100*(album.reach/max_reach)) + "%)";
        //var reach_bar = create_bar((album.reach/max_reach));
        //album_li.appendChild(reach_bar);
        element.appendChild(album_li);
      });
    }
    
    datasource.connect("top_albums", this, "onChange");
  }
});
