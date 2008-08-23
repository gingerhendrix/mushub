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
          var data = { avatar : this.datasource.avatar(),
                       track : this.datasource.track(),
                       artist : this.datasource.artist(),
                       album : this.datasource.album() };
                       
          var tpl = new Ext.XTemplate(
              '<div class="user_info">' + 
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
