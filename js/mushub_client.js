
Utils.namespace("mushub.client.utils", {
  /**
   * Datasource is a wrapper around a json resource.
   * It has a single update method that should be called be client,
   * and it generates a message "endUpdate" when the data is ready.
   * The data is stored by default in the data property but this can
   * be overrided by implementing an onUpdate(response) method in
   * the subclass.
   *
   */
  Datasource : function(config){
    Utils.extend(this, new Utils.DataBean());

    this.isLoading = false;
    this.isLoaded = false;

    function makeParams(self, params){
      var paramObj = {}
      params.forEach(function(param){
        if(typeof param == "string"){
          paramObj[param] = self[param];
        }else{
          paramObj[param.name] = self[param.prop];
        }
      });
      return paramObj;
    }

    this.update = function(){
      console.log("Datasource.update : %o ", this);
      if(this.isLoading){
        return;
      }
      Utils.signals.signal(this, "beginUpdate");
      this.isLoading = true;
      try{
        params = makeParams(this, config.params);
      }catch(e){
        return;
      }
      var url = Utils.Webservice.url(config.service, params);
      var d = sendJSONPRequest(url, "jsonp");
      var self = this;
      d.addCallback(function(response){
          console.log("Datasource[anonymous callback] : %o : %o", self, response);
          if(response.status==202){
             window.setTimeout(function(){ self.isLoading = false; self.update();}, 1000);
          }else if(response.errors && response.errors.length > 0){
            self.isLoading = false;
            self.isError = true;
            Utils.signals.signal(self, "onError", response.errors);
          }else{
            self.isLoading = false;
            self.isError = false;
            self.isLoaded = true;
            self.onUpdate(response.data);
            Utils.signals.signal(self, "endUpdate");
          }
      });
      d.addErrback(function(response){
        self.isError = true;
        self.isLoading = false;
        Utils.signals.signal(self, "onError", response);
        //self.onUpdate(response);
        console.error("Datasource[anon errback] : %o : %o", self, response);
      });
      return d;
    }

  }
});
Utils.namespace("Utils" , {
   Webservice : {
    SERVER : "http://example.org",
    url : function(service, options){
      var queryString = MochiKit.Base.queryString(options);
      return this.SERVER + "/" + service + ".js?" + queryString;
    }
  }
});



Utils.namespace("mushub.model.audioscrobbler", {
  SimilarArtistsDatasource : function(artist){
    this.artist = artist.name;
    Utils.extend(this, new Datasource(
                                       { service : "audioscrobbler/similar_artists",
                                         params : ["artist"]
                                       }));

    this.makeProp("similar_artists");


    this.onUpdate = function(response){
      this.similar_artists(response.similar_artists);
    }

  }
});

  Utils.namespace("mushub.model.audioscrobbler", {
  TopAlbumsDatasource : function(artist){
    this.artist = artist.name;
    Utils.extend(this, new Datasource(
                                       { service : "audioscrobbler/top_albums",
                                         params : ["artist"]
                                       }));

    this.makeProp("top_albums");

    this.onUpdate = function(response){
      //alert("TopAlbums : " + this.artist + ".onUpdate " + response);
      this.top_albums(response.top_albums);
    }

    this.toString = function(){
      return "TopAlbumsDatasource[" + this.artist + "]";
    }
  }
});


Utils.namespace("mushub.model.musicbrainz", {
  ArtistMembersDatasource : function(artist){
    this.artist_mbid = artist.mbid;
    Utils.extend(this, new Datasource(
                                       { service : "musicbrainz/artist_members",
                                         params : [{ name : "artist_mbid", prop : "artist_mbid" }]
                                       }));

    this.makeProp("artist_relations");

    this.onUpdate = function(response){
      this.artist_relations(response.relations);
    }

  }
});


Utils.namespace("mushub.model.musicbrainz", {
  ArtistUrlsDatasource : function(artist){
    this.artist_mbid = artist.mbid;
    Utils.extend(this, new Datasource(
                                       { service : "musicbrainz/artist_urls",
                                         params : ["artist_mbid"]
                                       }));

    this.makeProp("artist_urls");

    this.onUpdate = function(response){
      this.artist_urls(response.urls);
    }

  }
});


  Utils.namespace("mushub.model.musicbrainz", {
  ArtistSearchDatasource : function(query){
    Utils.extend(this, new Datasource(
                                       { service : "musicbrainz/artist_search",
                                         params : [{ name : "query", prop : "query" }]
                                       }));
    this.query = query;
    this.makeProp("search_results");

    this.onUpdate = function(response){
      this.search_results(response.results);
    }

  }
});


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
