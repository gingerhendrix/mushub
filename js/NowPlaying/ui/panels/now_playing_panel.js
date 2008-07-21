Utils.namespace("NowPlaying.ui.panels", {    
  NowPlayingPanel : Ext.extend(Ext.Panel, {
      	title: 'Now Playing',
        region:'north',
        height: 120,
        cls : 'contentpanel',
        width: 320,
        initComponent : function(){
          this.datasource.connect("endUpdate", this, "onChange");
          NowPlaying.ui.NowPlayingPanel.superclass.initComponent.apply(this, arguments);
        },
        onChange : function(data){
          this.updateContent();
        },
        updateContent : function(){
          var data = { avatar : this.datasource.avatar(),
                       track : this.datasource.track(),
                       artist : this.datasource.artist(),
                       album : this.datasource.album() };
                       
          var tpl = new Ext.XTemplate(
              '<div id="now_playing">' + 
                '<img class="avatar" src="{avatar}"></img>' + 
                '<div class="now_playing_body">' + 
                   '<span class="track">{track}</span>' + 
                   '<span class="by"> - </span>' + 
                   '<span class="artist">{artist}</span>' + 
                   '<div class="album_body">' + 
                     '<span class="album_title">From the album</span>' +
                      '<span class="album">{album}</span>' + 
                   '</div>' + 
                   '<span class="status"></span>' + 
                  '</div>' + 
               '</div>');
           tpl.overwrite(this.body, data);
      }
  })
});
