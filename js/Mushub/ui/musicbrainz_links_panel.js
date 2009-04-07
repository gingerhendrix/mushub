
function MusicbrainzLinksPanel(artist){
  var contentEl;
  var containerEl;
  var self = this;
  var data = artist.musicbrainz_links;  
  
  this.onUpdate = function(){
    self.writeContent();
  }

  this.writeContent = function(container){
    container = container || containerEl;
    containerEl = container;
    
    contentEl = contentEl || document.createElement("div");
    $(container).append(contentEl);
    $(contentEl).html("");

    if(data.isLoading){
      $(contentEl).text("Loading...");
    }else if(data.isError){
      $(contentEl).text("Error...");    
    }else if(data.isLoaded){
      var list = document.createElement("ul");
      $(contentEl).append(list);
      var urls = data.artist_urls();
      if(!urls || urls.length == 0){
       var li = document.createElement("li");
        li.innerHTML = "No links found";
        $(list).append(li);
        return;        
      }
      for(var i=0; i< urls.length; i++){
        var li = document.createElement("li");
        var a = document.createElement("a");
        a.setAttribute("target", "_blank");
        a.setAttribute("href", urls[i].href);
        a.innerHTML = urls[i].rel;
        if(urls[i].rel == "Wikipedia"){
          var countryMatch =(new RegExp("http://([A-Za-z]*).wikipedia.org")).exec(urls[i].href);
          if(countryMatch){
            var country = countryMatch[1];
            a.innerHTML = urls[i].rel + " ["+country+"]";
          } 
        }
        li.appendChild(a);
        $(list).append(li);
      }
    }else{
      $(contentEl).text("Waa...");    
    }

  }

  data.connect("endUpdate", this, this.onUpdate);
  data.update();


}
