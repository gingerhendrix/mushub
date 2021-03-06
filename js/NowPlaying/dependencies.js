      (function(){
        var base = "js/NowPlaying/";
      
        if(isLocalhost()){

          loadLibrary("utils", ["databean"]);
          loadLibrary("data", ["webservice"]);
          loadLibrary("data", ["datasource"]);
          
          loadLibrary("data/audioscrobbler", [ "user_info_datasource",
                                               "recent_tracks_datasource",
                                               "album_info_datasource",
                                               "top_albums_datasource",
                                               "similar_artists_datasource"]);
          loadLibrary("data/musicbrainz", ["artist_urls_datasource",
                                           "artist_members_datasource", 
                                          "artist_search_datasource"]);
                                          
          loadLibrary("data/wikipedia", ["wikipedia_datasource"]);
          
          loadLibrary("data/yahoo_music", ["videos_datasource", "video_datasource"]);

          loadLibrary("data", ["application_datasource", 
                               "now_playing_datasource",
                               "album_info_datasource",
                               "artist_info_datasource",
                               "artist_tab_datasource",
                               "user_datasource"]);

          loadLibrary("ui", ["bar_chart"]);

          loadLibrary("utils",["data_panel"]);  
             
          loadLibrary("ui/panels", ["album_info_panel",
                                    "artist_info_panel",
                                    "artist_links_panel",
                                    "artist_members_panel",
                                    "content_panel",
                                    "musicbrainz_links_panel",
                                    "search_panel",
                                    "similar_artists_panel",
                                    "top_albums_panel",
                                    "torrent_search_panel",
                                    "user_info_panel",
                                    "user_login_panel",
                                    "user_panel",
                                    "yahoo_videos_panel"
                                     ]);
          
          loadLibrary("ui/windows", ["album_info_window",
                                     "recent_tracks_window",
                                     "yahoo_video_window"]);                        
          
          loadLibrary("ui/tabs", ["artist_tab", "home_tab"]);

          loadLibrary("ui", ["application_ui"]);
          
         
          loadScript("js/config/config.development.js");
        }else{
          loadScript(base + "NowPlaying.js");   
          loadScript("js/config/config.production.js");
          loadScript("http://gandrew.com/mint/?js");       
        }        
        
        function isLocalhost(){
          return window.location.host.indexOf(".") == -1
        }
        
        function loadLibrary(name, libs){
          libs.forEach(function(lib){
            loadScript(base + name + "/" + lib + ".js");
          });
        }
        
          
        function loadScript(url){
          document.write("<script src='"+url+"'><"+"/script>");
        }
    
      })();

