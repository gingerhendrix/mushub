


  Utils.namespace("mushub.ui", {
  ArtistUI : function (element, artist){
    var menuElement;
    var contentElement;
    var contentPanels = [];

    this.writeHTML = function(){
      var html = "<h1>"
               + "<a href='artist.html?artist_name=" + artist.name + "&artist_mbid="+ artist.mbid + "' class='permalink'>" + artist.name + "</a>"
               + "</h1>";
      $(element).html(html);
      menuElement = document.createElement("div");
      menuElement.setAttribute("class", "artist_menu");
      $(element).append(menuElement);
      this.writeMenu();
      contentElement = document.createElement("div");
      contentElement.setAttribute("class", "content_container");
      $(element).append(contentElement);
      this.writeContent();
    }

    this.writeMenu = function(){
      contentPanels.forEach(function(cp){
        console.log("cp: %o", cp);
        var label = document.createElement("span");
        label.innerHTML = cp.label;
        menuElement.appendChild(label);
      });
    }

    this.writeContent = function(){
      contentPanels.forEach(function(cp){
        var container = document.createElement("div");
        container.setAttribute("class", "container");
        $(container).html("<h3>"+cp.label+"</h3");
        cp.panel.writeContent(container);
        $(contentElement).append(container);
      });
    }

    this.addContent = function(label, contentPanel, opts){
      opts = opts || {};
      contentPanels.push({label : label, panel : contentPanel, options : opts });
    }
  }
});


Utils.namespace("mushub.ui", {
  ContentPanel : function (){
    this.contentEl;
    this.containerEl;

    this.onUpdate = function(){
      this.writeContent();
    }

    this.writeContent = function(container){
      this.containerEl = container || this.containerEl;
      this.contentEl = this.contentEl || document.createElement("div");

      $(this.contentEl).html("");

      if(this.data.isLoading){
        $(this.contentEl).text("Loading...");
      }else if(this.data.isError){
        $(this.contentEl).text("Error...");
      }else if(this.data.isLoaded){
        this.writeData();
      }else{
        $(this.contentEl).text("");
      }
      $(this.containerEl).append(this.contentEl);
    }

    this.init = function(){
      this.data.connect("endUpdate", this, this.onUpdate);
      this.data.update();
    }

  }
});


Utils.namespace("mushub.ui.panels", {
  LastfmSimilarArtistsPanel : function (artist){
    Utils.extend(this, new mushub.ui.ContentPanel());
    this.data = artist.lastfm_similar_artists;

    this.writeData = function(){
      $(this.contentEl).addClass("similar_artists");
      $(this.contentEl).append(similarArtistsCloud(this.data.similar_artists()));
    }

    function similarArtistsCloud(similar_artists){
       var cloud = document.createElement("ol");
       cloud.setAttribute("class", "cloud");

       function makeLink(artist, clazz, size, label){
         var similar_li = document.createElement("li");
         similar_li.setAttribute("class", clazz);
         $(similar_li).html("<a href='artist.html?artist_name="+artist.name+"&artist_mbid="+artist.mbid+"'>"+artist.name+"</a>")
         return similar_li;
       }

      similar_artists.slice(0, 10).forEach(function(sim){
        var similar_li = makeLink(sim, "large", 130, false);
        cloud.appendChild(similar_li);
        $(cloud).append(" ");
      });

      similar_artists.slice(10, 25).forEach(function(sim){
        var similar_li = makeLink(sim, "medium", 65, false);
        cloud.appendChild(similar_li);
        $(cloud).append(" ");
      });

      similar_artists.slice(25, 50).forEach(function(sim){
        var similar_li = makeLink(sim, "small", 33, false);
        cloud.appendChild(similar_li);
        $(cloud).append(" ");
      });
      return cloud;

    }

   function similarArtistsQuilt(similar_artists){
      var quilt = document.createElement("ol");
      quilt.setAttribute("class", "quilt");

       function makeThumbnail(artist, clazz, size, label){
          var similar_li = document.createElement("li");
          similar_li.setAttribute("class", clazz);

          var artist_img = document.createElement("img");
          artist_img.src = artist.image;
          artist_img.title = artist.name + " (" + artist.match + "%)";
          artist_img.width = size;
          artist_img.height = size;
          artist_img.addEventListener("click", function(){
            self.onArtistClick(artist);
          }, false);
          similar_li.appendChild(artist_img);

          if(label){
            var artist_label = document.createElement("span");
            artist_label.innerHTML = artist.name + " (" + artist.match + "%)";
            similar_li.appendChild(artist_label);
          }
          return similar_li;
       }

      similar_artists.slice(0, 4).forEach(function(sim){
        var similar_li = makeThumbnail(sim, "large", 130, false);
        quilt.appendChild(similar_li);
      });

      similar_artists.slice(4, 20).forEach(function(sim){
        var similar_li = makeThumbnail(sim, "medium", 65, false);
        quilt.appendChild(similar_li);
      });

      similar_artists.slice(20, 84).forEach(function(sim){
        var similar_li = makeThumbnail(sim, "small", 33, false);
        quilt.appendChild(similar_li);
      });
      return quilt;
    }

    this.init();
  }
});


Utils.namespace("mushub.ui.panels", {
  LastfmTopAlbumsPanel : function(artist){
    Utils.extend(this, new mushub.ui.ContentPanel());
    this.data = artist.lastfm_top_albums;

    this.writeData = function(){
      var albumList = document.createElement("ol");
      albumList.setAttribute("class", "top_albums");
      $(this.contentEl).append(albumList);

      var top_albums = this.data.top_albums();
      var max_reach = top_albums[0] ? top_albums[0].reach : 0;

      top_albums.slice(0, 5).forEach(function(album){
        var album_li = document.createElement("li");
        var album_img = document.createElement("img");
        album_img.src = album.image_large;
        album_img.width = 130;
        album_img.height = 130;
        album_img.style.cursor = "pointer";
        var album_label = document.createElement("span");
        album_label.innerHTML = album.name; // + " (" + Math.round(100*(album.reach/max_reach)) + "%)";
        album_li.appendChild(album_img);
        album_li.appendChild(album_label);
        albumList.appendChild(album_li);
      });
    }

    this.init();
  }
});


Utils.namespace("mushub.ui.panels", {
  MusicbrainzLinksPanel : function(artist){
    Utils.extend(this, new mushub.ui.ContentPanel());
    this.data = artist.musicbrainz_links;

    var additionalLinks = [{label : "lastfm", href : "http://last.fm/music/"  + artist.name },
                          {label : "stmusic", href : "http://stmusic.org/browse.php?search=" + artist.name},
                          {label : "mininova", href : "http://www.mininova.org/search/?search=" + artist.name},
                          {label : "piratebay", href : "http://www.piratebay.org/search/" + artist.name}]

    this.writeContent = function(container){
      this.containerEl = container || this.containerEl;
      this.contentEl = this.contentEl || document.createElement("div");

      $(this.containerEl).append(this.contentEl);
      $(this.contentEl).html("");

      if(this.data.isLoading){
        $(this.contentEl).text("Loading...");
      }else if(this.data.isError){
        $(this.contentEl).text("Error...");
      }else if(this.data.isLoaded){
        var list = document.createElement("ul");
        $(list).addClass("links");
        $(this.contentEl).append(list);
        var urls = this.data.artist_urls();
        if(!urls || urls.length == 0){
         var li = document.createElement("li");
          li.innerHTML = "No links found";
          $(list).append(li);
          return;
        }
        for(var i=0; i< urls.length; i++){
          if(urls[i].rel == "Wikipedia"){
            var countryMatch =(new RegExp("http://([A-Za-z]*).wikipedia.org")).exec(urls[i].href);
            if(countryMatch){
              var country = countryMatch[1];
              var li = createLink("Wikipedia ["+country+"]", urls[i].href)
            }else{
              var li = createLink("Wikipedia", urls[i].href);
            }
          }else{
            var li = createLink(urls[i].rel, urls[i].href);
          }
          $(list).append(li);
        }
        additionalLinks.forEach(function(link){
          $(list).append(createLink(link.label, link.href));
        });
      }else{
        $(this.contentEl).text("Waa...");
      }

    }

    function createLink(label, href){
      var li = document.createElement("li");
      var a = document.createElement("a");
      a.setAttribute("target", "_blank");
      a.setAttribute("href", href);
      a.innerHTML = label;
      li.appendChild(a);
      return li;
    }

    this.init();
  }


});

  Utils.namespace("mushub.ui.panels", {
  WikipediaBiographyPanel : function(artist){
    Utils.extend(this, new mushub.ui.ContentPanel());
    this.data = artist.wikipedia_biography;


    this.writeData = function(){
      $(this.contentEl).html(this.data.wikipedia_content());
    }

    this.init();
  }
});


function Artist(name, mbid){
  this.name = name;
  this.mbid = mbid;

  this.wikipedia_biography = new mushub.model.wikipedia.WikipediaDatasource(this);
  this.lastfm_top_albums = new mushub.model.audioscrobbler.TopAlbumsDatasource(this);
  this.lastfm_similar_artists = new mushub.model.audioscrobbler.SimilarArtistsDatasource(this);
  this.musicbrainz_links = new mushub.model.musicbrainz.ArtistUrlsDatasource(this);
  this.musicbrainz_members = new mushub.model.musicbrainz.ArtistMembersDatasource(this);

}

Artist.findByNameAndMBid = function(name, mbid){
  return new Artist(name, mbid);
}


function ArtistQuery(query){
  this.query = query;

  this.musicbrainz_search = new mushub.model.musicbrainz.ArtistSearchDatasource(this.query);


}

  function Datasource(config){
  Utils.extend(this, new Databean());

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
    MochiKit.Signal.signal(this, "beginUpdate");
    this.isLoading = true;
    try{
      params = makeParams(this, config.params);
    }catch(e){
      return;
    }
    var url = Webservice.url(config.service, params);
    var d = sendJSONPRequest(url, "jsonp");
    var self = this;
    d.addCallback(function(response){
        console.log("Datasource[anonymous callback] : %o : %o", self, response);
        if(response.status==202){
           window.setTimeout(function(){ self.isLoading = false; self.update();}, 1000);
        }else if(response.errors && response.errors.length > 0){
          self.isLoading = false;
          self.isError = true;
          MochiKit.Signal.signal(self, "onError", response.errors);
        }else{
          self.isLoading = false;
          self.isError = false;
          self.isLoaded = true;
          self.onUpdate(response.data);
          MochiKit.Signal.signal(self, "endUpdate");
        }
    });
    d.addErrback(function(response){
      self.isError = true;
      self.isLoading = false;
      MochiKit.Signal.signal(self, "onError", response);
      //self.onUpdate(response);
      console.error("Datasource[anon errback] : %o : %o", self, response);
    });
    return d;
  }

}


var Webservice = {
    SERVER : "http://example.org",
    url : function(service, options){
      var queryString = MochiKit.Base.queryString(options);
      return this.SERVER + "/" + service + ".js?" + queryString;
    }

  }

  function Databean(){
  this.properties = {};
  this.connect = function(name, obj, method){
    MochiKit.Signal.connect(this, name, obj, method);
  }

  this.signal = function(name, val){
    console.log("Signal %o, %s, %o", this, name, val);
    MochiKit.Signal.signal(this, name, val);
  }

  this.makeProp = function(prop){

    this[prop] = function(val){
      if(arguments.length > 0 && (MochiKit.Base.isUndefinedOrNull(val) || val != this.properties[prop]) ){
        this.properties[prop] = val;
        this.signal(prop, val);
      }
      return this.properties[prop];
    }

  }
}

  Utils.namespace("mushub.Application",  (function(){
  var artist_name;
  var artist_mbid;
  var query;

  return {
   init : function(){
      var params = QueryString.fromLocation().parts;
      if(params.artist_name && params.artist_mbid){
        artist_name = params.artist_name;
        artist_mbid = params.artist_mbid;
        $(document).ready(function(){
            mushub.Application.showArtistUI(artist_name, artist_mbid);
        });
      }else if(params.artist_name || params.query){
        query = params.artist_name || params.query;
        $(document).ready(function(){
          mushub.Application.performQuery(query);
        });
      }else{
        console.log("Startup..");
      }
   },

   showArtistUI : function (artist_name, artist_mbid){
      $(document.body).removeClass("search");
      $(document.body).addClass("artist");
      $("#search_input").attr("disabled", false);

      var artist = Artist.findByNameAndMBid(artist_name, artist_mbid);

      var ui = new mushub.ui.ArtistUI($('#artist_ui'), artist);
      ui.addContent("Biography", new mushub.ui.panels.WikipediaBiographyPanel(artist), {});
      ui.addContent("Top Albums", new mushub.ui.panels.LastfmTopAlbumsPanel(artist), {});
      ui.addContent("Similar Artists", new mushub.ui.panels.LastfmSimilarArtistsPanel(artist), {});
      ui.addContent("Links", new mushub.ui.panels.MusicbrainzLinksPanel(artist), {});
      ui.writeHTML();
    },

    performQuery : function (query){
        $("#search_input").attr("value", query);
        $("#search_input").attr("disabled", true);
        var search = new ArtistQuery(query);
        search.musicbrainz_search.connect("endUpdate", this, function(){
          var results = search.musicbrainz_search.search_results();
          if(results.length >0){
            var result = results[0];
            var artist_name = result.artist_name;
            var artist_mbid = result.artist_mbid;
            window.location.search = "?artist_name="+encodeURIComponent(artist_name)+"&artist_mbid="+artist_mbid;
           //showArtistUI(artist_name, artist_mbid);
          }
        });
        search.musicbrainz_search.update();
    },

    searchSubmit : function(){
      var query = $('#search_input').val();
      performQuery(query);
      return false;
    }

  }

})());

