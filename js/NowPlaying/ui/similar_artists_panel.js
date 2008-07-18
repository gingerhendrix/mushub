Utils.namespace("NowPlaying.ui", { 
  SimilarArtistsPanel :  Ext.extend(Ext.Panel, {
          title: 'Similar Artists',
        	contentEl:'similar_artists',
        	height: '520',
        	autoScroll: true,
        	columnWidth: .40,
        	showQuilt : true,
 	        cls : 'contentpanel',
          ctCls : 'similar_artists',
          initComponent : function(){
             this.datasource.connect("similar_artists", this, "onChange");
             // this.linkStatus(datasource);
             NowPlaying.ui.SimilarArtistsPanel.superclass.initComponent.apply(this, arguments);
          },
          onChange : function(similar_artists){
            this.similar_artists = similar_artists;
            this.redraw();
          },
          
          redraw : function(){
            if(!this.body){ return; }
            
            Ext.get(this.body).removeClass("quilt");   
            Ext.get(this.body).removeClass("table");   
            if(this.showQuilt){
                this.similarArtistsQuilt(this.similar_artists);
            }else{
              this.similarArtistsTable(this.element, this.similar_artists);
            }
          },
          
          onRender : function(ct, pos){
             NowPlaying.ui.SimilarArtistsPanel.superclass.onRender.apply(this, arguments);
//             this.body.parentNode.insertBefore(makeViewMenu(), this.body);

          },
          
          makeViewMenu : function(element){
            var view_menu = document.createElement("div");
            view_menu.setAttribute("class", "view_menu");
            
            var quiltButton = document.createElement("img");
            quiltButton.src = "images/custom/quilt-icon.png"
            quiltButton.width = 36;
            quiltButton.height = 36;     
            quiltButton.addEventListener("click",toggleView, false); 
            view_menu.appendChild(quiltButton);

            var tableButton = document.createElement("img");
            tableButton.src = "images/custom/table-icon.png"
            tableButton.width = 36;
            tableButton.height = 36;
            tableButton.addEventListener("click", toggleView, false); 
            view_menu.appendChild(tableButton);

            return view_menu
          },
          
          toggleView : function(){
              showQuilt = !showQuilt;
              this.redraw()    
          },
          
          similarArtistsQuilt : function(similar_artists){
              if(this.quilt){
                var element = this.quilt;
                element.innerHTML = "";
              }else{
                this.quilt = document.createElement("ol");
                this.quilt.setAttribute("class", "quilt");
                this.body.appendChild(this.quilt);
                var element = this.quilt;
              }
             
             function makeThumbnail(artist, clazz, size, label){
                var similar_li = document.createElement("li");
                similar_li.setAttribute("class", clazz);

                var artist_img = document.createElement("img");
                artist_img.src = artist.image;
                artist_img.title = artist.name + " (" + artist.match + "%)";
                artist_img.width = size;
                artist_img.height = size;
                similar_li.appendChild(artist_img);

                if(label){
                  var artist_label = document.createElement("span");
                  artist_label.innerHTML = artist.name + " (" + artist.match + "%)";
                  similar_li.appendChild(artist_label);
                }
                return similar_li;
             }
            
            similar_artists.slice(0, 4).forEach(function(sim){
              var similar_li = makeThumbnail(sim, "large", 130, false);
              element.appendChild(similar_li);
            });
            
            similar_artists.slice(4, 20).forEach(function(sim){
              var similar_li = makeThumbnail(sim, "medium", 65, false);
              element.appendChild(similar_li);
            });
            
            similar_artists.slice(20, 84).forEach(function(sim){
              var similar_li = makeThumbnail(sim, "small", 33, false);
              element.appendChild(similar_li);
            });
          },
    
          similarArtistsTable : function(element, similar_artists){
            Ext.get(element).addClass("table");   
      
            similar_artists.forEach(function(artist){
              var similar_li = document.createElement("li");
        
              var artist_img = document.createElement("img");
              artist_img.src = artist.image;
              artist_img.title = artist.name + " (" + artist.match + "%)";
              artist_img.width = 65;
              artist_img.height = 65;
              similar_li.appendChild(artist_img);

              var artist_label = document.createElement("span");
              artist_label.setAttribute("class", "artist");
              artist_label.innerHTML = artist.name;
              similar_li.appendChild(artist_label);
              
              var match_bar = document.createElement("span");
              match_bar.setAttribute("class", "match_bar");
              var match_bar_inner = document.createElement("span");
              match_bar_inner.setAttribute("class", "match_bar_inner");        
              match_bar_inner.style.width = (5 + Number(artist.match)*1.5) + "px";
              match_bar_inner.innerHTML = "&nbsp;";
              match_bar.appendChild(match_bar_inner);
              similar_li.appendChild(match_bar);
              
              var artist_match = document.createElement("span");
              artist_match.setAttribute("class", "match");
              artist_match.innerHTML = "" + artist.match + "%";
              similar_li.appendChild(artist_match);
              
              element.appendChild(similar_li);
            });
         }
    })
});
