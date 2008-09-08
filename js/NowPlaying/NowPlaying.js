

  Utils.namespace("NowPlaying.utils", {
 DataBean : function(){
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
      datasource.connect("endUpdate", this, function(){
      this.panel.body.setVisibilityMode(Element.DISPLAY);
      this.panel.body.setVisible(true);
        this.panel.getBottomToolbar().clearStatus();
      });
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
      this.album_image(album.image_large);
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
      //alert("TopAlbums : " + this.artist + ".onUpdate " + response);
      this.top_albums(response.top_albums);
    }

    this.toString = function(){
      return "TopAlbumsDatasource[" + this.artist + "]";
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
      this.similar_artists(response.similar_artists);
    }

  }
});

NowPlaying.data.SimilarArtistsDatasource.prototype = new NowPlaying.utils.DataBean();


Utils.namespace("NowPlaying.data.audioscrobbler", {
  UserInfoDatasource : function(username){
    this.username = username;

    Utils.extend(this, new NowPlaying.data.Datasource(
                                       { service : "audioscrobbler/user_info",
                                         params : ["username"]
                                       }));

    this.makeProp("country");
    this.makeProp("url");
    this.makeProp("avatar");

    this.onUpdate = function(user){
      this.country(user.country);
      this.url(user.url);
      this.avatar(user.avatar);
    }
 }
});


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


Utils.namespace("NowPlaying.data.musicbrainz", {
  ArtistMembersDatasource : function(artist_mbid){
    Utils.extend(this, new NowPlaying.data.Datasource(
                                       { service : "musicbrainz/artist_members",
                                         params : [{ name : "artist_mbid", prop : "artist_mbid" }]
                                       }));

    this.artist_mbid = artist_mbid;
    this.makeProp("artist_relations");

    this.onUpdate = function(response){
      this.artist_relations(response.relations);
    }

  }
});

  Utils.namespace("NowPlaying.data.musicbrainz", {
  ArtistSearchDatasource : function(query){
    Utils.extend(this, new NowPlaying.data.Datasource(
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
  UserDatasource : function (){
    Utils.extend(this, new NowPlaying.utils.DataBean());
    var updateTimer = false;
    var self = this;

    this.makeProp("username");

    this.recent_tracks = new NowPlaying.data.audioscrobbler.RecentTracksDatasource();
    this.user_info = new NowPlaying.data.audioscrobbler.UserInfoDatasource();
    this.now_playing = new NowPlaying.data.NowPlayingDatasource(this.recent_tracks, this.user_info);

    this.onError = function(e){
      this.signal("onError", this, e);
    }


    this.user_info.connect("onError", this, "onError");
    this.recent_tracks.connect("onError",  this, "onError" );
    this.now_playing.connect("onError",  this, "onError" );

    this.connect("username", this, function(username){
          self.user_info.username = username;
          self.recent_tracks.username = username;
          self.user_info.update();
          self.recent_tracks.update();
          if(updateTimer){  window.clearInterval(updateTimer); }
          updateTimer = window.setInterval(function(){
            self.recent_tracks.update();
          }, 30000);
        });

  }




});


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
             self.wikipedia_url(url);
             self.updateWikipedia(url);
          }
        });
        if(!foundEn){
          self.wikipedia_url(wikipedia_urls[0]);
          self.updateWikipedia(wikipedia_urls[0]);
        }
      }else{
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


Utils.namespace("NowPlaying.data", {
  NowPlayingDatasource : function (recentTracksDatasource, userInfoDatasource){
    Utils.extend(this, new NowPlaying.utils.DataBean());
    this.makeProp("album");
    this.makeProp("track");
    this.makeProp("artist");
    this.makeProp("artist_mbid");
    this.makeProp("avatar");

    this.onUpdate = function(recent_tracks){
      var now_playing = recent_tracks[0];
      this.track(now_playing.name);
      this.artist(now_playing.artist);
      this.album(now_playing.album);
      this.artist_mbid(now_playing.artist_mbid);
      MochiKit.Signal.signal(this, "endUpdate", this);
    }

    recentTracksDatasource.connect("recent_tracks", this, "onUpdate");
    recentTracksDatasource.connect("beginUpdate", this, function(){
       MochiKit.Signal.signal(this, "beginUpdate");
    });
    userInfoDatasource.connect("avatar", this, "avatar");
    userInfoDatasource.connect("endUpdate", this, function(){
       MochiKit.Signal.signal(this, "endUpdate", this);
    });
 }
});


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
      console.log("Datasource.update : %o ", this);
      MochiKit.Signal.signal(this, "beginUpdate");
      this.isLoading = true;
      try{
        params = makeParams(this, config.params);
      }catch(e){
        return;
      }
      var url = NowPlaying.data.Webservice.url(config.service, params);
      var d = sendJSONPRequest(url, "jsonp");
      var self = this;
      d.addCallback(function(response){
          console.log("Datasource[anonymous callback] : %o : %o", self, response);
          self.isLoading = false;
          self.isError = false;
          if(response.error){
            self.isError = true;
            MochiKit.Signal.signal(self, "onError", response.error);
          }else{
            self.onUpdate(response);
            MochiKit.Signal.signal(self, "endUpdate");
          }
      });
      d.addErrback(function(response){
        self.isError = true;
        MochiKit.Signal.signal(self, "onError", response);
        //self.onUpdate(response);
        console.error("Datasource[anon errback] : %o : %o", self, response);
      });
      return d;
    }

  }


});


Utils.namespace("NowPlaying.data", {
  ApplicationDatasource : function(){
        var self = this;

        var Data = NowPlaying.data;
        var AS = NowPlaying.data.audioscrobbler;
        var MB = NowPlaying.data.musicbrainz;
        var WP = NowPlaying.data.wikipedia;

        this.onError = function(){
          alert("Error!");
        }


        this.user = new Data.UserDatasource();
        this.user.connect("onError", this, "onError");

        this.now_playing_tab = new Data.ArtistTabDatasource();
        this.user.now_playing.connect("endUpdate",
                                  function(data){
                                    if(self.now_playing_tab.artist != data.artist()
                                    || self.now_playing_tab.artist_mbid != data.artist_mbid() ){

                                          self.now_playing_tab.artist = data.artist();
                                          self.now_playing_tab.artist_mbid = data.artist_mbid();
                                          self.now_playing_tab.update();
                                    }
                                  });

  }
});


Utils.namespace("NowPlaying.data", {
  ArtistTabDatasource : function(artist, artist_mbid){
     Utils.extend(this, new NowPlaying.utils.DataBean());

     this.artist = artist;
     this.artist_mbid = artist_mbid;

     var Data = NowPlaying.data;
     var AS = NowPlaying.data.audioscrobbler;
     var MB = NowPlaying.data.musicbrainz;

     this.top_albums = new AS.TopAlbumsDatasource();
     this.similar_artists = new AS.SimilarArtistsDatasource();
     this.artist_info =  new Data.ArtistInfoDatasource();
     this.artist_links = new MB.ArtistUrlsDatasource();
     this.artist_members =  new MB.ArtistMembersDatasource();

     this.update = function(){

       this.top_albums.artist = this.artist;
       this.top_albums.update();
       this.similar_artists.artist = this.artist;
       this.similar_artists.update();
       this.artist_links.artist_mbid = this.artist_mbid;
       this.artist_links.update();
       this.artist_info.artist_mbid = this.artist_mbid;
       this.artist_info.update();
       this.artist_members.artist_mbid = this.artist_mbid;
       this.artist_members.update();

       MochiKit.Signal.signal(this, "endUpdate", this);
     }
  }
});

  Utils.namespace("NowPlaying.ui.tabs", {
  ArtistTab : Ext.extend(Ext.Panel, {
      title : "Artist Info",
      autoWidth : false,
      width: 960,
      active: true,
      autoScroll : true,
      deferredRender : false,
      closable : true,
      initComponent : function(){
       var UI = NowPlaying.ui;
       var Panels = UI.panels;
       var Tabs = UI.tabs;
       var Data = NowPlaying.data;

       var top_albums = new Panels.TopAlbumsPanel({datasource : this.datasource.top_albums });
       var similar_artists = new Panels.SimilarArtistsPanel({datasource : this.datasource.similar_artists});
       //var album_info = new UI.AlbumInfoPanel($("album_info"), new Data.AlbumInfoDatasource(this.datasource.now_playing, this.datasource.album_info));
       var artist_info = new Panels.ArtistInfoPanel({datasource : this.datasource.artist_info});
       var artist_links = new Panels.ArtistLinksPanel({datasource : { musicbrainz : this.datasource.artist_links, torrents : this.datasource}});
       var artist_members = new Panels.ArtistMembersPanel({datasource : this.datasource.artist_members});


       var artistInfoPanel = new Ext.Panel({
          border: false,
         	autoScroll: true,
         	layout : "column",
        	items : [{ border: false, width: 660, items : [ artist_info, similar_artists ] },
        	         { border: false, width: 170, items : [ top_albums] },
        	         { border: false, width: 170, items : [ artist_links, artist_members] },

        	        ]
        });

        this.items = [artistInfoPanel];
        Tabs.ArtistTab.superclass.initComponent.apply(this, arguments);
      }
  })
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
  ApplicationUI : function(datasource){
    this.datasource = datasource;

    var UI = NowPlaying.ui;
    var Panels = UI.panels;
    var Tabs = UI.tabs;
    var Windows = UI.windows;

    var Data = NowPlaying.data;
    var appUI = Utils.namespace("NowPlaying.Application.ui");
    var appData = NowPlaying.Application.data;

   /* this.topbar = new Panels.UsernamePanel({
          region:'north',
        	width: 800,
    });
     */
    this.userPanel = new Panels.UserPanel({datasource : datasource.user});

    this.searchPanel = new Panels.SearchPanel();

  //  var datasource1 = new Data.ArtistTabDatasource("Twisted Sister", "c6122fee-089f-41c4-a34f-e5f7e5607b05");
  //  var datasource2 = new Data.ArtistTabDatasource("The Flower Kings", "0a389268-6fd8-4f8c-ab6e-0dba5ecec66b");

    this.tabPanel = new Ext.TabPanel({
          region : 'center',
          margins: '20 20 0 20',
          activeTab : 0,
          deferredRender : false,
          items : [new Tabs.ArtistTab({title : "Now Playing",
                                       datasource : this.datasource.now_playing_tab,
                                       closable : false }),
                  ]
    });

   // datasource1.update();
   // datasource2.update();

    this.viewport = new Ext.Viewport({
               layout : 'border',
               items:  [new Ext.Panel({
                           layout: 'border',
                           region : 'center',
                           items: [ { region : 'north', height: 140, baseCls : '', type : "Ext.Panel", items : [this.searchPanel, this.userPanel] },
                                    this.tabPanel
                                  ]
                         })
                      ]
    });

    this.openArtistTab = function(artist_name, artist_mbid){
      var datasource = new Data.ArtistTabDatasource(artist_name, artist_mbid);
      console.log("datasource: %o", datasource);
      var tab = new Tabs.ArtistTab({title: artist_name, datasource : datasource });
      this.tabPanel.add(tab);
      this.tabPanel.activate(tab);
      this.tabPanel.doLayout();
      datasource.update();
    }

    this.openAlbumWindow = function(artist, album, mbid){
      var datasource = new Data.audioscrobbler.AlbumInfoDatasource(artist, album);
      var window = new Windows.AlbumInfoWindow({title : album, datasource : datasource, modal : false});
      //this.tabPanel.getActiveTab().add(window);
      datasource.update();
      window.show();
    }

    this.openRecentTracksWindow = function(){
      var datasource = this.datasource.user.recent_tracks;
      var window = new Windows.RecentTracksWindow({datasource: datasource});
      window.show();
    }
  }
});

  Utils.namespace("NowPlaying.ui.windows", {
  AlbumInfoWindow : Ext.extend(Ext.Window, {
    title: 'Album Info',
    ctCls : 'album_info_window',
    width: 640,
    closable: true,
    autoHeight : true,
    initComponent : function(){
      this.datasource.connect("beginUpdate", this, "onChange");
      this.datasource.connect("endUpdate", this, "onChange");
      this.datasource.connect("error", this, "onError");

      NowPlaying.ui.windows.AlbumInfoWindow.superclass.initComponent.apply(this, arguments);
    },
    onChange : function(data){
      this.updateContent();
    },
    onError : function(error){
      this.contentEl.innerHTML = "" + error + "<br/>";
      return;
    },
    updateContent : function(){
      if(!this.body){
         return;
      }
      if(!this.contentEl){
        this.contentEl = document.createElement("div");
        this.contentEl.setAttribute("class", "album_info");
        this.body.appendChild(this.contentEl);
      }

      if(this.datasource.isLoading ){
        this.contentEl.innerHTML = "Loading...";
        return;
      }
      if( this.datasource.isError ){
        this.contentEl.innerHTML = "<div> Error Loading Data </div>";
        return;
      }

      this.contentEl.innerHTML = "";
      this.contentEl.innerHTML += "<img src='"+this.datasource.album_image()+"'/>";
      var tracks = this.datasource.album_track_listing();
      var track_listing = "<ol class='track_listing' >";

      for(var i=0; i<tracks.length; i++){
        var track = tracks[i];
        track_listing += "<li>"+ track.name +"</li>";
      }
      track_listing += "</ol>"
      this.contentEl.innerHTML += track_listing;
      return;


    },
    onRender : function(ct, position){
      console.log("ArtistInfoPanel: onRender");
      NowPlaying.ui.windows.AlbumInfoWindow.superclass.onRender.apply(this, arguments);
//      this.updateContent();
   }
  })
});

  Utils.namespace("NowPlaying.ui.windows", {
  RecentTracksWindow : Ext.extend(Ext.Window, {
    title: 'Recent Tracks',
    ctCls : 'recent_tracks_window',
    width: 640,
    closable: true,
    autoHeight : true,
    initComponent : function(){
      this.datasource.connect("beginUpdate", this, "onChange");
      this.datasource.connect("endUpdate", this, "onChange");
      this.datasource.connect("error", this, "onError");

      NowPlaying.ui.windows.RecentTracksWindow.superclass.initComponent.apply(this, arguments);
    },
    onChange : function(data){
      this.updateContent();
    },
    onError : function(error){
      this.contentEl.innerHTML = "" + error + "<br/>";
      return;
    },
    updateContent : function(){
      if(!this.body){
         return;
      }
      if(!this.contentEl){
        this.contentEl = document.createElement("div");
        this.contentEl.setAttribute("class", "album_info");
        this.body.appendChild(this.contentEl);
      }

      if(this.datasource.isLoading ){
        this.contentEl.innerHTML = "Loading...";
        return;
      }
      if( this.datasource.isError ){
        this.contentEl.innerHTML = "Error Loading Data";
        return;
      }
      var recent_tracks = this.datasource.recent_tracks();
      if(!recent_tracks || recent_tracks.length == 0 ){
         this.contentEl.innerHTML = "No recent tracks found.";
      }
      var track_list = "<table>";
      var self = this;
      recent_tracks.forEach(function(track){
        track_list += "<tr><td class='artist'>"+track.artist+"</td> <td class='track'>"+track.name+"</td><td class='time'>"+self.prettyDateDifference(track.date_uts)+"</td></tr>";
      });
      track_list += "</table>";
      this.contentEl.innerHTML = track_list;

    },
    onRender : function(ct, position){
      NowPlaying.ui.windows.RecentTracksWindow.superclass.onRender.apply(this, arguments);
      this.updateContent();
   },
   prettyDateDifference : function(uts_date){
      var now = (new Date()).getTime()/1000;
      console.log("DateDifference " + now + " : " + uts_date);
      var difference = now - Number(uts_date);
      if(difference > 3600*24*2){
        var days = Math.floor(difference/(3600*24));
        return days + "days ago";
      }if(difference > 3600*24){
        var days = Math.floor(difference/(3600*24));
        var hrs =  Math.round((difference - (days*3600*24))/3600);
        return days + "day " + hrs + "hrs ago";
      }else if(difference > 3600){
        var hrs =  Math.round(difference/3600);
        return hrs + "hrs ago";
      }else if(difference > 60){
         return Math.round(difference/60) + "mins ago";
      }else{
         return Math.round(difference) + "s ago";
      }

   },
  })
});

  Utils.namespace("NowPlaying.ui.panels", {
  UserLoginPanel : Ext.extend(Ext.Panel, {
        cls : 'user_login_panel',
        onRender : function(ct, position){
          NowPlaying.ui.panels.UserLoginPanel.superclass.onRender.apply(this, arguments);

          if(!this.contentEl){
            this.contentEl = document.createElement("div");
            this.contentEl.setAttribute("class", "user_login");
            this.body.appendChild(this.contentEl);
          }
          this.contentEl.innerHTML = "";
          this.contentEl.innerHTML += "<img src='images/custom/lastfm.png' width='103' height='50'></img>";
          this.contentEl.innerHTML += "<h3>Connect to Last.fm</h3>";
          this.contentEl.innerHTML += "<input type='text' value='lastfm username' onchange='NowPlaying.Application.updateUsername(this.value);'></input>";

        }
  })
});

  Utils.namespace("NowPlaying.ui.panels", {
  ArtistInfoPanel : Ext.extend(Ext.Panel, {
    title: 'Wikipedia',
    cls : 'contentpanel',
    ctCls : 'artist_wikipedia',
    width: 640,
    autoHeight : true,
    initComponent : function(){
      this.datasource.connect("beginUpdate", this, "onChange");
      this.datasource.connect("endUpdate", this, "onChange");
      this.datasource.connect("error", this, "onError");

      NowPlaying.ui.panels.ArtistInfoPanel.superclass.initComponent.apply(this, arguments);
    },
    onChange : function(data){
      this.updateContent();
    },
    onError : function(error){
      this.contentEl.innerHTML = "" + error + "<br/>";
      return;
    },
    updateContent : function(){
      if(!this.body){
         return;
      }
      if(!this.contentEl){
        this.contentEl = document.createElement("div");
        this.contentEl.setAttribute("class", "wikipedia_content");
        this.body.appendChild(this.contentEl);
      }

      if(this.datasource.isLoading ){
        this.contentEl.innerHTML = "Loading...";
        return;
      }
      if( this.datasource.isError ){
        this.contentEl.innerHTML = "<div> Error Loading Data </div>";
        return;
      }
      if( !this.datasource.wikipedia_content() ){
        this.contentEl.innerHTML = "Data not loaded";
        return;
      }

      this.contentEl.innerHTML = this.datasource.wikipedia_content();
    },
    onRender : function(ct, position){
      console.log("ArtistInfoPanel: onRender");
      NowPlaying.ui.panels.ArtistInfoPanel.superclass.onRender.apply(this, arguments);
//      this.updateContent();
   }
  })
});

  Utils.namespace("NowPlaying.ui.panels", {
  ArtistLinksPanel : Ext.extend(Ext.Panel, {
    title: 'Links',
    cls : 'contentpanel',
    layout : 'accordion',
    width: 160,
    initComponent : function(){
      this.items = [new NowPlaying.ui.panels.MusicbrainzLinksPanel( { datasource : this.datasource.musicbrainz } ),
                    new NowPlaying.ui.panels.TorrentSearchPanel({ datasource : this.datasource.torrents })];

      NowPlaying.ui.panels.ArtistLinksPanel.superclass.initComponent.apply(this, arguments);

    },
  })
});

  Utils.namespace("NowPlaying.ui.panels", {
  ArtistMembersPanel : Ext.extend(Ext.Panel, {
    title: 'Related Artists',
    cls : 'contentpanel',
    layout : 'accordion',
    width: 160,
    initComponent : function(){
      this.datasource.connect("endUpdate", this, "onChange");
      NowPlaying.ui.panels.ArtistMembersPanel.superclass.initComponent.apply(this, arguments);
    },
    onChange : function(data){
      this.updateContent();
    },
    updateContent : function(){
      var rels = this.datasource.artist_relations();
      if(!rels || rels.length == 0){
        return;
      }
      if(this.datasource.isLoading && this.body){
        this.items.clear();
        this.body.innerHTML = "Loading";
        return;
      }

      this.items.clear();
      var groups = { "MemberOfBand-backward" : { displayName : "Band Members", members : [] },
                     "MemberOfBand-both" : { displayName : "Member of Band", members : [] },
                     "Collaboration-both" : {displayName : "Collaborations", members : [] },
                     "Collaboration-backward" : {displayName : "Collaborations", members : [] }
                    };
      var groupKeys = ["MemberOfBand-backward", "MemberOfBand-both", "Collaboration-both", "Collaboration-backward"];

      for(var i=0; i< rels.length; i++){
        var rel = rels[i];
        var key = rel.type + "-" + rel.direction;
        var group = groups[key];
        if(!group){
           console.log("Creating new key " + key);
           groups[key] = {
              displayName : rel.type,
              members : []
            }
            group = groups[key];
            groupKeys.push(key);
        }
        group.members.push(rel);
      }

      for(var j=0; j< groupKeys.length; j++){
        var group = groups[groupKeys[j]];
        if(!group){ alert("Group " + groupKeys[j] + " not defined"); return;  };
        if(group.members.length > 0){
          this.addSubPanel(group.displayName, group.members)
        }
      }
      this.doLayout();
    },
    addSubPanel : function(name, members){
      var data = {members : members, type: name};
      var store = new Ext.data.JsonStore({
        data : data,
        root : 'members',
        fields : ['name', 'type', 'mbid', 'beginDate', 'endDate']
      });
      var tpl = new Ext.XTemplate(
        '<ul class="relations">',
        '<tpl for=".">',
        '<li class="relation">',
        '{name}',
        '</li>',
        '</tpl>',
        '</ul>'
      );
      items = new Ext.DataView({
          autoHeight: true,
          store: store,
          tpl : tpl,
          overClass:'x-view-over',
          itemSelector: "li.relation"
        });
     var subPanel = new Ext.Panel({
        title: name,
        autoHeight: true,
        items :  items
      });
      items.on("click", function(dataview, index, node, e){
        NowPlaying.Application.ui.openArtistTab(store.getAt(index).get('name'), store.getAt(index).get('mbid'));
      });
      this.add(subPanel);
    },
    onRender : function(ct, position){
      NowPlaying.ui.panels.ArtistMembersPanel.superclass.onRender.apply(this, arguments);
      this.updateContent();
   }
  })
});

  Utils.namespace("NowPlaying.ui.panels", {
  ContentPanel : function(config){
    Utils.extend(this, new NowPlaying.ui.DataPanel());
    config =  Utils.extend( {
          cls : 'contentpanel',
          bbar: new Ext.StatusBar()
        }, config);
    this.panel = new Ext.Panel(config);

  }
});

  Utils.namespace("NowPlaying.ui.panels", {
    TopAlbumsPanel : Ext.extend(Ext.Panel, {
       	title: 'Top Albums',
        cls : 'contentpanel',
        width: 160,
        initComponent : function(){
            this.datasource.connect("top_albums", this, "onChange");
            NowPlaying.ui.panels.TopAlbumsPanel.superclass.initComponent.apply(this, arguments);
        },
        onChange : function(top_albums){
          this.top_albums = top_albums;
          this.updateContent();
        },
        updateContent : function(){
         console.log("TopAlbumsPanel.updateContent");
         if(!this.body){
        //   console.log("TopAlbumsPanel: Body not yet defined");
           return;
         }

         var self = this;
          if( !this.top_albums ){
            this.body.innerHTML = "Data not loaded";
            return;
          }
          var max_reach = this.top_albums[0] ? this.top_albums[0].reach : 0;
          if(!this.albumList){
              this.albumList = document.createElement("ol");
              this.albumList.setAttribute("class", "top_albums");
              this.body.appendChild(this.albumList);
          }else{
            this.albumList.innerHTML = "";
          }


          this.top_albums.slice(0, 8).forEach(function(album){
            var album_li = document.createElement("li");
            var album_img = document.createElement("img");
            album_img.src = album.image_large;
            album_img.width = 130;
            album_img.height = 130;
            album_img.style.cursor = "pointer";
            album_img.addEventListener("click", function(){
              NowPlaying.Application.ui.openAlbumWindow(album.artist, album.name, album.mbid);
            }, false);
            var album_label = document.createElement("span");
            album_label.innerHTML = album.name + " (" + Math.round(100*(album.reach/max_reach)) + "%)";
            album_li.appendChild(album_img);
            album_li.appendChild(album_label);
            //var reach_bar = create_bar((album.reach/max_reach));
            //album_li.appendChild(reach_bar);
            self.albumList.appendChild(album_li);
          });
        },

        onRender : function(ct, position){
           console.log("TopAlbumsPanel.onRender");
           NowPlaying.ui.panels.TopAlbumsPanel.superclass.onRender.apply(this, arguments);
           this.updateContent();
       }
    }),
});

  Utils.namespace("NowPlaying.ui.panels", {
  SearchPanel : Ext.extend(Ext.Panel, {
    title: '',
    baseCls: '',
    cls : 'search_panel',
    width: 640,
    height: 140,
    initComponent : function(){
       //this.datasource.connect("endUpdate", this, "onUpdate");
       NowPlaying.ui.panels.TorrentSearchPanel.superclass.initComponent.apply(this, arguments);
    },

    onUpdate : function(data){
      this.results =  this.datasource.search_results();
      this.searchInput.disabled = false;
      this.loadingEl.style.visibility = "hidden";
      this.updateContent();
    },

    onSearch : function(query){
      this.searchInput.disabled = true;
      this.loadingEl.style.visibility = "visible";
      this.datasource = new NowPlaying.data.musicbrainz.ArtistSearchDatasource();
      this.datasource.query = query;
      this.datasource.connect("endUpdate", this, "onUpdate");
      this.datasource.update();
    },

    updateContent : function(){
      var self = this;
      if(!this.body){
         return;
      }
      if(!this.contentEl){
        this.contentEl = document.createElement("div");
        this.contentEl.setAttribute("class", "artist_search");
        this.body.appendChild(this.contentEl);
      }
      if(!this.searchEl){
         this.searchEl = document.createElement("div");
         this.searchEl.setAttribute("class", "search_form");

         this.searchInput = document.createElement("input");
         this.searchInput.setAttribute("value", "Search for an Artist");
         this.searchInput.setAttribute("class", "default");
         var defaultListener = function(){
            this.setAttribute("class", "");
            this.value = "";
            this.removeEventListener("focus", defaultListener, false);
         };
         this.searchInput.addEventListener("focus", defaultListener, false);

         this.searchInput.setAttribute("type", "text");
         this.searchInput.addEventListener("change", function(){
            self.onSearch(this.value);
         }, false);
         this.searchEl.appendChild(this.searchInput);

         this.loadingEl = document.createElement("img");
         this.loadingEl.setAttribute("src", "images/custom/loading.gif");
         this.loadingEl.setAttribute("width", 18);
         this.loadingEl.setAttribute("height", 18);
          this.searchEl.appendChild(this.loadingEl);
         this.loadingEl.style.visibility = "hidden";

        this.contentEl.appendChild(this.searchEl);
      }
      if(!this.resultsEl){
         this.resultsEl = document.createElement("div");
         this.resultsEl.setAttribute("class", "search_results");
         this.contentEl.appendChild(this.resultsEl);
      }
      this.resultsEl.innerHTML = "";
      if(this.results && this.results.length > 0){
        var span = document.createElement("span");
        span.setAttribute("class","title");
        span.innerHTML = "Search Results:"
        this.resultsEl.appendChild(span);

        var list = document.createElement("ol");
        for(var i=0; i<this.results.length; i++){
          var result = this.results[i]
          var li = document.createElement("li");
          li.innerHTML = result.artist_name + "<span class='score'>" + result.score + "%</span>";
          (function(result){
            li.addEventListener("click", function(){
               NowPlaying.Application.ui.openArtistTab(result.artist_name, result.artist_mbid);
            }, false);
          })(result);
          list.appendChild(li);
        }
        this.resultsEl.appendChild(list);
      }
    },

    onRender : function(ct, position){
      NowPlaying.ui.panels.TorrentSearchPanel.superclass.onRender.apply(this, arguments);
      this.updateContent();
   }
  })
});

  Utils.namespace("NowPlaying.ui.panels", {
  SimilarArtistsPanel :  Ext.extend(Ext.Panel, {
          title: 'Similar Artists',
        	height: 520,
          width: 640,
        	//autoScroll: true,
        	showQuilt : true,
 	        cls : 'contentpanel',
          ctCls : 'similar_artists',
          initComponent : function(){
             this.datasource.connect("similar_artists", this, "onChange");
             // this.linkStatus(datasource);
             NowPlaying.ui.SimilarArtistsPanel.superclass.initComponent.apply(this, arguments);
          },
          onChange : function(similar_artists){
            this.similar_artists = similar_artists;
            this.redraw();
          },

          redraw : function(){
            if(!this.body){ return; }

            Ext.get(this.body).removeClass("quilt");
            Ext.get(this.body).removeClass("table");
            if(this.showQuilt){
                this.similarArtistsQuilt(this.similar_artists);
            }else{
              this.similarArtistsTable(this.element, this.similar_artists);
            }
          },

          onRender : function(ct, pos){
             NowPlaying.ui.SimilarArtistsPanel.superclass.onRender.apply(this, arguments);
//             this.body.parentNode.insertBefore(makeViewMenu(), this.body);

          },

          makeViewMenu : function(element){
            var view_menu = document.createElement("div");
            view_menu.setAttribute("class", "view_menu");

            var quiltButton = document.createElement("img");
            quiltButton.src = "images/custom/quilt-icon.png"
            quiltButton.width = 36;
            quiltButton.height = 36;
            quiltButton.addEventListener("click",toggleView, false);
            view_menu.appendChild(quiltButton);

            var tableButton = document.createElement("img");
            tableButton.src = "images/custom/table-icon.png"
            tableButton.width = 36;
            tableButton.height = 36;
            tableButton.addEventListener("click", toggleView, false);
            view_menu.appendChild(tableButton);

            return view_menu
          },

          toggleView : function(){
              showQuilt = !showQuilt;
              this.redraw()
          },

          onArtistClick : function(artist){
            NowPlaying.Application.ui.openArtistTab(artist.name, artist.mbid);
          },
          similarArtistsQuilt : function(similar_artists){
              var self  = this;
              if(this.quilt){
                var element = this.quilt;
                element.innerHTML = "";
              }else{
                this.quilt = document.createElement("ol");
                this.quilt.setAttribute("class", "quilt");
                this.body.appendChild(this.quilt);
                var element = this.quilt;
              }

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
              element.appendChild(similar_li);
            });

            similar_artists.slice(4, 20).forEach(function(sim){
              var similar_li = makeThumbnail(sim, "medium", 65, false);
              element.appendChild(similar_li);
            });

            similar_artists.slice(20, 84).forEach(function(sim){
              var similar_li = makeThumbnail(sim, "small", 33, false);
              element.appendChild(similar_li);
            });
          },

          similarArtistsTable : function(element, similar_artists){
            Ext.get(element).addClass("table");

            similar_artists.forEach(function(artist){
              var similar_li = document.createElement("li");

              var artist_img = document.createElement("img");
              artist_img.src = artist.image;
              artist_img.title = artist.name + " (" + artist.match + "%)";
              artist_img.width = 65;
              artist_img.height = 65;
              similar_li.appendChild(artist_img);

              var artist_label = document.createElement("span");
              artist_label.setAttribute("class", "artist");
              artist_label.innerHTML = artist.name;
              similar_li.appendChild(artist_label);

              var match_bar = document.createElement("span");
              match_bar.setAttribute("class", "match_bar");
              var match_bar_inner = document.createElement("span");
              match_bar_inner.setAttribute("class", "match_bar_inner");
              match_bar_inner.style.width = (5 + Number(artist.match)*1.5) + "px";
              match_bar_inner.innerHTML = "&nbsp;";
              match_bar.appendChild(match_bar_inner);
              similar_li.appendChild(match_bar);

              var artist_match = document.createElement("span");
              artist_match.setAttribute("class", "match");
              artist_match.innerHTML = "" + artist.match + "%";
              similar_li.appendChild(artist_match);

              element.appendChild(similar_li);
            });
         }
    })
});

  Utils.namespace("NowPlaying.ui.panels", {
  TorrentSearchPanel : Ext.extend(Ext.Panel, {
    title: 'Torrent Search',
    autoHeight : true,
    initComponent : function(){
       this.datasource.connect("endUpdate", this, "onUpdate");
       NowPlaying.ui.panels.TorrentSearchPanel.superclass.initComponent.apply(this, arguments);
    },

    onUpdate : function(data){
      this.artist = data.artist;
      this.updateContent();
    },

    updateContent : function(){
      if(!this.body){
         return;
      }
      if(!this.contentEl){
        this.contentEl = document.createElement("ul");
        this.contentEl.setAttribute("class", "torrent_search");
        this.body.appendChild(this.contentEl);
      }
      this.contentEl.innerHTML = "";
      var urls = [ {title : "STmusic", href : "http://www.stmusic.org/browse.php?search=" + this.artist },
                   {title : "mininova", href : "http://www.mininova.org/search/?search=" + this.artist },
                   {title : "The Pirate Bay", href : "http://thepiratebay.org/search/" + this.artist } ]
      for(var i=0; i< urls.length; i++){
        var li = document.createElement("li");
        var a = document.createElement("a");
        a.setAttribute("target", "_new");
        a.setAttribute("href", urls[i].href);
        a.innerHTML =  urls[i].title;
        li.appendChild(a);
        this.contentEl.appendChild(li);
      }
    },

    onRender : function(ct, position){
      NowPlaying.ui.panels.TorrentSearchPanel.superclass.onRender.apply(this, arguments);
      this.updateContent();
   }
  })
});

  Utils.namespace("NowPlaying.ui.panels", {
  UserPanel : Ext.extend(Ext.Panel, {
      title: 'User',
      height: 120,
      width: 320,
      layout: 'fit',
      cls : 'user_panel',
      initComponent : function(){
        NowPlaying.ui.panels.UserPanel.superclass.initComponent.apply(this, arguments);
        this.datasource.connect("username", this, "onChange");
        this.onChange();
      },
      onChange : function(){
        if(this.subPanel){
          this.remove(this.subPanel);
        }
        if(this.datasource.username()){
          this.subPanel = new NowPlaying.ui.panels.UserInfoPanel({datasource : this.datasource.now_playing})
          this.setTitle("User Info " + this.datasource.username());
          this.add(this.subPanel);
        }else{
          this.subPanel = new NowPlaying.ui.panels.UserLoginPanel({datasource : this.datasource});
          this.setTitle("User Login");
          this.add(this.subPanel);
        }
        this.doLayout();
      }
  })
});

  Utils.namespace("NowPlaying.ui.panels", {
  UserInfoPanel : Ext.extend(Ext.Panel, {
        cls : 'user_info_panel',
        initComponent : function(){
          NowPlaying.ui.UserInfoPanel.superclass.initComponent.apply(this, arguments);
          this.datasource.connect("endUpdate", this, "onChange");
        },
        onChange : function(data){
          this.updateContent();
        },
        onRender : function(ct, position){
          NowPlaying.ui.UserInfoPanel.superclass.onRender.apply(this, arguments);
          this.updateContent();
        },
        updateContent : function(){
          if(!this.body){
            return;
          }

          if(!this.contentEl){
            this.contentEl = document.createElement("div");
            this.contentEl.setAttribute("class", "user_info");
            this.body.appendChild(this.contentEl);
          }

          this.contentEl.innerHTML = "";

          var img = document.createElement("img");
          img.setAttribute("class", "avatar");
          img.setAttribute("src", this.datasource.avatar());
          this.contentEl.appendChild(img);

          var now_playing = document.createElement("div");
          now_playing.setAttribute("class", "now_playing_body");

          var header = document.createElement("h3");
          header.innerHTML = "Recently Scrobbled";
          header.addEventListener("click", function(){
             NowPlaying.Application.ui.openRecentTracksWindow();
          }, false);
          now_playing.appendChild(header);

          var track = document.createElement("span");
          track.setAttribute("class", "track");
          track.innerHTML = this.datasource.track() || "";
          now_playing.appendChild(track);

          var artist = document.createElement("span");
          artist.setAttribute("class", "artist");
          artist.innerHTML = this.datasource.artist() || "";
          var artist_name = this.datasource.artist();
          var artist_mbid = this.datasource.artist_mbid();
          artist.addEventListener("click", function(){
              NowPlaying.Application.ui.openArtistTab(artist_name, artist_mbid);
          }, false);
          now_playing.appendChild(artist);

          this.contentEl.appendChild(now_playing);
      }
  })
});

  Utils.namespace("NowPlaying.ui.panels", {
  MusicbrainzLinksPanel : Ext.extend(Ext.Panel, {
    title: 'Musicbrainz Links',
    autoHeight : true,
    initComponent : function(){
      this.datasource.connect("beginUpdate", this, "onChange");
      this.datasource.connect("endUpdate", this, "onChange");
      NowPlaying.ui.panels.MusicbrainzLinksPanel.superclass.initComponent.apply(this, arguments);
    },
    onChange : function(data){
      this.updateContent();
    },
    updateContent : function(){
      if(!this.body){
         return;
      }
      if(!this.contentEl){
        this.contentEl = document.createElement("ul");
        this.contentEl.setAttribute("class", "artist_links");
        this.body.appendChild(this.contentEl);
      }
      if(this.datasource.isLoading){
        this.contentEl.innerHTML = "Loading";
        return;
      }
      this.contentEl.innerHTML = "";
      var urls = this.datasource.artist_urls();
      if(!urls || urls.length == 0){
       var li = document.createElement("li");
        li.innerHTML = "No links found";
        this.contentEl.appendChild(li);
        return;
      }
      for(var i=0; i< urls.length; i++){
        var li = document.createElement("li");
        var a = document.createElement("a");
        a.setAttribute("target", "_new");
        a.setAttribute("href", urls[i].href);
        a.innerHTML = urls[i].rel;
        if(urls[i].rel == "Wikipedia"){
          var countryMatch =(new RegExp("http://([A-Za-z]*).wikipedia.org")).exec(urls[i].href);
          if(countryMatch){
            var country = countryMatch[1];
            a.innerHTML = urls[i].rel + " ["+country+"]";
          }
        }
        li.appendChild(a);
        this.contentEl.appendChild(li);
      }
    },
    onRender : function(ct, position){
      NowPlaying.ui.panels.MusicbrainzLinksPanel.superclass.onRender.apply(this, arguments);
      this.updateContent();
   }
  })
});




Utils.namespace("NowPlaying.Application", {});
Utils.extend(NowPlaying.Application, (function(){
      var started = false;

      window.addEventListener("load", function(){
         initialiseDatasources();
         initialiseUI();
         if(window.location.hash.length > 1){
            updateUsername(window.location.hash.substring(1));
         }
      }, false);

      /**

         TODO
         ====
         Make UI classes proper Ext Components
         Delegate datsource creation to components/parents
         Create new ArtistInfoTab to show arbitrary artist info - refactor with NowPlayingTab to have common ancestor
         Add a search box somewhere to open new tabs
         Make artists links clickable
         Remove album  info
         Make albums clickable - and show album info mini-window (overlay)

       **/

      function initialiseDatasources(){
        NowPlaying.Application.data = new NowPlaying.data.ApplicationDatasource();
      }

      function initialiseUI(){
        NowPlaying.Application.ui = new NowPlaying.ui.ApplicationUI(NowPlaying.Application.data);
      }

      function updateUsername(username){
        window.location.hash = "#" + username;
        NowPlaying.Application.data.user.username(username);
      }


  return {
      updateUsername : updateUsername,
  };
}
)());