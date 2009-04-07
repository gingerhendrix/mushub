
var Webservice = {
    SERVER : "http://example.org",
    url : function(service, options){
      var queryString = MochiKit.Base.queryString(options);
      return this.SERVER + "/" + service + ".js?" + queryString;
    }
  
  }

