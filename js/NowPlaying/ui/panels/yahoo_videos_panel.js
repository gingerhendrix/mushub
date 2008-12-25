Utils.namespace("NowPlaying.ui.panels", {
  YahooVideosPanel : Ext.extend(Ext.Panel, {
    title: 'Videos',
    autoHeight : true,
    width : 640,
    cls : 'contentPanel',
    initComponent : function(){
      this.datasource.connect("beginUpdate", this, "onChange");
      this.datasource.connect("endUpdate", this, "onChange");
      NowPlaying.ui.panels.YahooVideosPanel.superclass.initComponent.apply(this, arguments);
    },
    onChange : function(data){
      this.updateContent();
    },
    onClick : function(id){
      var data = new NowPlaying.data.yahoo_music.VideoDatasource();
      data.id = id;
      var win= new NowPlaying.ui.windows.YahooVideoWindow({ datasource : data });
      win.show();
      data.update();
      
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
      var videos = this.datasource.videos();
      if( !videos || videos.length == 0){
        this.contentEl.innerHTML = "No videos found";
        return;
      }
      this.contentEl.innerHTML = "";
      
      var videosEl = document.createElement("div");
      videosEl.setAttribute("class", "yahoo_videos");
      
      var videos = this.datasource.videos();
      var self = this;

      videos.forEach(function(video){
        videoEl = document.createElement("div");
        videoEl.setAttribute("class", "video");
        
        videoHtml = "";
        videoHtml += "<img src='http://d.yimg.com/img.music.yahoo.com/image/v1/video/"+video.id+"?size=140x84'></img>";
        videoHtml += "<span class='title'>"+video.title+"</span>";
        
        videoEl.innerHTML = videoHtml;

        videoEl.addEventListener("click", function(){
          self.onClick(video.id);       
        }, false);

        videosEl.appendChild(videoEl);
      });

      this.contentEl.appendChild(videosEl);
    },
    onRender : function(ct, position){
      NowPlaying.ui.panels.YahooVideosPanel.superclass.onRender.apply(this, arguments);
      this.updateContent();
   }
  })
});

