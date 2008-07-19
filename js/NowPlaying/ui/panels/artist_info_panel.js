Utils.namespace("NowPlaying.ui.panels", {
  ArtistInfoPanel : Ext.extend(Ext.Panel, {
    title: 'Wikipedia',
    cls : 'contentpanel',
    ctCls : 'artist_wikipedia',
    width: 640,
    initComponent : function(){
      this.datasource.connect("endUpdate", this, "onChange");
      NowPlaying.ui.panels.ArtistInfoPanel.superclass.initComponent.apply(this, arguments);
    },
    onChange : function(data){
      console.log("ArtistInfoPanel: onChange");
      this.updateContent();
    },
    updateContent : function(){
      console.log("ArtistInfoPanel: updateContent");
      if(!this.body){
         return;
      }
      var self = this;
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

