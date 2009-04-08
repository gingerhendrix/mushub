  (function(){
        var base = "js/Mushub/";
      
        if(isLocalhost()){

          loadLibrary("model", ["artist", "artist_query"]);
          loadLibrary("model/audioscrobbler", ["top_albums_datasource", "similar_artists_datasource"]);
          loadLibrary("model/musicbrainz", ["artist_members_datasource", "artist_urls_datasource", "artist_search_datasource"]);
          loadLibrary("model/wikipedia", ["wikipedia_datasource"]);

          loadLibrary("ui", [ "content_panel", "artist_ui"]);
          loadLibrary("ui/panels", ["wikipedia_biography_panel", "lastfm_top_albums_panel", "lastfm_similar_artists_panel", "musicbrainz_links_panel"]);
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

