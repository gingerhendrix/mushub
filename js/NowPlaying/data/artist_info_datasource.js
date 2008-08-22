
Utils.namespace("NowPlaying.data", { 
  ArtistInfoDatasource : function(artist, artist_mbid){ 
    Utils.extend(this, new NowPlaying.utils.DataBean());
    var self = this;
    
    this.artist_name = artist;
    this.artist_mbid = artist_mbid;
    
    this.makeProp("artist");  
    this.makeProp("wikipedia_url");
    this.makeProp("wikipedia_content");
    
    this.isLoading = false;
    this.isError = false;
  
    this.onUrlChange = function(urls){
     var found = false;
      urls.forEach(function(link){
        if(link.rel == "Wikipedia" && !found){
          self.wikipedia_url(link.href);
          self.updateWikipedia(link.href);
          found = true;
        }
      });
      if(!found){
        this.isLoading = false;
        this.isError = true;
        MochiKit.Signal.signal(this, "error", "Wikipedia page not found");        
      }
      
    }
    
    this.updateMusicbrainz = function(artist_mbid){
      urlDatasource.artist_mbid = artist_mbid;
      if(MochiKit.Base.isUndefinedOrNull(artist_mbid)){
        this.isLoading = false;
        this.isError = true;
        MochiKit.Signal.signal(this, "error", "Musicbrainz id not found");        
      }else{
        urlDatasource.update();       
      }
    }
    
    this.updateWikipedia = function(url){
      wpDatasource.url = url;
      wpDatasource.update();
    }
    
    this.onWikipediaUpdate = function(){
     
      this.wikipedia_content(wpDatasource.wikipedia_content());
      this.isError = false;
      this.isLoading = false;

      MochiKit.Signal.signal(this, "endUpdate");    
    }
    
    this.onError = function(error){
      this.isError = true;
      MochiKit.Signal.signal(this, "error", error);        
    }
    
    this.update = function(){
      this.isLoading = true;
      this.updateMusicbrainz(this.artist_mbid);
      MochiKit.Signal.signal(this, "beginUpdate");    
    }
    
    urlDatasource = new NowPlaying.data.musicbrainz.ArtistUrlsDatasource();
    wpDatasource = new NowPlaying.data.wikipedia.WikipediaDatasource();
    urlDatasource.connect("artist_urls", this, "onUrlChange");
    wpDatasource.connect("endUpdate", this, "onWikipediaUpdate");
    
    [urlDatasource, wpDatasource].forEach(function(ds){
        ds.connect("onError", self, "onError");
    });
  
  }
});
