
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
  

