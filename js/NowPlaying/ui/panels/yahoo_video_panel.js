Utils.namespace("NowPlaying.ui.panels", {
  YahooVideoPanel : Ext.extend(Ext.Panel, {
    title: 'Videos',
    autoHeight : true,
    width : 320,
    initComponent : function(){
      this.datasource.connect("beginUpdate", this, "onChange");
      this.datasource.connect("endUpdate", this, "onChange");
      NowPlaying.ui.panels.YahooVideoPanel.superclass.initComponent.apply(this, arguments);
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
      if(this.datasource.isLoading){
        this.contentEl.innerHTML = "Loading";
        return;
      }
      this.contentEl.innerHTML = "";
      
      var videoEl = "<div>"
      var videos = this.datasource.videos();
//      this.contentEl.innerHTML = videos.toSource();      
      videos.forEach(function(video){
        videoHtml = "<div>";
        videoHtml += video.title + " - " + video.id;
        videoHtml += "<img src='http://d.yimg.com/img.music.yahoo.com/image/v1/video/"+video.id+"?size=280x'></img>";
        videoHtml += "</div>";
        videoEl += videoHtml;
      });
      videoEl += "</div>"
      this.contentEl.innerHTML = videoEl;
    },
    onRender : function(ct, position){
      NowPlaying.ui.panels.YahooVideoPanel.superclass.onRender.apply(this, arguments);
      this.updateContent();
   }
  })
});

