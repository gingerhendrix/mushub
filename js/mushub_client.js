
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
    config = config || {params : []};

    Utils.extend(this, new Utils.DataBean());

    this.isLoading = false;
    this.isLoaded = false;
    this.isError = false;

    function makeParams(self, ps){
      var params = [];
      ps.forEach(function(param){
        var paramObj = {}
        if(typeof param == "string"){
          paramObj.name = param;
          paramObj.value = self[param];
        }else{
          paramObj.name = param.name;
          if(param.prop){
            paramObj.value = self[param.prop];
          }else{
            paramObj.value = param.value;
          }
        }
        params.push(paramObj)
      });
      return params;
    }

    this.update = function(){
      console.log("Datasource.update : %o ", this);
      if(this.isLoading){
        return;
      }
      Utils.signals.signal(this, "beginUpdate");
      this.isLoading = true;
      var params = makeParams(this, config.params);
      console.log("Params : %o => %o ", config.params, params);
      var url = mushub.Webservice.url(config.service, params);
      var self = this;
      var callback = function(response){
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
      };

      var errback = function(response){
        self.isError = true;
        self.isLoading = false;
        Utils.signals.signal(self, "onError", response);
        //self.onUpdate(response);
        console.error("Datasource[anon errback] : %o : %o", self, response);
      };
      Utils.http.scriptRequest(url, "jsonp", callback, errback);
    }

    this.onUpdate = function(response){
      this.data = response;
    }

  }
});
Utils.namespace("mushub" , {
   Webservice : {
    SERVER : "http://api.mushub.com",
    url : function(service, options){
      console.log("url: %o, options: %o", service, options);
      var queryString = options.map(function(o){
        return o.name + "=" + o.value;
       }).join('&'); //MochiKit.Base.queryString(options);
      return this.SERVER + "/" + service + ".js?" + queryString;
    }
  }
});



Utils.namespace("mushub.model.audioscrobbler", {
  SimilarArtistsDatasource : function(artist){
    this.artist = artist.name;
    Utils.extend(this, new mushub.client.utils.Datasource(
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
    Utils.extend(this, new mushub.client.utils.Datasource(
                                       { service : "audioscrobbler/top_albums",
                                         params : [{name : "artist", value : artist.name}]
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
    Utils.extend(this, new mushub.client.utils.Datasource(
                                       { service : "musicbrainz/artist_members",
                                         params : [{ name : "artist_mbid", value : artist.mbid }]
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
    Utils.extend(this, new mushub.client.utils.Datasource(
                                       { service : "musicbrainz/artist_urls",
                                         params : [{name : "artist_mbid", value : artist.mbid}]
                                       }));

    this.makeProp("artist_urls");

    this.onUpdate = function(response){
      this.artist_urls(response.urls);
    }

  }
});


  Utils.namespace("mushub.model.musicbrainz", {
  ArtistSearchDatasource : function(query){
    Utils.extend(this, new mushub.client.utils.Datasource(
                                       { service : "musicbrainz/artist_search",
                                         params : [{ name : "query", value : query }]
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
    Utils.extend(this, new mushub.client.utils.Datasource(
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
      artist.musicbrainz_links.connect("endUpdate", this.updateUrl);
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