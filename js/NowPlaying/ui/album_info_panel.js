Utils.namespace("NowPlaying.ui", {
  AlbumInfoPanel : function(element, datasource){
    this.element = element;
    
    this.panel = new Ext.Panel({
          title: 'Album Info',
          columnWidth: 0.4,        
          contentEl:'album_info',
          cls : 'contentpanel',
          bbar: new Ext.StatusBar({
                        text: 'Ok',
                        iconCls: 'ready-icon',
                    })
        });
    
    this.link(datasource, "album", "album", function(el, album){
      if(!album || album == ""){
        MochiKit.DOM.addElementClass(this.element, "error");
        el.innerHTML = "Unknown Album";
      }else{
       MochiKit.DOM.removeElementClass(this.element, "error");
      }
    });

    this.linkHtml(datasource, "reach", "reach");
    this.linkStatus(datasource, "status");
    
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

NowPlaying.ui.AlbumInfoPanel.prototype = new NowPlaying.ui.DataPanel();
