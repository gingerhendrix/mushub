Utils.namespace("mushub.Application",  (function(){
  var artist_name;
  var artist_mbid;
  var query;
  
  return {
   init : function(){
      var params = QueryString.fromLocation().parts;
      if(params.artist_name && params.artist_mbid){
        artist_name = params.artist_name;
        artist_mbid = params.artist_mbid;
        $(document).ready(function(){
            mushub.Application.showArtistUI(artist_name, artist_mbid);
        });  
      }else if(params.artist_name || params.query){
        query = params.artist_name || params.query;
        $(document).ready(function(){
          mushub.Application.performQuery(query);
        });
      }else{
        console.log("Startup..");
      }
   },
    
   showArtistUI : function (artist_name, artist_mbid){
      $(document.body).removeClass("search");
      $(document.body).addClass("artist");
      $("#search_input").attr("disabled", false);  

      var artist = Artist.findByNameAndMBid(artist_name, artist_mbid);

      var ui = new mushub.ui.ArtistUI($('#artist_ui'), artist);
      ui.addContent("Biography", new mushub.ui.panels.WikipediaBiographyPanel(artist), {});
      ui.addContent("Top Albums", new mushub.ui.panels.LastfmTopAlbumsPanel(artist), {});
      ui.addContent("Similar Artists", new mushub.ui.panels.LastfmSimilarArtistsPanel(artist), {});
      ui.addContent("Links", new mushub.ui.panels.MusicbrainzLinksPanel(artist), {});
      ui.writeHTML();
    },
    
    performQuery : function (query){
        $("#search_input").attr("value", query);
        $("#search_input").attr("disabled", true);        
        var search = new ArtistQuery(query);
        search.musicbrainz_search.connect("endUpdate", this, function(){
          var results = search.musicbrainz_search.search_results();
          if(results.length >0){
            var result = results[0];
            var artist_name = result.artist_name;
            var artist_mbid = result.artist_mbid;
            window.location.search = "?artist_name="+encodeURIComponent(artist_name)+"&artist_mbid="+artist_mbid;
           //showArtistUI(artist_name, artist_mbid);
          }
        });
        search.musicbrainz_search.update();
    },
    
    searchSubmit : function(){
      var query = $('#search_input').val();
      performQuery(query);
      return false;
    }
  
  }  
  
})());
