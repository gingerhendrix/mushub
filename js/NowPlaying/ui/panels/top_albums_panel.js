Utils.namespace("NowPlaying.ui.panels", { 
    TopAlbumsPanel : Ext.extend(Ext.Panel, {
       	title: 'Top Albums',
        cls : 'contentpanel',
        ctCls : 'top_albums',
        width: 160,
        initComponent : function(){
            this.datasource.connect("top_albums", this, "onChange");   
            NowPlaying.ui.panels.TopAlbumsPanel.superclass.initComponent.apply(this, arguments);
        },
        onChange : function(top_albums){
          this.top_albums = top_albums;
          this.updateContent();
        },
        updateContent : function(){
         console.log("TopAlbumsPanel.updateContent");
         if(!this.body){
        //   console.log("TopAlbumsPanel: Body not yet defined");
           return;
         }

         var self = this;
          if( !this.top_albums ){
            this.body.innerHTML = "Data not loaded";
            return;
          }
          var max_reach = this.top_albums[0].reach;
          if(!this.albumList){
              this.albumList = document.createElement("ol");
              this.albumList.setAttribute("class", "top_albums_list");
              this.body.appendChild(this.albumList);
          }else{
            this.albumList.innerHTML = ""; 
          }
          

          this.top_albums.slice(0, 8).forEach(function(album){
            var album_li = document.createElement("li");
            var album_img = document.createElement("img");
            album_img.src = album.image_large;
            album_img.width = 130;
            album_img.height = 130;
            var album_label = document.createElement("span");
            album_label.innerHTML = album.name + " (" + Math.round(100*(album.reach/max_reach)) + "%)";
            album_li.appendChild(album_img);
            album_li.appendChild(album_label);
            //var reach_bar = create_bar((album.reach/max_reach));
            //album_li.appendChild(reach_bar);
            self.albumList.appendChild(album_li);
          });
        },
        
        onRender : function(ct, position){
           console.log("TopAlbumsPanel.onRender");
           NowPlaying.ui.panels.TopAlbumsPanel.superclass.onRender.apply(this, arguments);
           this.updateContent();
       }
    }),
});
