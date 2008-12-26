Utils.namespace("NowPlaying.ui.tabs", {
  HomeTab : Ext.extend(Ext.Panel, {
     title : "Home",  
     closable : false,
     initComponent : function(){
       NowPlaying.ui.tabs.HomeTab.superclass.initComponent.apply(this, arguments);
       this.add({ title : "About", 
                  cls : 'contentpanel',
                  width : 660,
                  html : "<div class='about'>Mushub is an experimental music aggregator.  To get started type the name of your favourite band/artist "
                       + "into the search box below.</div>",
               });
       this.add(new NowPlaying.ui.panels.SearchPanel({baseCls : 'x-panel', cls : "contentpanel search_panel", title : "Search", width: 660 }));
     },
  })
});
