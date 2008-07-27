Utils.namespace("NowPlaying.ui.panels", {
  ArtistLinksPanel : Ext.extend(Ext.Panel, {
    title: 'Links',
    cls : 'contentpanel',
    width: 160,
    initComponent : function(){
      this.datasource.connect("endUpdate", this, "onChange");
      NowPlaying.ui.panels.ArtistLinksPanel.superclass.initComponent.apply(this, arguments);
    },
    onChange : function(data){
      this.updateContent();
    },
    updateContent : function(){
      if(!this.body){
         return;
      }
      if(!this.contentEl){
        this.contentEl = document.createElement("ul");
        this.contentEl.setAttribute("class", "artist_links");
        this.body.appendChild(this.contentEl);
      }
      this.contentEl.innerHTML = "";
      var urls = this.datasource.artist_urls();
      if(!urls || urls.length == 0){
       var li = document.createElement("li");
        li.innerHTML = "No links found";
        this.contentEl.appendChild(li);
        return;        
      }
      for(var i=0; i< urls.length; i++){
        var li = document.createElement("li");
        var a = document.createElement("a");
        a.setAttribute("href", urls[i].href);
        a.innerHTML = urls[i].rel;
        li.appendChild(a);
        this.contentEl.appendChild(li);
      }
    },
    onRender : function(ct, position){
      NowPlaying.ui.panels.ArtistLinksPanel.superclass.onRender.apply(this, arguments);
      this.updateContent();
   }
  })
});
