
Utils.namespace("NowPlaying.data", { 
  Datasource : function(config){
    Utils.extend(this, new NowPlaying.utils.DataBean());
     
    function makeParams(self, params){
      var paramObj = {}
      params.forEach(function(param){
        if(typeof param == "string"){
          paramObj[param] = self[param];
        }else{
          paramObj[param.name] = self[param.prop];
        }
      });
      return paramObj;
    }
    
    this.update = function(){
      console.log("Datasource.update : %o ", this);
      MochiKit.Signal.signal(this, "beginUpdate");
      this.isLoading = true;
      try{
        params = makeParams(this, config.params);
      }catch(e){
        return;
      }
      var url = NowPlaying.data.Webservice.url(config.service, params);
      var d = sendJSONPRequest(url, "jsonp");
      var self = this;
      d.addCallback(function(response){
          console.log("Datasource[anonymous callback] : %o : %o", self, response);
          self.isLoading = false;    
          self.isError = false;
          self.onUpdate(response);
          MochiKit.Signal.signal(self, "endUpdate");
      });
      d.addErrback(function(response){
        self.isError = true;
        MochiKit.Signal.signal(self, "onError");
        //self.onUpdate(response);
        console.error("Datasource[anon errback] : %o : %o", self, response);
      });
      return d;
    }
  
  }


});
