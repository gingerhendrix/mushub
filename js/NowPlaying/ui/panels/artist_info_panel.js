Utils.namespace("NowPlaying.ui.panels", {
  ArtistInfoPanel : Ext.extend(Ext.Panel, {
    title: 'Wikipedia',
    cls : 'contentpanel',
    ctCls : 'artist_wikipedia',
    width: 640,
    autoHeight : true,
    initComponent : function(){
      this.datasource.connect("beginUpdate", this, "onChange");
      this.datasource.connect("endUpdate", this, "onChange");
      this.datasource.connect("error", this, "onError");
      
      NowPlaying.ui.panels.ArtistInfoPanel.superclass.initComponent.apply(this, arguments);
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
        this.contentEl.setAttribute("class", "wikipedia_content");
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
      if( !this.datasource.wikipedia_content() ){
        this.contentEl.innerHTML = "Data not loaded";
        return;
      }
      
      this.contentEl.innerHTML = this.datasource.wikipedia_content();
    },
    onRender : function(ct, position){
      console.log("ArtistInfoPanel: onRender");
      NowPlaying.ui.panels.ArtistInfoPanel.superclass.onRender.apply(this, arguments);
//      this.updateContent();
   }
  })
});

