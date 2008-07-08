
Utils.namespace("NowPlaying.Application", {});
Utils.extend(NowPlaying.Application, (function(){

      var started = false;
      var updateTimer;
      var npUI;
      var taUI;
      var saUI;
      var albumUI;
      var artistUI;
  
      function initialiseDatasources(username){
        Utils.namespace("NowPlaying.Application.data", {});
        var appData = NowPlaying.Application.data;

        var Data = NowPlaying.data;
        var AS = NowPlaying.data.audioscrobbler;
        var MB = NowPlaying.data.musicbrainz;
        var WP = NowPlaying.data.wikipedia;
      
        appData.recent_tracks = new Data.RecentTracksDatasource(username);
        if(updateTimer){
          window.clearInterval(updateTimer);
        }
        updateTimer = window.setInterval(function(){
            rtData.update();
        }, 30000);
        
        appData.now_playing = new Data.NowPlayingDatasource(appData.recent_tracks);
        appData.album_info = new AS.AlbumInfoDatasource();
        appData.top_albums = new AS.TopAlbumsDatasource();
        appData.similar_artists = new AS.SimilarArtistsDatasource();
        
        appData.now_playing.connect("album", function(album){
                                         appData.album_info.artist = appData.now_playing.artist(); 
                                         appData.album_info.album = appData.now_playing.album(); 
                                         appData.album_info.update();  
                                    });
        appData.now_playing.connect("artist", function(artist){ 
                                        appData.top_albums.artist = artist; 
                                        appData.top_albums.update(); 
                                    });
        appData.now_playing.connect("artist", function(artist){ 
                                        appData.similar_artists.artist = artist; 
                                        appData.similar_artists.update(); 
                                    });
        
      }      
      
      function initialiseUI(){
        var UI = NowPlaying.ui;
        var Data = NowPlaying.data;
        var appUI = Utils.namespace("NowPlaying.Application.ui");
        var appData = NowPlaying.Application.data;
        
        appUI.now_playing = new UI.NowPlayingPanel($("now_playing"), appData.now_playing);        
        appUI.top_albums = new UI.TopAlbumsPanel($("top_albums_list"), appData.top_albums);
        appUI.similar_artists = new UI.SimilarArtistsPanel($("similar_artists_list"), appData.similar_artists);
        appUI.album_info = new UI.AlbumInfoPanel($("album_info"), new Data.AlbumInfoDatasource(appData.now_playing, appData.album_info));
        appUI.artist_info = new UI.ArtistInfoPanel($("artist_info"), 
                                              new Data.ArtistInfoDatasource(appData.now_playing,  
                                                                            new Data.musicbrainz.ArtistUrlsDatasource(),
                                                                            new Data.wikipedia.WikipediaDatasource()));
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
      }
      
      function showStart(){
        $('main').style.display = "none";
        $('start').style.display = "block";
      }
      
      function showMain(){
       $('start').style.display = "none";
       $('main').style.display = "block";
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
        
       var mainPanel = new Ext.Panel({
          layout:'border',
          region : 'center',
          border: false,
          items:[nowPlayingPanel, 
                new Ext.Panel({
                  region : 'center',
                  layout : 'column',
                  autoScroll : true,
                  baseCls: '',
                  margins: '20 20 0 20',
                  border: false,
                  items : [artistInfoPanel,
                           albumInfoPanel,] 
                })]
       });
  
        // Configure viewport
       var viewport = new Ext.Viewport({
               layout:'border',
               items:[username_panel, mainPanel]});
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
})());
  

