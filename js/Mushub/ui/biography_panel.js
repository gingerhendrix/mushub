function BiographyPanel(artist){
  var contentEl;


  this.writeContent = function(container){
    $(container).html("");
    contentEl = document.createElement("div");
    $(contentEl).text("Biography....");
    $(container).append(contentEl);
  }

}
