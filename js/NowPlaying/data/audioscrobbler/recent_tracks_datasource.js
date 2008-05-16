
Utils.namespace("NowPlaying.data.audioscrobbler", { 
  RecentTracksDatasource : function (username){
    this.username = username;

    this.makeProp("recent_tracks");
    
    this.update = function(){
      var url = NowPlaying.data.Webservice.url("audioscrobbler/recent_tracks", { username : this.username })
      var d = MochiKit.Async.sendJSONPRequest(url, "jsonp");
      d.addCallback(bind(this.onUpdate, this));
      return d
    }
    
    this.onUpdate = function(response){
      this.recent_tracks(response);
    }
  } 
});

NowPlaying.data.RecentTracksDatasource.prototype = new NowPlaying.utils.DataBean();
