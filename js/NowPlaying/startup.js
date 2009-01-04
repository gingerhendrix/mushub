
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
  

