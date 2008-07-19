Utils.namespace("NowPlaying.utils", {
 DataBean : function(){
    this.properties = {};
    console.log("New Databean %o", this);
    this.connect = function(name, obj, method){
      MochiKit.Signal.connect(this, name, obj, method);
    }
    
    this.makeProp = function(prop){
      
      this[prop] = function(val){
        if(arguments.length > 0 && (MochiKit.Base.isUndefinedOrNull(val) || val != this.properties[prop]) ){
          this.properties[prop] = val;
          MochiKit.Signal.signal(this, prop, val);              
        }
        return this.properties[prop];
      }
      
    }
  }
});
