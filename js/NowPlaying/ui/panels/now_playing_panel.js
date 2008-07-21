Utils.namespace("NowPlaying.ui.panels", {    
  NowPlayingPanel : Ext.extend(Ext.Panel, {
      	title: 'User Info',
        height: 120,
        cls : 'now_playing_panel',
        //margins:  '50 50 50 50',
        //cmargins:  '50 50 50 50',
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
              '<div class="now_playing">' + 
                '<img class="avatar" src="{avatar}"></img>' + 
                '<div class="now_playing_body">' + 
                   '<h3>Last played</h3>' + 
                     '<span class="track">{track}</span>' + 
                     '<span class="by"> - </span>' + 
                     '<span class="artist">{artist}</span>' + 
                '</div>' + 
              '</div>');
           tpl.overwrite(this.body, data);
      }
  })
});
