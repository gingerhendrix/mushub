
function Artist(name){
  this.name = name;
  this.biography = new ArtistBiographyDatasource(this);
  this.lastfm_top_albums = new LastfmTopAlbumsDatasource(this);
}

Artist.findByName = function(name){
  return new Artist(name);
}
