Utils.namespace("NowPlaying.ui.panels", {
  MusicbrainzLinksPanel : Ext.extend(Ext.Panel, {
    title: 'Musicbrainz Links',
    autoHeight : true,
    initComponent : function(){
      alert("mlp ds " + this.datasource);
      this.datasource.connect("endUpdate", this, "onChange");
      NowPlaying.ui.panels.MusicbrainzLinksPanel.superclass.initComponent.apply(this, arguments);
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
        a.setAttribute("target", "_new");
        a.setAttribute("href", urls[i].href);
        a.innerHTML = urls[i].rel;
        li.appendChild(a);
        this.contentEl.appendChild(li);
      }
    },
    onRender : function(ct, position){
      NowPlaying.ui.panels.MusicbrainzLinksPanel.superclass.onRender.apply(this, arguments);
      this.updateContent();
   }
  })
});

