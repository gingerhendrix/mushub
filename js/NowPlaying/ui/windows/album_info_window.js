Utils.namespace("NowPlaying.ui.windows", {
  AlbumInfoWindow : Ext.extend(Ext.Window, {
    title: 'Album Info',
    ctCls : 'album_info_window',
    width: 640,
    closable: true,
    autoHeight : true,
    initComponent : function(){
      this.datasource.connect("beginUpdate", this, "onChange");
      this.datasource.connect("endUpdate", this, "onChange");
      this.datasource.connect("error", this, "onError");
      
      NowPlaying.ui.windows.AlbumInfoWindow.superclass.initComponent.apply(this, arguments);
    },
    onChange : function(data){
      this.updateContent();
    },
    onError : function(error){
      this.contentEl.innerHTML = "" + error + "<br/>";
      return;
    },
    updateContent : function(){
      if(!this.body){
         return;
      }
      if(!this.contentEl){
        this.contentEl = document.createElement("div");
        this.contentEl.setAttribute("class", "album_info");
        this.body.appendChild(this.contentEl);
      }

      if(this.datasource.isLoading ){
        this.contentEl.innerHTML = "Loading...";
        return;
      }
      if( this.datasource.isError ){
        this.contentEl.innerHTML = "<div> Error Loading Data </div>";
        return;
      }
      
      this.contentEl.innerHTML = "";
      this.contentEl.innerHTML += "<img src='"+this.datasource.album_image()+"'/>";
      var tracks = this.datasource.album_track_listing();
      var track_listing = "<ol class='track_listing' >";

      for(var i=0; i<tracks.length; i++){
        var track = tracks[i];
        track_listing += "<li>"+ track.name +"</li>";
      }
      track_listing += "</ol>"
      this.contentEl.innerHTML += track_listing;
      return;
     

    },
    onRender : function(ct, position){
      console.log("ArtistInfoPanel: onRender");
      NowPlaying.ui.windows.AlbumInfoWindow.superclass.onRender.apply(this, arguments);
//      this.updateContent();
   }
  })
});

