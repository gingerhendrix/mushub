
function ArtistUI(element, artist){
  var menuElement;
  var contentElement;
  var contentPanels = [];

  this.writeHTML = function(){
    var html = "<h1>" + artist.name + "</h1>";
    $(element).html(html);
    menuElement = document.createElement("div");
    menuElement.setAttribute("class", "artist_menu");
    $(element).append(menuElement);
    this.writeMenu();
    contentElement = document.createElement("div");
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
      cp.panel.writeContent(contentElement);
    });
  }
  
  this.addContent = function(label, contentPanel, opts){
    opts = opts || {};
    contentPanels.push({label : label, panel : contentPanel, options : opts });
  }
}
