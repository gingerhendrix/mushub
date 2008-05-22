

  Utils.namespace("NowPlaying.utils", {
 DataBean : function(){
    this.properties = {};

    this.connect = function(name, obj, method){
      MochiKit.Signal.connect(this, name, obj, method);
    }

    this.makeProp = function(prop){

      this[prop] = function(val){
        if(arguments.length > 0 && val != this.properties[prop]){
          this.properties[prop] = val;
          MochiKit.Signal.signal(this, prop, val);
        }
        return this.properties[prop];
      }

    }
  }
});

  Utils.namespace("NowPlaying.ui", {
  DataPanel : function(){
    this.link = function(datasource, topic, elementClass, fn){
       datasource.connect(topic, this, function(val){
        var elements = MochiKit.DOM.getElementsByTagAndClassName("*", elementClass, this.element);
        elements.forEach(function(el){
          fn.apply(this, [el, val]);
        });
      });
    }

    this.linkHtml = function(dataSource, topic, elementClass){
      this.link(dataSource, topic, elementClass, function(el, val){ el.innerHTML = val; });
    }

    this.linkImage = function(dataSource, topic, elementClass){
      this.link(dataSource, topic, elementClass, function(el, val){ el.src = val; });
    }
  }
});


Utils.namespace("NowPlaying.data.audioscrobbler", {
  AlbumInfoDatasource : function(artist, album){
    this.artist = artist;
    this.album = album;

    this.makeProp("album_reach");
    this.makeProp("album_image");
    this.makeProp("album_track_listing");

    this.update = function(){
      if(this.artist && this.artist.length > 0 && this.album && this.album.length > 0){
        var url = NowPlaying.data.Webservice.url("audioscrobbler/album_info", {artist : this.artist, album : this.album })
        var d = MochiKit.Async.sendJSONPRequest(url, "jsonp");
        d.addCallback(bind(this.onUpdate, this));
        return d
      }
    }

    this.onUpdate = function(album){
      this.album_reach(album.reach);
      this.album_image(album.image_small);
      this.album_track_listing(album.tracks);
    }
 }
});

NowPlaying.data.audioscrobbler.AlbumInfoDatasource.prototype = new NowPlaying.utils.DataBean();

  Utils.namespace("NowPlaying.data.audioscrobbler", {
  TopAlbumsDatasource : function(artist){
    this.artist = artist;

    this.makeProp("top_albums");

    this.update = function(){
      var url = NowPlaying.data.Webservice.url("audioscrobbler/top_albums", {artist : this.artist})
      var d = sendJSONPRequest(url, "jsonp");
      d.addCallback(bind(this.onUpdate, this));
      return d
    }

    this.onUpdate = function(response){
      this.top_albums(response);
    }

  }
});

NowPlaying.data.TopAlbumsDatasource.prototype = new NowPlaying.utils.DataBean();


Utils.namespace("NowPlaying.data.audioscrobbler", {
  RecentTracksDatasource : function (username){
    this.username = username;

    this.makeProp("recent_tracks");

    this.update = function(){
      var url = NowPlaying.data.Webservice.url("audioscrobbler/recent_tracks", { username : this.username })
      var d = MochiKit.Async.sendJSONPRequest(url, "jsonp");
      d.addCallback(bind(this.onUpdate, this));
      return d
    }

    this.onUpdate = function(response){
      this.recent_tracks(response);
    }
  }
});

NowPlaying.data.RecentTracksDatasource.prototype = new NowPlaying.utils.DataBean();


Utils.namespace("NowPlaying.data.audioscrobbler", {
  SimilarArtistsDatasource : function(artist){
    this.artist = artist;

    this.makeProp("similar_artists");

    this.update = function(){
      var url = NowPlaying.data.Webservice.url("audioscrobbler/similar_artists",{artist : this.artist});
      var d = sendJSONPRequest(url, "jsonp");
      d.addCallback(bind(this.onUpdate, this));
      return d
    }

    this.onUpdate = function(response){
      this.similar_artists(response);
    }

  }
});

NowPlaying.data.SimilarArtistsDatasource.prototype = new NowPlaying.utils.DataBean();


Utils.namespace("NowPlaying.data.musicbrainz", {
  ArtistUrlsDatasource : function(artist_mbid){
    this.artist_mbid = artist_mbid;

    this.makeProp("artist_urls");

    this.update = function(){
      if(this.artist_mbid && this.artist_mbid.length > 0){
        var url = NowPlaying.data.Webservice.url("musicbrainz/artist_urls",{artist_mbid : this.artist_mbid});
        var d = sendJSONPRequest(url, "jsonp");
        d.addCallback(bind(this.onUpdate, this));
        return d
      }
    }

    this.onUpdate = function(response){
      this.artist_urls(response.urls);
    }

  }
});

NowPlaying.data.musicbrainz.ArtistUrlsDatasource.prototype = new NowPlaying.utils.DataBean();


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


Utils.namespace("NowPlaying.data", {
  AlbumInfoDatasource : function(npDatasource, aiDatasource){
    this.makeProp("reach");
    this.makeProp("image");
    this.makeProp("album");
    this.makeProp("track_listing");
    this.makeProp("artist");

    npDatasource.connect("album", this, this.album);
    npDatasource.connect("artist", this, this.artist);

    aiDatasource.connect("album_reach", this, this.reach);
    aiDatasource.connect("album_image", this, this.image);
    aiDatasource.connect("album_track_listing", this, this.track_listing);

  }
});

NowPlaying.data.AlbumInfoDatasource.prototype = new NowPlaying.utils.DataBean();


Utils.namespace("NowPlaying.data", {
  ArtistInfoDatasource : function(npDatasource, urlDatasource, wpDatasource){
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
      urlDatasource.update();
    }

    this.updateWikipedia = function(url){
      wpDatasource.url = url;
      wpDatasource.update();
    }

    npDatasource.connect("artist", this, "artist");
    npDatasource.connect("artist_mbid", this, "updateMusicbrainz");
    urlDatasource.connect("artist_urls", this, "onUrlChange");
    wpDatasource.connect("wikipedia_content", this, "wikipedia_content");

  }
});


NowPlaying.data.ArtistInfoDatasource.prototype = new NowPlaying.utils.DataBean();


Utils.namespace("NowPlaying.data", {
  NowPlayingDatasource : function (recentTracksDatasource){
    this.makeProp("album");
    this.makeProp("track");
    this.makeProp("artist");
    this.makeProp("artist_mbid");

    this.onUpdate = function(recent_tracks){
      var now_playing = recent_tracks[0];
      this.track(now_playing.name);
      this.artist(now_playing.artist);
      this.album(now_playing.album);
      this.artist_mbid(now_playing.artist_mbid);
    }

    recentTracksDatasource.connect("recent_tracks", this, "onUpdate");

 }
});

NowPlaying.data.NowPlayingDatasource.prototype = new NowPlaying.utils.DataBean();


Utils.namespace("NowPlaying.data", {
  Webservice : {
    SERVER : "http://localhost:4567",
    url : function(service, options){
      var queryString = MochiKit.Base.queryString(options);
      return this.SERVER + "/" + service + ".js?" + queryString;
    }

  }
});

  Utils.namespace("NowPlaying.ui", {
  TopAlbumsPanel : function(element, datasource){

    this.onChange = function(top_albums){
      element.innerHTML = "";
      var max_reach = top_albums[0].reach;

      top_albums.slice(0, 10).forEach(function(album){
        album_li = document.createElement("li");
        album_li.innerHTML = album.name + " (" + Math.round(100*(album.reach/max_reach)) + "%)";
        //var reach_bar = create_bar((album.reach/max_reach));
        //album_li.appendChild(reach_bar);
        element.appendChild(album_li);
      });
    }

    datasource.connect("top_albums", this, "onChange");
  }
});




function create_bar(float_value){
   var bar = document.createElement("span");
   bar.setAttribute("class", "bar");
   bar.style.paddingRight = Math.floor( float_value*100 ) + "px";

    var green_component = float_value * 2;
    green_component = green_component < 1.0 ? green_component : 1.0;
    var red_component= 2.0 - (float_value * 2.0);
    red_component = red_component < 0.0 ? 0.0 : red_component;
    red_component =  red_component > 1.0 ? 1.0 : red_component;
    bar.style.backgroundColor = Color.fromRGB(red_component, green_component, 0).toHexString();

    return bar;
}

  Utils.namespace("NowPlaying.ui", {
  NowPlayingPanel : function(element, datasource){
    this.element = element;

    this.linkHtml(datasource, "track", "track");
    this.linkHtml(datasource, "album", "album");
    this.linkHtml(datasource, "artist", "artist");

  }
});

NowPlaying.ui.NowPlayingPanel.prototype = new NowPlaying.ui.DataPanel();

  Utils.namespace("NowPlaying.ui", {
  SimilarArtistsPanel : function(element, datasource){

    this.onChange = function(similar_artists){
      element.innerHTML = "";

      similar_artists.slice(0, 10).forEach(function(sim){
        var similar_li = document.createElement("li");
        similar_li.innerHTML = sim.name + " (" + sim.match + "%)";

        //var similarity_bar = create_bar(sim.match/100);
        //similar_li.appendChild(similarity_bar);

        $("similar_artists_list").appendChild(similar_li);
      });

    }

    datasource.connect("similar_artists", this, "onChange");
  }
});

  Utils.namespace("NowPlaying.ui", {
  AlbumInfoPanel : function(element, datasource){
    this.element = element;

    this.linkHtml(datasource, "album", "album");
      function log(a, n){
        return Math.log(a)/Math.log(n);
      }
    this.link(datasource, "reach", "reach", function(el, val){
      el.innerHTML = val;
    });
    this.linkImage(datasource, "image", "album_image");
    this.link(datasource, "track_listing", "track_listing_list", function(el, val){
      el.innerHTML = "";
      val.forEach(function(track){
        var li = document.createElement("li");
        li.innerHTML = track.name;
        el.appendChild(li);
      });
    });
  }
});

NowPlaying.ui.AlbumInfoPanel.prototype = new NowPlaying.ui.DataPanel();

  Utils.namespace("NowPlaying.ui", {
  ArtistInfoPanel : function(element, datasource){
    this.element = element;

    this.linkHtml(datasource, "artist", "artist");
    this.link(datasource, "wikipedia_url", "wikipedia_url", function(el, val){
      el.href = val;
    });
    this.linkHtml(datasource, "wikipedia_content", "wikipedia_content");

  }
});

NowPlaying.ui.ArtistInfoPanel.prototype = new NowPlaying.ui.DataPanel();

