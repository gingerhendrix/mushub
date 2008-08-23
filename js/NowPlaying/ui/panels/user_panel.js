Utils.namespace("NowPlaying.ui.panels", {    
  UserPanel : Ext.extend(Ext.Panel, {
      title: 'User',
      height: 120,
      width: 320,
      layout: 'fit',
      cls : 'user_panel',
      initComponent : function(){
        NowPlaying.ui.panels.UserPanel.superclass.initComponent.apply(this, arguments);
        this.datasource.connect("username", this, "onChange");
        this.onChange();
      },
      onChange : function(){
        if(this.subPanel){
          this.remove(this.subPanel);
        }
        if(this.datasource.username()){
          this.subPanel = new NowPlaying.ui.panels.UserInfoPanel({datasource : this.datasource.now_playing})
          this.setTitle("User Info");
          this.add(this.subPanel);
        }else{
          this.subPanel = new NowPlaying.ui.panels.UserLoginPanel({datasource : this.datasource});
          this.setTitle("User Login");
          this.add(this.subPanel);
        }
        this.doLayout();
      }
  })
});
