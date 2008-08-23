Utils.namespace("NowPlaying.utils", {
 DataBean : function(){
    this.properties = {};
    this.connect = function(name, obj, method){
      MochiKit.Signal.connect(this, name, obj, method);
    }
    this.signal = function(name, val){
      console.log("Signal %o, %s, %o", this, name, val);
      MochiKit.Signal.signal(this, name, val);
    }
    
    this.makeProp = function(prop){
      
      this[prop] = function(val){
        if(arguments.length > 0 && (MochiKit.Base.isUndefinedOrNull(val) || val != this.properties[prop]) ){
          this.properties[prop] = val;
          this.signal(prop, val);              
        }
        return this.properties[prop];
      }
      
    }
  }
});
