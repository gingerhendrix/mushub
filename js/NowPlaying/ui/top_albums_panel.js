Utils.namespace("NowPlaying.ui", { 
  TopAlbumsPanel : function(element, datasource, config){
    this.element = element;
    var self = this;
     Utils.extend(this, new NowPlaying.ui.ContentPanel({
        	title: 'Top Albums',
        	columnWidth: .40,
          contentEl : "top_albums"
      }));
      
        
    this.onChange = function(top_albums){
      this.element.innerHTML = "";
      
      var max_reach = top_albums[0].reach;
      
      top_albums.slice(0, 8).forEach(function(album){
        var album_li = document.createElement("li");
        var album_img = document.createElement("img");
        album_img.src = album.image_large;
        album_img.width = 130;
        album_img.height = 130;
        var album_label = document.createElement("span");
        album_label.innerHTML = album.name + " (" + Math.round(100*(album.reach/max_reach)) + "%)";
        album_li.appendChild(album_img);
        album_li.appendChild(album_label);
        //var reach_bar = create_bar((album.reach/max_reach));
        //album_li.appendChild(reach_bar);
        self.element.appendChild(album_li);
      });
    }
    this.linkStatus(datasource);
    datasource.connect("top_albums", this, "onChange");
  }
});
