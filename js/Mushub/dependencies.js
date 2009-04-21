  (function(){
        var base = "js/Mushub/";
      
        function loadDependencies(){
         loadLibrary(".", ["application"]);
          loadLibrary("model", ["artist", "artist_query"]);
          loadLibrary("ui", [ "content_panel", "artist_ui"]);
          loadLibrary("ui/panels", ["wikipedia_biography_panel", "lastfm_top_albums_panel", "lastfm_similar_artists_panel", "musicbrainz_links_panel"]);
          loadLibrary("utils", ["databean", "datasource", "webservice"]);
          
        }
      
        if(isLocalhost()){
          loadDependencies();
          loadScript("js/config/config.development.js");

        }else{
          loadScript(base + "Mushub.js");   
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

