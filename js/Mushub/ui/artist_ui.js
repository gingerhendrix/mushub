
function ArtistUI(element, artist){
  var menuElement;
  var contentElement;
  var contentPanels = [];

  this.writeHTML = function(){
    var html = "<h1>" 
             + "<a href='artist.html?artist_name=" + artist.name + "&artist_mbid="+ artist.mbid + "' class='permalink'>" + artist.name + "</a>"
             + "</h1>";
    $(element).html(html);
    menuElement = document.createElement("div");
    menuElement.setAttribute("class", "artist_menu");
    $(element).append(menuElement);
    this.writeMenu();
    contentElement = document.createElement("div");
    contentElement.setAttribute("class", "content_container");
    $(element).append(contentElement);
    this.writeContent();
  }         
  
  this.writeMenu = function(){
    contentPanels.forEach(function(cp){
      console.log("cp: %o", cp);
      var label = document.createElement("span");
      label.innerHTML = cp.label;
      menuElement.appendChild(label);
    });
  }
  
  this.writeContent = function(){
    contentPanels.forEach(function(cp){
      var container = document.createElement("div");
      container.setAttribute("class", "container");
      $(container).html("<h3>"+cp.label+"</h3");
      cp.panel.writeContent(container);
      $(contentElement).append(container);
    });
  }
  
  this.addContent = function(label, contentPanel, opts){
    opts = opts || {};
    contentPanels.push({label : label, panel : contentPanel, options : opts });
  }
}
