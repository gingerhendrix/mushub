
Utils.namespace("NowPlaying.Application", {});
Utils.extend(NowPlaying.Application, (function(){
      var started = false;
      
      /**
         
         TODO
         ====
         
         Move makePanels into applicationUI 
         Refactor application UI into sub components
         Move leftovers into spearate bits (usernamepanel, username datasource)
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

        makePanels();                                             
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
      
      function makePanels(){
    
       var username_panel = new Ext.Panel({
          contentEl:'username_input',
          region:'north',
        	width: 800,
       });
       var appUI = NowPlaying.Application.ui;
       var nowPlayingPanel = appUI.now_playing.panel;
       var topAlbumsPanel = appUI.top_albums.panel;
       var similarArtistsPanel = appUI.similar_artists.panel;
       var wikipediaPanel = appUI.artist_info.panel;
       var albumInfoPanel = appUI.album_info.panel;

/*       var splitColumns = new Ext.Panel({ layout:'column', 
        	                        width: 800,
        	                        baseCls: '',
        	                        border: false,
        	                        items : [new Ext.Panel({columnWidth : .05, border : false}), 
        	                                 topAlbumsPanel, 
        	                                 new Ext.Panel({columnWidth : .1, border : false}), 
        	                                 similarArtistsPanel,
        	                                 new Ext.Panel({columnWidth : .05, border : false}) ]
        	                      })]*/
      
       var artistInfoPanel = new Ext.Panel({
          border: false,
          baseCls: '',
          width: 640,
        	items : [wikipediaPanel, topAlbumsPanel, similarArtistsPanel]
        	        
        });
        
       var nowPlayingTab = new NowPlaying.ui.ArtistTab({
           items : [artistInfoPanel, albumInfoPanel] 
       });

      
       var tabPanel = new Ext.TabPanel({
          region : 'center',
          margins: '20 20 0 20',
          activeTab : 0,
          items : [nowPlayingTab, {title: "808 State"}]
       });
       
       var mainPanel = new Ext.Panel({
          layout: 'border',
          region: 'center',
          items: [nowPlayingPanel, tabPanel]
       });

        // Configure viewport
       var viewport = new Ext.Viewport({
               layout:'border',
               items:[username_panel, mainPanel]
       });
    
    }      
    
      window.addEventListener("load", function(){
         if(window.location.hash.length > 1){
            updateUsername(window.location.hash.substring(1));
         }else{
          showStart();
         }
      }, false); 
 
 
  return {
      updateUsername : updateUsername
  };
}
)());
  

