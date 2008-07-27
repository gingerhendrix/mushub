Utils.namespace("NowPlaying.ui.panels", {
  SearchPanel : Ext.extend(Ext.Panel, {
    title: 'Search',
    cls : 'search_panel',
    width: 640,
    height: 140,
    initComponent : function(){
       //this.datasource.connect("endUpdate", this, "onUpdate");
       NowPlaying.ui.panels.TorrentSearchPanel.superclass.initComponent.apply(this, arguments);
    },
    
    onUpdate : function(data){
      this.results =  this.datasource.search_results();
      this.updateContent();
    },
    
    onSearch : function(query){
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
         
         var input = document.createElement("input");
         input.setAttribute("type", "text");
         this.searchEl.appendChild(input);
         
         var button = document.createElement("input");
         button.setAttribute("type", "button");
         button.setAttribute("value", "Search");
         button.addEventListener("click", function(){
            self.onSearch(input.value);
         }, false);
         this.searchEl.appendChild(button);
         
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
      NowPlaying.ui.panels.TorrentSearchPanel.superclass.onRender.apply(this, arguments);
      this.updateContent();
   }
  })
});

