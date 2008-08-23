Utils.namespace("NowPlaying.ui.panels", {    
  UserLoginPanel : Ext.extend(Ext.Panel, {
        cls : 'user_login_panel',
        onRender : function(ct, position){
          NowPlaying.ui.panels.UserLoginPanel.superclass.onRender.apply(this, arguments);
          
          if(!this.contentEl){
            this.contentEl = document.createElement("div");
            this.contentEl.setAttribute("class", "user_login");
            this.body.appendChild(this.contentEl);
          }
          this.contentEl.innerHTML = "";
          this.contentEl.innerHTML += "<img src='images/custom/lastfm.png' width='103' height='50'></img>";
          this.contentEl.innerHTML += "<h3>Connect to Last.fm</h3>"; 
          this.contentEl.innerHTML += "<input type='text' value='lastfm username' onchange='NowPlaying.Application.updateUsername(this.value);'></input>";
           
        }
  })
});
