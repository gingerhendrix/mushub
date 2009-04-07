
function LastfmTopAlbumsDatasource(artist){
  this.artist = artist.name;
  
  Utils.extend(this, new Datasource( { service : "audioscrobbler/top_albums",
                                       params : ["artist"]
                                      }));  
 
  this.makeProp("top_albums");
 
  this.onUpdate = function(response){
    this.top_albums(response.top_albums);
  }
  
  this.toString = function(){
    return "TopAlbumsDatasource[" + this.artist + "]";
  }

}
