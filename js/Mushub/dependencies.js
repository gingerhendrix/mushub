  (function(){
        var base = "js/Mushub/";
      
        if(isLocalhost()){

          loadLibrary("model", ["artist", "artist_biography_datasource", "lastfm_top_albums_datasource"]);
          loadLibrary("model/audioscrobbler", ["top_albums_datasource", "similar_artists_datasource"]);
          loadLibrary("model/musicbrainz", ["artist_members_datasource", "artist_urls_datasource"]);
          loadLibrary("model/wikipedia", ["wikipedia_datasource"]);

          loadLibrary("ui", ["artist_ui", "biography_panel", "lastfm_top_albums_panel", "lastfm_similar_artists_panel", "musicbrainz_links_panel"]);
          loadLibrary("utils", ["databean", "datasource", "webservice"]);
          
          loadScript("js/config/config.development.js");
        }else{
//          loadScript(base + "NowPlaying.js");   
//          loadScript("js/config/config.production.js");
//          loadScript("http://gandrew.com/mint/?js");       
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

