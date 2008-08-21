Utils.namespace("NowPlaying.ui.panels", {
  ArtistInfoPanel : Ext.extend(Ext.Panel, {
    title: 'Wikipedia',
    cls : 'contentpanel',
    ctCls : 'artist_wikipedia',
    width: 640,
    initComponent : function(){
      this.datasource.connect("beginUpdate", this, "onChange");
      this.datasource.connect("endUpdate", this, "onChange");
      NowPlaying.ui.panels.ArtistInfoPanel.superclass.initComponent.apply(this, arguments);
    },
    onChange : function(data){
      console.log("ArtistInfoPanel: onChange");
      this.updateContent();
    },
    updateContent : function(){
      console.log("ArtistInfoPanel: updateContent (body: " + this.body + ", wp_content: " + this.datasource.wikipedia_content() + ", contentEl: " + this.contentEl + ")");
      if(!this.body){
         return;
      }
      var self = this;
      if(this.datasource.isLoading ){
        this.contentEl = null;
        this.body.innerHTML = "Loading...";
        return;
      }
      if( this.datasource.isError ){
        this.contentEl = null;
        this.body.innerHTML = "Error Loading Data :(";
        return;
      }

      if( !this.datasource.wikipedia_content() ){
        this.body.innerHTML = "Data not loaded";
        return;
      }
      if(!this.contentEl){
        this.contentEl = document.createElement("div");
        this.contentEl.setAttribute("class", "wikipedia_content");
        this.body.appendChild(this.contentEl);
      }
      this.contentEl.innerHTML = this.datasource.wikipedia_content();
    },
    onRender : function(ct, position){
      console.log("ArtistInfoPanel: onRender");
      NowPlaying.ui.panels.ArtistInfoPanel.superclass.onRender.apply(this, arguments);
      this.updateContent();
   }
  })
});

