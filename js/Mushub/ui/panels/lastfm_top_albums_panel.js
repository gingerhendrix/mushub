
Utils.namespace("mushub.ui.panels", {
  LastfmTopAlbumsPanel : function(artist){
    Utils.extend(this, new mushub.ui.ContentPanel());
    this.data = artist.lastfm_top_albums;
    
    this.writeData = function(){
      var albumList = document.createElement("ol");
      albumList.setAttribute("class", "top_albums");
      $(this.contentEl).append(albumList);
     
      var top_albums = this.data.top_albums();
      var max_reach = top_albums[0] ? top_albums[0].reach : 0;
     
      top_albums.slice(0, 5).forEach(function(album){
        var album_li = document.createElement("li");
        var album_img = document.createElement("img");
        album_img.src = album.image_large;
        album_img.width = 130;
        album_img.height = 130;
        album_img.style.cursor = "pointer";
        var album_label = document.createElement("span");
        album_label.innerHTML = album.name; // + " (" + Math.round(100*(album.reach/max_reach)) + "%)";
        album_li.appendChild(album_img);
        album_li.appendChild(album_label);
        albumList.appendChild(album_li);
      });
    }
    
    this.init();
  }
});
