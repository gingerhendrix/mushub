Utils.namespace("NowPlaying.ui", { 
  SimilarArtistsPanel : function(element, datasource){
    Utils.extend(this, new NowPlaying.ui.ContentPanel({
          title: 'Similar Artists',
        	contentEl:'similar_artists',
        	columnWidth: .40,
          })
    );


    this.onChange = function(similar_artists){
      element.innerHTML = "";

      function makeThumbnail(artist, clazz, size, label){
        var similar_li = document.createElement("li");
        similar_li.setAttribute("class", clazz);

        var artist_img = document.createElement("img");
        artist_img.src = artist.image;
        artist_img.title = artist.name + " (" + artist.match + "%)";
        artist_img.width = size;
        artist_img.height = size;
        similar_li.appendChild(artist_img);

        if(label){
          var artist_label = document.createElement("span");
          artist_label.innerHTML = artist.name + " (" + artist.match + "%)";
          similar_li.appendChild(artist_label);
        }
        
        return similar_li;
      }
            
      similar_artists.slice(0, 4).forEach(function(sim){
        var similar_li = makeThumbnail(sim, "large", 130, false);
        $("similar_artists_list").appendChild(similar_li);
      });
      
      similar_artists.slice(4, 20).forEach(function(sim){
        var similar_li = makeThumbnail(sim, "medium", 65, false);
        $("similar_artists_list").appendChild(similar_li);
      });
      
      similar_artists.slice(20, 84).forEach(function(sim){
        var similar_li = makeThumbnail(sim, "small", 33, false);
        $("similar_artists_list").appendChild(similar_li);
      });
    
    }

    datasource.connect("similar_artists", this, "onChange");
    this.linkStatus(datasource);
  }
});
