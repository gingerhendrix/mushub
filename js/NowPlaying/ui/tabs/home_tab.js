Utils.namespace("NowPlaying.ui.tabs", {
  HomeTab : Ext.extend(Ext.Panel, {
     title : "Home",  
     closable : false,
     initComponent : function(){
       NowPlaying.ui.tabs.HomeTab.superclass.initComponent.apply(this, arguments);
       this.add({ title : "About", 
                  cls : 'contentpanel',
                  width : 660,
                  html : "<div class='about'>"
                       + "<img class='logo' src='images/custom/logo/mushub.png' width='333' height='40'></img>"
                       + "<h2>About</h2>"
                       + "<p>Mushub is an experimental music aggregator. Things may seem a little ghetto round here, this app is under active development and far from finished.</p>"
                       + "<h2>Getting Started</h2>"
                       + "<p>To get started type the name of your favourite band into the search box at the top, or try looking at the page for "
                       + "<a href='javascript:NowPlaying.Application.ui.openArtistTab(\"Sonic Youth\", \"\");'>Sonic Youth</a>"
                       + ", <a href='javascript:NowPlaying.Application.ui.openArtistTab(\"Yeah Yeah Yeahs\", \"\");'>Yeah Yeah Yeahs</a>"
                       + ", <a href='javascript:NowPlaying.Application.ui.openArtistTab(\"AC/DC\", \"\");'>AC/DC</a>"
                       + ", <a href='javascript:NowPlaying.Application.ui.openArtistTab(\"Eric Clapton\", \"\");'>Eric Clapton</a>"
                       + " or <a href='javascript:NowPlaying.Application.ui.openArtistTab(\"Pink Floyd\", \"\");'>Pink Floyd</a>"
                       + "</p>"
                       + "<h2>Services</h2>"
                       + "<p>Mushub currently uses these webservices (more to come):</p>"
                       + "<ul>"
                       + "<li>Last.fm</li>"
                       + "<li>Musicbrainz</li>"
                       + "<li>Wikipedia</li>"
                       + "<li>Yahoo Music</li>"
                       + "</ul>"
                       + "</div>",
               });
       //this.add(new NowPlaying.ui.panels.SearchPanel({baseCls : 'x-panel', cls : "contentpanel search_panel", title : "Search", width: 660 }));
     },
  })
});
