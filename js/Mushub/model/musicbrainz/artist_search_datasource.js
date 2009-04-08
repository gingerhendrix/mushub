Utils.namespace("mushub.model.musicbrainz", { 
  ArtistSearchDatasource : function(query){
    Utils.extend(this, new Datasource(
                                       { service : "musicbrainz/artist_search",
                                         params : [{ name : "query", prop : "query" }]
                                       })); 
    this.query = query;
    this.makeProp("search_results");                                       
    
    this.onUpdate = function(response){
      this.search_results(response.results);
    }
    
  }
});
