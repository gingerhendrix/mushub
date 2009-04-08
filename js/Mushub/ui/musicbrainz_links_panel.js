
function MusicbrainzLinksPanel(artist){
  var contentEl;
  var containerEl;
  var self = this;
  var data = artist.musicbrainz_links;  
  var additionalLinks = [{label : "lastfm", href : "http://last.fm/music/"  + artist.name },
                        {label : "stmusic", href : "http://stmusic.org/browse.php?search=" + artist.name},
                        {label : "mininova", href : "http://www.mininova.org/search/?search=" + artist.name},
                        {label : "piratebay", href : "http://www.piratebay.org/search/" + artist.name}]
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
      $(list).addClass("links");
      $(contentEl).append(list);
      var urls = data.artist_urls();
      if(!urls || urls.length == 0){
       var li = document.createElement("li");
        li.innerHTML = "No links found";
        $(list).append(li);
        return;        
      }
      for(var i=0; i< urls.length; i++){
        if(urls[i].rel == "Wikipedia"){
          var countryMatch =(new RegExp("http://([A-Za-z]*).wikipedia.org")).exec(urls[i].href);
          if(countryMatch){
            var country = countryMatch[1];
            var li = createLink("Wikipedia ["+country+"]", urls[i].href)
          }else{
            var li = createLink("Wikipedia", urls[i].href);
          }
        }else{
          var li = createLink(urls[i].rel, urls[i].href);
        }
        $(list).append(li);
      }
      additionalLinks.forEach(function(link){
        $(list).append(createLink(link.label, link.href));
      });
    }else{
      $(contentEl).text("Waa...");    
    }

  }
  
  function createLink(label, href){
    var li = document.createElement("li");
    var a = document.createElement("a");
    a.setAttribute("target", "_blank");
    a.setAttribute("href", href);
    a.innerHTML = label;
    li.appendChild(a);
    return li;
  }

  data.connect("endUpdate", this, this.onUpdate);
  data.update();


}
