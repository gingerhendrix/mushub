

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
       var self = this;
       datasource.connect(topic, this, function(val){
        var elements = MochiKit.DOM.getElementsByTagAndClassName("*", elementClass, this.element);
        elements.forEach(function(el){
          fn.apply(self, [el, val]);
        });
      });
    }

    this.linkHtml = function(dataSource, topic, elementClass, def){
      this.link(dataSource, topic, elementClass, function(el, val){ el.innerHTML = ( val ? val : def ); });
    }

    this.linkImage = function(dataSource, topic, elementClass){
      this.link(dataSource, topic, elementClass, function(el, val){ el.src = val; });
    }

    this.linkStatus = function(datasource, elementClass){
      datasource.connect("beginUpdate", this, function(){  this.panel.getBottomToolbar().showBusy();  });
      datasource.connect("endUpdate", this, function(){   this.panel.getBottomToolbar().clearStatus();  });
    }
  }
});


Utils.namespace("NowPlaying.data.audioscrobbler", {
  AlbumInfoDatasource : function(artist, album){
    this.artist = artist;
    this.album = album;

    Utils.extend(this, new NowPlaying.data.Datasource(
                                       { service : "audioscrobbler/album_info",
                                         params : ["artist", "album" ]
                                       }));

    this.makeProp("album_reach");
    this.makeProp("album_image");
    this.makeProp("album_track_listing");

    this.onUpdate = function(album){
      this.album_reach(album.reach);
      this.album_image(album.image_small);
      this.album_track_listing(album.tracks);
    }
 }
});

  Utils.namespace("NowPlaying.data.audioscrobbler", {
  TopAlbumsDatasource : function(artist){
    this.artist = artist;
    Utils.extend(this, new NowPlaying.data.Datasource(
                                       { service : "audioscrobbler/top_albums",
                                         params : ["artist"]
                                       }));

    this.makeProp("top_albums");

    this.onUpdate = function(response){
      this.top_albums(response);
    }

  }
});


Utils.namespace("NowPlaying.data.audioscrobbler", {
  RecentTracksDatasource : function (username){
    this.username = username;
    Utils.extend(this, new NowPlaying.data.Datasource(
                                       { service : "audioscrobbler/recent_tracks",
                                         params : ["username"]
                                       }));

    this.makeProp("recent_tracks");


    this.onUpdate = function(response){

      this.recent_tracks(response);
      MochiKit.Signal.signal(this, "endUpdate");
    }
  }
});


Utils.namespace("NowPlaying.data.audioscrobbler", {
  SimilarArtistsDatasource : function(artist){
    Utils.extend(this, new NowPlaying.data.Datasource(
                                       { service : "audioscrobbler/similar_artists",
                                         params : ["artist"]
                                       }));

    this.artist = artist;
    this.makeProp("similar_artists");


    this.onUpdate = function(response){
      this.similar_artists(response);
    }

  }
});

NowPlaying.data.SimilarArtistsDatasource.prototype = new NowPlaying.utils.DataBean();


Utils.namespace("NowPlaying.data.musicbrainz", {
  ArtistUrlsDatasource : function(artist_mbid){
    Utils.extend(this, new NowPlaying.data.Datasource(
                                       { service : "musicbrainz/artist_urls",
                                         params : [{ name : "artist_mbid", prop : "artist_mbid" }]
                                       }));

    this.artist_mbid = artist_mbid;
    this.makeProp("artist_urls");

    this.onUpdate = function(response){
      this.artist_urls(response.urls);
    }

  }
});


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

    npDatasource.connect("beginUpdate", this, function(){ MochiKit.Signal.signal(this, "beginUpdate"); });
    npDatasource.connect("endUpdate", this, function(){ MochiKit.Signal.signal(this, "endUpdate"); });
    aiDatasource.connect("beginUpdate", this, function(){ MochiKit.Signal.signal(this, "beginUpdate"); });
    aiDatasource.connect("endUpdate", this, function(){ MochiKit.Signal.signal(this, "endUpdate"); });
  }
});

NowPlaying.data.AlbumInfoDatasource.prototype = new NowPlaying.utils.DataBean();


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
      MochiKit.Signal.signal(this, "endUpdate");
    }

    recentTracksDatasource.connect("recent_tracks", this, "onUpdate");
    recentTracksDatasource.connect("beginUpdate", this, function(){
       MochiKit.Signal.signal(this, "beginUpdate");
    });
 }
});

NowPlaying.data.NowPlayingDatasource.prototype = new NowPlaying.utils.DataBean();


Utils.namespace("NowPlaying.data", {
  Webservice : {
    SERVER : "http://example.org",
    url : function(service, options){
      var queryString = MochiKit.Base.queryString(options);
      return this.SERVER + "/" + service + ".js?" + queryString;
    }

  }
});


Utils.namespace("NowPlaying.data", {
  Datasource : function(config){
    Utils.extend(this, new NowPlaying.utils.DataBean());

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
      MochiKit.Signal.signal(this, "beginUpdate");
      try{
        params = makeParams(this, config.params);
      }catch(e){
        return;
      }
      var url = NowPlaying.data.Webservice.url(config.service, params);
      var d = sendJSONPRequest(url, "jsonp");
      var self = this;
      d.addCallback(function(response){
          self.onUpdate(response);
          MochiKit.Signal.signal(self, "endUpdate");
      });
      return d;
    }

  }


});

  Utils.namespace("NowPlaying.ui", {
  TopAlbumsPanel : function(element, datasource, config){
     Utils.extend(this, new NowPlaying.ui.ContentPanel({
        	title: 'Top Albums',
        	contentEl:'top_albums',
        	columnWidth: .40,
      }));

    this.onChange = function(top_albums){
      element.innerHTML = "";
      var max_reach = top_albums[0].reach;

      top_albums.slice(0, 8).forEach(function(album){
        var album_li = document.createElement("li");
        var album_img = document.createElement("img");
        album_img.src = album.image_large;
        album_img.width = 130;
        album_img.height = 130;
        var album_label = document.createElement("span");
        album_label.innerHTML = album.name + " (" + Math.round(100*(album.reach/max_reach)) + "%)";
        album_li.appendChild(album_img);
        album_li.appendChild(album_label);
        //var reach_bar = create_bar((album.reach/max_reach));
        //album_li.appendChild(reach_bar);
        element.appendChild(album_li);
      });
    }
    this.linkStatus(datasource);
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
    Utils.extend(this, Utils.Extendable);
    this.extend(new NowPlaying.ui.DataPanel());
    this.extend(this, new NowPlaying.ui.ContentPanel({
        	title: 'Now Playing',
        	contentEl:'now_playing',
          region:'north',
          height: 120,
          margins: '20 20 0 20',
    }));
    this.element = element;

    this.linkHtml(datasource, "track", "track");
    this.linkHtml(datasource, "album", "album", "unknown");
    this.linkHtml(datasource, "artist", "artist");

    this.linkStatus(datasource);
  }
});

  Utils.namespace("NowPlaying.ui", {
  SimilarArtistsPanel : function(element, datasource){
    Utils.extend(this, new NowPlaying.ui.ContentPanel({
          title: 'Similar Artists',
        	contentEl:'similar_artists',
        	columnWidth: .40,
          })
    );


    this.onChange = function(similar_artists){
      element.innerHTML = "";

      function makeThumbnail(artist, clazz, size, label){
        var similar_li = document.createElement("li");
        similar_li.setAttribute("class", clazz);

        var artist_img = document.createElement("img");
        artist_img.src = artist.image;
        artist_img.title = artist.name + " (" + artist.match + "%)";
        artist_img.width = size;
        artist_img.height = size;
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
        $("similar_artists_list").appendChild(similar_li);
      });

      similar_artists.slice(4, 20).forEach(function(sim){
        var similar_li = makeThumbnail(sim, "medium", 65, false);
        $("similar_artists_list").appendChild(similar_li);
      });

      similar_artists.slice(20, 84).forEach(function(sim){
        var similar_li = makeThumbnail(sim, "small", 33, false);
        $("similar_artists_list").appendChild(similar_li);
      });

    }

    datasource.connect("similar_artists", this, "onChange");
    this.linkStatus(datasource);
  }
});

  Utils.namespace("NowPlaying.ui", {
  AlbumInfoPanel : function(element, datasource){
    this.element = element;
    Utils.extend(this, new NowPlaying.ui.ContentPanel({
      title: 'Album Info',
      columnWidth: 0.4,
      contentEl:'album_info',
    }));

    this.link(datasource, "album", "album", function(el, album){
      if(!album || album == ""){
        MochiKit.DOM.addElementClass(this.element, "error");
        el.innerHTML = "Unknown Album";
      }else{
       MochiKit.DOM.removeElementClass(this.element, "error");
      }
    });

    this.linkHtml(datasource, "reach", "reach");

    this.linkStatus(datasource);

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
    Utils.extend(this, new NowPlaying.ui.ContentPanel({
          title: 'Wikipedia',
        	contentEl:'artist_wikipedia',
    }));

    this.linkStatus(datasource, "status");

    this.linkHtml(datasource, "artist", "artist");
    this.link(datasource, "wikipedia_url", "wikipedia_url", function(el, val){
      el.href = val;
    });
    this.linkHtml(datasource, "wikipedia_content", "wikipedia_content");

  }
});

  Utils.namespace("NowPlaying.ui", {
  ContentPanel : function(config){
    Utils.extend(this, new NowPlaying.ui.DataPanel());
    config =  Utils.extend( {
          cls : 'contentpanel',
          bbar: new Ext.StatusBar()
        }, config);
    this.panel = new Ext.Panel(config);

  }
});

