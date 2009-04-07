
function LastfmTopAlbumsPanel(artist){
  var contentEl;
  var containerEl;
  
  var self = this;
  
   
  this.onUpdate = function(){
    console.log("top_albums_panel: onUpdate");
    self.writeContent();
  }
  
  this.writeContent = function(container){
    container = container || containerEl;
    containerEl = container;
    
    contentEl = contentEl || document.createElement("div");
    $(contentEl).html("");

    if(artist.lastfm_top_albums.isLoading){
      $(contentEl).text("Loading...");
    }else if(artist.lastfm_top_albums.isError){
      $(contentEl).text("Error...");    
    }else if(artist.lastfm_top_albums.isLoaded){
      var albumList = document.createElement("ol");
      albumList.setAttribute("class", "top_albums");
      $(contentEl).append(albumList);
     
      var top_albums = artist.lastfm_top_albums.top_albums();
      var max_reach = top_albums[0] ? top_albums[0].reach : 0;
     
      top_albums.slice(0, 5).forEach(function(album){
        var album_li = document.createElement("li");
        var album_img = document.createElement("img");
        album_img.src = album.image_large;
        album_img.width = 130;
        album_img.height = 130;
        album_img.style.cursor = "pointer";
//        album_img.addEventListener("click", function(){
//          NowPlaying.Application.ui.openAlbumWindow(album.artist, album.name, album.mbid);
//        }, false);
        var album_label = document.createElement("span");
        album_label.innerHTML = album.name; // + " (" + Math.round(100*(album.reach/max_reach)) + "%)";
        album_li.appendChild(album_img);
        album_li.appendChild(album_label);
        //var reach_bar = create_bar((album.reach/max_reach));
        //album_li.appendChild(reach_bar);
        albumList.appendChild(album_li);
      });
    }else{
      $(contentEl).text("Waaaa");      
    }
    $(container).append(contentEl);
  }

  artist.lastfm_top_albums.connect("endUpdate", this, this.onUpdate);
  artist.lastfm_top_albums.update();

}
