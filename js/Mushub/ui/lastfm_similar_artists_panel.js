  
function LastfmSimilarArtistsPanel(artist){
  var contentEl;
  var containerEl;
  
  var self = this;
  
   
  this.onUpdate = function(){
    self.writeContent();
  }
  
  this.writeContent = function(container){
    container = container || containerEl;
    containerEl = container;
    
    contentEl = contentEl || document.createElement("div");
    $(contentEl).attr("class", "similar_artists");
    $(contentEl).html("");
    
    var data = artist.lastfm_similar_artists;
    if(data.isLoading){
      $(contentEl).text("Loading...");
    }else if(data.isError){
      $(contentEl).text("Error...");    
    }else if(data.isLoaded){
      $(contentEl).append(similarArtistsCloud(data.similar_artists()));
    }else{
      $(contentEl).text("Waaaa");      
    }
    $(container).append(contentEl);
  }
  
  function similarArtistsCloud(similar_artists){
     var cloud = document.createElement("ol");
     cloud.setAttribute("class", "cloud");    
     
     function makeLink(artist, clazz, size, label){
       var similar_li = document.createElement("li");
       similar_li.setAttribute("class", clazz);
       $(similar_li).html("<a href='artist.html?artist_name="+artist.name+"&artist_mbid="+artist.mbid+"'>"+artist.name+"</a>")
       return similar_li;
     }
     
    similar_artists.slice(0, 10).forEach(function(sim){
      var similar_li = makeLink(sim, "large", 130, false);
      cloud.appendChild(similar_li);
      $(cloud).append(" ");
    });
    
    similar_artists.slice(10, 25).forEach(function(sim){
      var similar_li = makeLink(sim, "medium", 65, false);
      cloud.appendChild(similar_li);
      $(cloud).append(" ");
    });
    
    similar_artists.slice(25, 50).forEach(function(sim){
      var similar_li = makeLink(sim, "small", 33, false);
      cloud.appendChild(similar_li);
      $(cloud).append(" ");
    });
    return cloud;

  }
  
 function similarArtistsQuilt(similar_artists){
    var quilt = document.createElement("ol");
    quilt.setAttribute("class", "quilt");    
     
     function makeThumbnail(artist, clazz, size, label){
        var similar_li = document.createElement("li");
        similar_li.setAttribute("class", clazz);

        var artist_img = document.createElement("img");
        artist_img.src = artist.image;
        artist_img.title = artist.name + " (" + artist.match + "%)";
        artist_img.width = size;
        artist_img.height = size;
        artist_img.addEventListener("click", function(){
          self.onArtistClick(artist);
        }, false);
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
      quilt.appendChild(similar_li);
    });
    
    similar_artists.slice(4, 20).forEach(function(sim){
      var similar_li = makeThumbnail(sim, "medium", 65, false);
      quilt.appendChild(similar_li);
    });
    
    similar_artists.slice(20, 84).forEach(function(sim){
      var similar_li = makeThumbnail(sim, "small", 33, false);
      quilt.appendChild(similar_li);
    });
    return quilt;
  }

  artist.lastfm_similar_artists.connect("endUpdate", this, this.onUpdate);
  artist.lastfm_similar_artists.update();

}
