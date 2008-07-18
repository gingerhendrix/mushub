Utils.namespace("NowPlaying.ui.panels", {
  AlbumInfoPanel : function(element, datasource){
    this.element = element;
    Utils.extend(this, new NowPlaying.ui.ContentPanel({
      title: 'Album Info',
      columnWidth: 0.4,        
      contentEl:'album_info',
    }));
    
    this.link(datasource, "album", "album", function(el, album){
      if(!album || album == ""){
        MochiKit.DOM.addElementClass(this.element, "error");
        el.innerHTML = "Unknown Album";
      }else{
       MochiKit.DOM.removeElementClass(this.element, "error");
      }
    });

    this.linkHtml(datasource, "reach", "reach");

    this.linkStatus(datasource);
    
    this.linkImage(datasource, "image", "album_image");    
    
    this.link(datasource, "track_listing", "track_listing_list", function(el, val){
       el.innerHTML = "";
       val.forEach(function(track){
         var li = document.createElement("li");
         li.innerHTML = track.name;
         el.appendChild(li);
       });
   });
  }
});

