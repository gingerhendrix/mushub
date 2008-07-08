
Utils.namespace("NowPlaying.data.audioscrobbler", { 
  UserInfoDatasource : function(username){
    this.username = username;
    
    Utils.extend(this, new NowPlaying.data.Datasource(
                                       { service : "audioscrobbler/user_info",
                                         params : ["username"]
                                       }));    
    
    this.makeProp("country");
    this.makeProp("url");
    this.makeProp("avatar");

    this.onUpdate = function(user){
      this.country(user.country);
      this.url(user.url);
      this.avatar(user.avatar);
    }
 }
});

