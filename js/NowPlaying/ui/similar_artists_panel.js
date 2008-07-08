Utils.namespace("NowPlaying.ui", { 
  SimilarArtistsPanel : function(element, datasource){
     this.element = element;
     this.similarArtists = null;
     var self = this;
           
    Utils.extend(this, 
      new NowPlaying.ui.ContentPanel({
          title: 'Similar Artists',
        	contentEl:'similar_artists',
        	height: '520',
        	autoScroll: true,
        	columnWidth: .40,
      })
    );
    
    var showQuilt = true;
    
    function makeViewMenu(element){
      var view_menu = document.createElement("div");
      view_menu.setAttribute("class", "view_menu");
      
      var quiltButton = document.createElement("img");
      quiltButton.src = "images/custom/quilt-icon.png"
      quiltButton.width = 36;
      quiltButton.height = 36;     
      quiltButton.addEventListener("click",toggleView, false); 
      view_menu.appendChild(quiltButton);

      var tableButton = document.createElement("img");
      tableButton.src = "images/custom/table-icon.png"
      tableButton.width = 36;
      tableButton.height = 36;
      tableButton.addEventListener("click", toggleView, false); 
      view_menu.appendChild(tableButton);

      return view_menu
    }
    
    this.element.parentNode.insertBefore(makeViewMenu(), this.element);
    
    function toggleView(){
      showQuilt = !showQuilt;
      self.redraw()    
    }
    
    function similarArtistsQuilt(element, similar_artists){
       Ext.get(element).addClass("quilt");
       
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
        element.appendChild(similar_li);
      });
      
      similar_artists.slice(4, 20).forEach(function(sim){
        var similar_li = makeThumbnail(sim, "medium", 65, false);
        element.appendChild(similar_li);
      });
      
      similar_artists.slice(20, 84).forEach(function(sim){
        var similar_li = makeThumbnail(sim, "small", 33, false);
        element.appendChild(similar_li);
      });
    
    }
    
    function similarArtistsTable(element, similar_artists){
      Ext.get(element).addClass("table");   
      
      similar_artists.forEach(function(artist){
        var similar_li = document.createElement("li");
        
        var artist_img = document.createElement("img");
        artist_img.src = artist.image;
        artist_img.title = artist.name + " (" + artist.match + "%)";
        artist_img.width = 65;
        artist_img.height = 65;
        similar_li.appendChild(artist_img);

        var artist_label = document.createElement("span");
        artist_label.setAttribute("class", "artist");
        artist_label.innerHTML = artist.name;
        similar_li.appendChild(artist_label);
        
        var match_bar = document.createElement("span");
        match_bar.setAttribute("class", "match_bar");
        var match_bar_inner = document.createElement("span");
        match_bar_inner.setAttribute("class", "match_bar_inner");        
        match_bar_inner.style.width = (5 + Number(artist.match)*1.5) + "px";
        match_bar_inner.innerHTML = "&nbsp;";
        match_bar.appendChild(match_bar_inner);
        similar_li.appendChild(match_bar);
        
        var artist_match = document.createElement("span");
        artist_match.setAttribute("class", "match");
        artist_match.innerHTML = "" + artist.match + "%";
        similar_li.appendChild(artist_match);
        
        element.appendChild(similar_li);
      });
    }

    this.redraw = function(){
      this.element.innerHTML = "";
      
      Ext.get(this.element).removeClass("quilt");   
      Ext.get(this.element).removeClass("table");   

      if(showQuilt){
        similarArtistsQuilt(this.element, this.similar_artists);
      }else{
        similarArtistsTable(this.element, this.similar_artists);
      }
    }

    this.onChange = function(similar_artists){
      this.similar_artists = similar_artists;
      this.redraw();
    }

    datasource.connect("similar_artists", this, "onChange");
    this.linkStatus(datasource);
  }
});
