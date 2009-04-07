
function Artist(name){
  this.name = name;
  this.biography = new ArtistBiographyDatasource(this);
  this.lastfm_top_albums = new mushub.model.audioscrobbler.TopAlbumsDatasource(this);
}

Artist.findByName = function(name){
  return new Artist(name);
}
