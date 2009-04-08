
function ArtistQuery(query){
  this.query = query;
  
  this.musicbrainz_search = new mushub.model.musicbrainz.ArtistSearchDatasource(this.query);


}
