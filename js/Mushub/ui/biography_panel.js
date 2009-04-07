function BiographyPanel(artist){
  var contentEl;
  var containerEl;
  var self = this;
  var data = artist.wikipedia_biography;  
  
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
      $(contentEl).html(data.wikipedia_content());
    }else{
     $(contentEl).text("Waaa...");    
    }
  }
  
  data.connect("endUpdate", this, this.onUpdate);
  data.update();

}
