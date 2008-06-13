
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
      try{
        params = makeParams(this, config.params);
      }catch(e){
        return;
      }
      var url = NowPlaying.data.Webservice.url(config.service, params);
      var d = sendJSONPRequest(url, "jsonp");
      d.addCallback(bind(this.onUpdate, this));
      return d;
    }
  
  }


});
