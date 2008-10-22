
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
          if(response.status==202){
             window.setTimeout(function(){self.update();}, 1000);
          }else if(response.errors && response.errors.length > 0){
            self.isLoading = false;    
            self.isError = true;
            MochiKit.Signal.signal(self, "onError", response.errors);
          }else{
            self.isLoading = false;    
            self.isError = false;
            self.onUpdate(response.data);
            MochiKit.Signal.signal(self, "endUpdate");
          }
      });
      d.addErrback(function(response){
        self.isError = true;
        MochiKit.Signal.signal(self, "onError", response);
        //self.onUpdate(response);
        console.error("Datasource[anon errback] : %o : %o", self, response);
      });
      return d;
    }
  
  }


});
