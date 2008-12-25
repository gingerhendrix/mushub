Utils.namespace("NowPlaying.ui.windows", {
  YahooVideoWindow : Ext.extend(Ext.Window, {
    title: 'Video',
    width: 526,
    closable: true,
    height : 352,
    initComponent : function(){
      this.datasource.connect("beginUpdate", this, "onChange");
      this.datasource.connect("endUpdate", this, "onChange");
      this.datasource.connect("error", this, "onError");
      
      NowPlaying.ui.windows.YahooVideoWindow.superclass.initComponent.apply(this, arguments);
    },
    onChange : function(data){
      this.updateContent();
    },
    onError : function(error){
      this.contentEl.innerHTML = "" + error + "<br/>";
      return;
    },
    updateContent : function(){
      console.log("Updating content");
      if(!this.body){
         console.log("No body!");
         return;
      }
      if(!this.contentEl){
        this.contentEl = document.createElement("div");
        this.contentEl.setAttribute("class", "yahoo_video_window");
        this.body.appendChild(this.contentEl);
      }

      if(this.datasource.isLoading ){
        this.contentEl.innerHTML = "Loading...";
        console.log("Updating content - Loading");
        return;
      }
      if( this.datasource.isError ){
        this.contentEl.innerHTML = "<div> Error Loading Data </div>";
        console.log("Updating content - Error");
        return;
      }
     
      var video = this.datasource.video();
      if(!video){
        return; 
        console.log("No Video"); 
      }
      console.log("Updating with real data"); 
      this.setTitle("Video: " + video.title + " - " + video.artists[0].name);
      
      html = "";  
      html += "<div id='uvp_fop_container' style='width:512px;height:322px;'>";
      html += "</div>";
      
      this.contentEl.innerHTML = html;
      var self = this;
      window.setTimeout(function(){self.initVideo(video.id, 'uvp_fop_container')}, 1);

    },
    initVideo : function(id, container){
        var so = new SWFObject('http://d.yimg.com/cosmos.bcst.yahoo.com/up/fop/embedflv/swf/fop.swf', 'uvp_fop', '512', '322', '9', '#ffffff');
        so.addVariable('id', 'v' + id);
        so.addVariable('eID', '1301797');   
        so.addVariable('ympsc', '4195351'); 
        so.addVariable('lang', 'en');      
        so.addVariable('shareEnable', '1');
        so.addParam("allowFullScreen", "true");
        so.addVariable('enableFullScreen', '1');
        so.addVariable('autoStart', '0');
        so.addParam("allowScriptAccess", "always");  // for scripting access
        so.write(container);
    },
    onRender : function(ct, position){
      NowPlaying.ui.windows.YahooVideoWindow.superclass.onRender.apply(this, arguments);
      this.updateContent();
   }
  })
});
