
Utils.namespace("NowPlaying.data.musicbrainz", { 
  ArtistMembersDatasource : function(artist_mbid){
    Utils.extend(this, new NowPlaying.data.Datasource(
                                       { service : "musicbrainz/artist_members",
                                         params : [{ name : "artist_mbid", prop : "artist_mbid" }]
                                       }));                                      
                    
    this.artist_mbid = artist_mbid;
    this.makeProp("artist_relations");

    this.onUpdate = function(response){
      this.artist_relations(response.relations);
    }

  }
});

