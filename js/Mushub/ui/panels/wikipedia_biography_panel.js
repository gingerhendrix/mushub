Utils.namespace("mushub.ui.panels", {
  WikipediaBiographyPanel : function(artist){
    Utils.extend(this, new mushub.ui.ContentPanel());
    this.data = artist.wikipedia_biography;  
    

    this.writeData = function(){
      $(this.contentEl).html(this.data.wikipedia_content());
    }
   
    this.init(); 
  }
});
