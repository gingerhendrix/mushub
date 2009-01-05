Utils.namespace("NowPlaying.ui.panels", {
  TorrentSearchPanel : Ext.extend(Ext.Panel, {
    title: 'Torrent Search',
    autoHeight : true,
    initComponent : function(){
       this.datasource.connect("endUpdate", this, "onUpdate");
       NowPlaying.ui.panels.TorrentSearchPanel.superclass.initComponent.apply(this, arguments);
    },
    
    onUpdate : function(data){
      this.artist = data.artist;
      this.updateContent();
    },
    
    updateContent : function(){
      if(!this.body){
         return;
      }
      if(!this.contentEl){
        this.contentEl = document.createElement("ul");
        this.contentEl.setAttribute("class", "torrent_search");
        this.body.appendChild(this.contentEl);
      }
      this.contentEl.innerHTML = "";
      var urls = [ {title : "STmusic", href : "http://www.stmusic.org/browse.php?search=" + this.artist },
                   {title : "mininova", href : "http://www.mininova.org/search/?search=" + this.artist },
                   {title : "The Pirate Bay", href : "http://thepiratebay.org/search/" + this.artist } ]
      for(var i=0; i< urls.length; i++){
        var li = document.createElement("li");
        var a = document.createElement("a");
        a.setAttribute("target", "_blank");
        a.setAttribute("href", urls[i].href);
        a.innerHTML =  urls[i].title;
        li.appendChild(a);
        this.contentEl.appendChild(li);
      }
    },
    
    onRender : function(ct, position){
      NowPlaying.ui.panels.TorrentSearchPanel.superclass.onRender.apply(this, arguments);
      this.updateContent();
   }
  })
});

