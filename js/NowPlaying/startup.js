
Utils.namespace("NowPlaying.Application", {});
Utils.extend(NowPlaying.Application, (function(){
      var started = false;
      
      window.addEventListener("load", function(){
         if(window.location.hash.length > 1){
            updateUsername(window.location.hash.substring(1));
         }else{
          showStart();
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
  
      function initialiseDatasources(username){
        NowPlaying.Application.data = new NowPlaying.data.ApplicationDatasource(username);
      }      
      
      function initialiseUI(){
        NowPlaying.Application.ui = new NowPlaying.ui.ApplicationUI(NowPlaying.Application.data);
      }
      
      function updateUsername(username){
        if(!started){
          showMain(); 
        }
        $("username").value = username;
        window.location.hash = "#" + username;

        initialiseDatasources(username);
        initialiseUI();

        NowPlaying.Application.data.recent_tracks.update();
        NowPlaying.Application.data.user_info.update();
      }
      
      function showStart(){
        //$('main').style.display = "none";
        $('start').style.display = "block";
      }
      
      function showMain(){
       $('start').style.display = "none";
       //$('main').style.display = "block";
      }
      
 
  return {
      updateUsername : updateUsername,
  };
}
)());
  

