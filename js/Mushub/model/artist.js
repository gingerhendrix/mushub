
function Artist(name, mbid){
  this.name = name;
  this.mbid = mbid;
  
  this.biography = new ArtistBiographyDatasource(this);
  this.lastfm_top_albums = new mushub.model.audioscrobbler.TopAlbumsDatasource(this);
  this.lastfm_similar_artists = new mushub.model.audioscrobbler.SimilarArtistsDatasource(this);
  this.musicbrainz_links = new mushub.model.musicbrainz.ArtistUrlsDatasource(this);
  this.musicbrainz_members = new mushub.model.musicbrainz.ArtistMembersDatasource(this);
  
  
}

Artist.findByNameAndMBid = function(name, mbid){
  return new Artist(name, mbid);
}
