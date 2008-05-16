
Utils.namespace("NowPlaying.data.wikipedia", { 
  WikipediaDatasource : function(url){
    this.url = url;
    
    this.makeProp("wikipedia_content");
    
    this.update = function(){
     if(this.url && this.url.length > 0){
        var url = NowPlaying.data.Webservice.url("wikipedia/content", {url : this.url});
        var d = sendJSONPRequest(url, "jsonp");
        d.addCallback(bind(this.onUpdate, this));
        return d
      }
    }
    
    this.onUpdate = function(response){
      this.wikipedia_content(response.innerHTML);
    }
  }
  
});

NowPlaying.data.wikipedia.WikipediaDatasource.prototype = new NowPlaying.utils.DataBean();
