
Utils.namespace("NowPlaying.data", { 
  ArtistInfoDatasource : function(npDatasource, urlDatasource, wpDatasource){ 
    var self = this;
    this.makeProp("artist");  
    this.makeProp("wikipedia_url");
    this.makeProp("wikipedia_content");
  
    this.onUrlChange = function(urls){
      var self = this;
      urls.forEach(function(link){
        if(link.rel == "Wikipedia"){
          self.wikipedia_url(link.href);
          self.updateWikipedia(link.href);
        }
      });
    }
    
    this.updateMusicbrainz = function(artist_mbid){
      urlDatasource.artist_mbid = artist_mbid;
      MochiKit.Signal.signal(this, "beginUpdate");    
      urlDatasource.update();
    }
    
    this.updateWikipedia = function(url){
      wpDatasource.url = url;
      MochiKit.Signal.signal(this, "beginUpdate");    
      wpDatasource.update();
    }
    
    npDatasource.connect("artist", this, "artist");
    npDatasource.connect("artist_mbid", this, "updateMusicbrainz");
    urlDatasource.connect("artist_urls", this, "onUrlChange");
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
