
Utils.namespace("mushub.model.wikipedia", { 
  WikipediaDatasource : function(artist){
    Utils.extend(this, new Datasource(
                                       { service : "wikipedia/content",
                                         params : ["url"]
                                       }));      
    var self = this;
    this.update_wikipedia = this.update;
    this.update = function(){
      if(artist.musicbrainz_links.isLoaded){
        this.updateUrl();
      }else{
        this.updateMusicbrainz();
      }
    }                    
    
    this.updateMusicbrainz = function(){
      artist.musicbrainz_links.connect("endUpdate", this, this.updateUrl);
      artist.musicbrainz_links.update();
    }
    
    this.updateUrl = function(){
      var urls = artist.musicbrainz_links.artist_urls();
      var wikipedia_urls = [];
      urls.forEach(function(link){
      if(link.rel == "Wikipedia"){
        wikipedia_urls.push(link.href);
       }
     });
      if(wikipedia_urls.length > 0){
        var foundEn = false;
        wikipedia_urls.forEach(function(url){
           if(url.indexOf("en.wikipedia.org")>=0){
             foundEn = true;
             self.url = url;
             self.update_wikipedia();
          }
        });
      }                   
   }
                                       
    this.makeProp("wikipedia_content");
    
    this.onUpdate = function(response){
      this.wikipedia_content(response.innerHTML);
    }
  }
  
});

