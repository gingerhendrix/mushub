
Utils.namespace("NowPlaying.data", { 
  Webservice : {
    SERVER : "http://localhost:4567",
    url : function(service, options){
      var queryString = MochiKit.Base.queryString(options);
      return this.SERVER + "/" + service + ".js?" + queryString;
    }
  
  }
});
