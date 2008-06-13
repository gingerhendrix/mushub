Utils.namespace("NowPlaying.ui", {
  DataPanel : function(){
    this.link = function(datasource, topic, elementClass, fn){
       var self = this;
       datasource.connect(topic, this, function(val){
        var elements = MochiKit.DOM.getElementsByTagAndClassName("*", elementClass, this.element);
        elements.forEach(function(el){
          fn.apply(self, [el, val]);
        });
      });
    }

    this.linkHtml = function(dataSource, topic, elementClass, def){
      this.link(dataSource, topic, elementClass, function(el, val){ el.innerHTML = ( val ? val : def ); });
    }
    
    this.linkImage = function(dataSource, topic, elementClass){
      this.link(dataSource, topic, elementClass, function(el, val){ el.src = val; });
    }
    
    this.linkStatus = function(datasource, elementClass){
      datasource.connect("beginUpdate", this, function(){  this.panel.getBottomToolbar().showBusy();  });
      datasource.connect("endUpdate", this, function(){   this.panel.getBottomToolbar().clearStatus();  });
    }
  }
});
