Utils.namespace("NowPlaying.ui.panels", {
  ArtistLinksPanel : Ext.extend(Ext.Panel, {
    title: 'Links',
    cls : 'contentpanel',
    layout : 'accordion',
    width: 160,
    initComponent : function(){
      this.items = [new NowPlaying.ui.panels.MusicbrainzLinksPanel( { datasource : this.datasource.musicbrainz } ),
                    new NowPlaying.ui.panels.TorrentSearchPanel({ datasource : this.datasource.torrents })];
                   
      NowPlaying.ui.panels.ArtistLinksPanel.superclass.initComponent.apply(this, arguments);
      
    },
  })
});

