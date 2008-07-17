Utils.namespace("NowPlaying.ui", { 
    TopAlbumsPanel : Ext.extend(Ext.Panel, {
       	title: 'Top Albums',
        cls : 'contentpanel',
        ctCls : 'top_albums',
        initComponent : function(){
            this.datasource.connect("top_albums", this, "onChange");   
            NowPlaying.ui.TopAlbumsPanel.superclass.initComponent.apply(this, arguments);
        },
        onChange : function(top_albums){
          this.top_albums = top_albums;
          this.updateContent();
        },
        updateContent : function(){
         console.log("TopAlbumsPanel.updateContent");
         var self = this;
          if( !this.top_albums ){
            this.body.innerHTML = "Data not loaded";
            return;
          }
          var max_reach = this.top_albums[0].reach;
          var albumList = document.createElement("ol");
          albumList.setAttribute("class", "top_albums_list");
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
            albumList.appendChild(album_li);
          });
          if(this.body){
            this.body.innerHTML = "";
            this.body.appendChild(albumList);
          }else{
            console.log("TopAlbumsPanel: Body not yet defined");
            alert("Body: not yet defined");
          }
        },
        onRender : function(ct, position){
           console.log("TopAlbumsPanel.onRender");
           NowPlaying.ui.TopAlbumsPanel.superclass.onRender.apply(this, arguments);
           this.updateContent();
       }
    }),
});
