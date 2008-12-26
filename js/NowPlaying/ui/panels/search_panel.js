Utils.namespace("NowPlaying.ui.panels", {
  SearchPanel : Ext.extend(Ext.Panel, {
    title: '',
    baseCls: '',
    cls : 'search_panel',
    width: 640,
    height: 140,
    initComponent : function(){
       //this.datasource.connect("endUpdate", this, "onUpdate");
       NowPlaying.ui.panels.SearchPanel.superclass.initComponent.apply(this, arguments);
    },
    
    onUpdate : function(data){
      this.results =  this.datasource.search_results();
      this.searchInput.disabled = false;
      this.loadingEl.style.visibility = "hidden";
      this.updateContent();
    },
    
    onSearch : function(query){
      this.searchInput.disabled = true;
      this.loadingEl.style.visibility = "visible";
      this.datasource = new NowPlaying.data.musicbrainz.ArtistSearchDatasource();
      this.datasource.query = query;
      this.datasource.connect("endUpdate", this, "onUpdate");
      this.datasource.update();
    },
    
    updateContent : function(){
      var self = this;
      if(!this.body){
         return;
      }
      if(!this.contentEl){
        this.contentEl = document.createElement("div");
        this.contentEl.setAttribute("class", "artist_search");
        this.body.appendChild(this.contentEl);
      }
      if(!this.searchEl){
         this.searchEl = document.createElement("div");
         this.searchEl.setAttribute("class", "search_form");
         
         this.searchInput = document.createElement("input");
         this.searchInput.setAttribute("value", "Search for an Artist");
         this.searchInput.setAttribute("class", "default");
         var defaultListener = function(){
            this.setAttribute("class", "");
            this.value = "";
            this.removeEventListener("focus", defaultListener, false);  
         };
         this.searchInput.addEventListener("focus", defaultListener, false);  
         
         this.searchInput.setAttribute("type", "text");
         this.searchInput.addEventListener("change", function(){
            self.onSearch(this.value);
         }, false);
         this.searchEl.appendChild(this.searchInput);
         
         this.loadingEl = document.createElement("img");
         this.loadingEl.setAttribute("src", "images/custom/loading.gif");
         this.loadingEl.setAttribute("width", 18);
         this.loadingEl.setAttribute("height", 18);
          this.searchEl.appendChild(this.loadingEl);
         this.loadingEl.style.visibility = "hidden";
        
        this.contentEl.appendChild(this.searchEl);
      }
      if(!this.resultsEl){
         this.resultsEl = document.createElement("div");
         this.resultsEl.setAttribute("class", "search_results");
         this.contentEl.appendChild(this.resultsEl);
      }
      this.resultsEl.innerHTML = "";
      if(this.results && this.results.length > 0){        
        var span = document.createElement("span");
        span.setAttribute("class","title");
        span.innerHTML = "Search Results:"
        this.resultsEl.appendChild(span);
        
        var list = document.createElement("ol");
        for(var i=0; i<this.results.length; i++){
          var result = this.results[i]
          var li = document.createElement("li");
          li.innerHTML = result.artist_name + "<span class='score'>" + result.score + "%</span>";
          (function(result){
            li.addEventListener("click", function(){
               NowPlaying.Application.ui.openArtistTab(result.artist_name, result.artist_mbid);
            }, false);
          })(result);
          list.appendChild(li);
        }
        this.resultsEl.appendChild(list);
      }
    },
    
    onRender : function(ct, position){
      NowPlaying.ui.panels.SearchPanel.superclass.onRender.apply(this, arguments);
      this.updateContent();
   }
  })
});

