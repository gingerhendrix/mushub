
Utils.namespace("NowPlaying.data.wikipedia", { 
  WikipediaDatasource : function(url){
    this.url = url;
    Utils.extend(this, new NowPlaying.data.Datasource(
                                       { service : "wikipedia/content",
                                         params : ["url"]
                                       }));      
    this.makeProp("wikipedia_content");
    
    this.onUpdate = function(response){
      this.wikipedia_content(response.innerHTML);
    }
  }
  
});

