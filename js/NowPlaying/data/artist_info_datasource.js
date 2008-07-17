
Utils.namespace("NowPlaying.data", { 
  ArtistInfoDatasource : function(artist, artist_mbid){ 
    var self = this;
    
    this.artist_name = artist;
    this.artist_mbid = artist_mbid;
    
    this.makeProp("artist");  
    this.makeProp("wikipedia_url");
    this.makeProp("wikipedia_content");
  
    this.onUrlChange = function(urls){
      var self = this;
      var found = false;
      urls.forEach(function(link){
        if(link.rel == "Wikipedia"){
          self.wikipedia_url(link.href);
          self.updateWikipedia(link.href);
          found = true;
        }
      });
      if(!found){
        MochiKit.Signal.signal(this, "endUpdate");
        MochiKit.Signal.signal(this, "error", "No wikipedia page found");        
      }
      
    }
    
    this.updateMusicbrainz = function(artist_mbid){
      urlDatasource.artist_mbid = artist_mbid;
      if(MochiKit.Base.isUndefinedOrNull(artist_mbid)){
        MochiKit.Signal.signal(this, "endUpdate");
        MochiKit.Signal.signal(this, "error", "Musicbrainz id not found");        
      }else{
        MochiKit.Signal.signal(this, "beginUpdate");    
        urlDatasource.update();       
      }
    }
    
    this.updateWikipedia = function(url){
      wpDatasource.url = url;
      MochiKit.Signal.signal(this, "beginUpdate");    
      wpDatasource.update();
    }
    
    this.update = function(){
      this.updateMusicbrainz(this.artist_mbid);
    }
    
    urlDatasource = new NowPlaying.data.musicbrainz.ArtistUrlsDatasource();
    urlDatasource.connect("artist_urls", this, "onUrlChange");
    wpDatasource = new NowPlaying.data.wikipedia.WikipediaDatasource();
    wpDatasource.connect("wikipedia_content", this, "wikipedia_content");
    
    [wpDatasource].forEach(function(ds){ 
        ds.connect("endUpdate", 
                  self, 
                  function(){
                     MochiKit.Signal.signal(self, "endUpdate");    
                   });
    });
  
  }
});


NowPlaying.data.ArtistInfoDatasource.prototype = new NowPlaying.utils.DataBean();
