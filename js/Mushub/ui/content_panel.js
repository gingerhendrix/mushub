
Utils.namespace("mushub.ui", {
  ContentPanel : function (){
    this.contentEl;
    this.containerEl;
     
    this.onUpdate = function(){
      this.writeContent();
    }
    
    this.writeContent = function(container){
      this.containerEl = container || this.containerEl;
      this.contentEl = this.contentEl || document.createElement("div");
      
      $(this.contentEl).html("");

      if(this.data.isLoading){
        $(this.contentEl).text("Loading...");
      }else if(this.data.isError){
        $(this.contentEl).text("Error...");    
      }else if(this.data.isLoaded){
        this.writeData();
      }else{
        $(this.contentEl).text("");
      }
      $(this.containerEl).append(this.contentEl);
    }
    
    this.init = function(){
      this.data.connect("endUpdate", this, this.onUpdate);
      this.data.update();
    }

  }
});
