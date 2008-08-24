Utils.namespace("NowPlaying.ui.panels", {    
  UserInfoPanel : Ext.extend(Ext.Panel, {
        cls : 'user_info_panel',
        initComponent : function(){
          NowPlaying.ui.UserInfoPanel.superclass.initComponent.apply(this, arguments);
          this.datasource.connect("endUpdate", this, "onChange");
        },
        onChange : function(data){
          this.updateContent();
        },
        onRender : function(ct, position){
          NowPlaying.ui.UserInfoPanel.superclass.onRender.apply(this, arguments);
          this.updateContent();
        },
        updateContent : function(){
          if(!this.body){
            return;
          }
          
          if(!this.contentEl){
            this.contentEl = document.createElement("div");
            this.contentEl.setAttribute("class", "user_info");
            this.body.appendChild(this.contentEl);
          }
          
          this.contentEl.innerHTML = "";

          var img = document.createElement("img");
          img.setAttribute("class", "avatar");
          img.setAttribute("src", this.datasource.avatar());
          this.contentEl.appendChild(img);

          var now_playing = document.createElement("div");
          now_playing.setAttribute("class", "now_playing_body");

          var header = document.createElement("h3");
          header.innerHTML = "Recently Scrobbled";
          header.addEventListener("click", function(){
             NowPlaying.Application.ui.openRecentTracksWindow();
          }, false);
          now_playing.appendChild(header);
          
          var track = document.createElement("span");
          track.setAttribute("class", "track");
          track.innerHTML = this.datasource.track() || "";
          now_playing.appendChild(track);
   
          var artist = document.createElement("span");
          artist.setAttribute("class", "artist");
          artist.innerHTML = this.datasource.artist() || "";
          var artist_name = this.datasource.artist();
          var artist_mbid = this.datasource.artist_mbid();          
          artist.addEventListener("click", function(){
              NowPlaying.Application.ui.openArtistTab(artist_name, artist_mbid);
          }, false);
          now_playing.appendChild(artist);
          
          this.contentEl.appendChild(now_playing);
      }
  })
});
