Utils.namespace("NowPlaying.ui.panels", {
  ArtistMembersPanel : Ext.extend(Ext.Panel, {
    title: 'Related Artists',
    cls : 'contentpanel',
    layout : 'accordion',
    width: 160,
    initComponent : function(){
      this.datasource.connect("endUpdate", this, "onChange");
      NowPlaying.ui.panels.ArtistMembersPanel.superclass.initComponent.apply(this, arguments);
    },
    onChange : function(data){
      this.updateContent();
    },
    updateContent : function(){
      var rels = this.datasource.artist_relations();
      if(!rels || rels.length == 0){
        return;        
      }
      if(this.datasource.isLoading && this.body){
        this.items.clear();
        this.body.innerHTML = "Loading";
        return;
      }
      
      this.items.clear();
      var groups = { "MemberOfBand-backward" : { displayName : "Band Members", members : [] },
                     "MemberOfBand-both" : { displayName : "Member of Band", members : [] },
                     "Collaboration-both" : {displayName : "Collaborations", members : [] },
                     "Collaboration-backward" : {displayName : "Collaborations", members : [] }
                    };
      var groupKeys = ["MemberOfBand-backward", "MemberOfBand-both", "Collaboration-both", "Collaboration-backward"];
      
      for(var i=0; i< rels.length; i++){
        var rel = rels[i];
        var key = rel.type + "-" + rel.direction;
        var group = groups[key];
        if(!group){
           console.log("Creating new key " + key);
           groups[key] = {
              displayName : rel.type,
              members : []
            }
            group = groups[key];
            groupKeys.push(key);
        }
        group.members.push(rel);
      }
      
      for(var j=0; j< groupKeys.length; j++){
        var group = groups[groupKeys[j]];
        if(!group){ alert("Group " + groupKeys[j] + " not defined"); return;  };
        if(group.members.length > 0){
          this.addSubPanel(group.displayName, group.members) 
        }
      }
      this.doLayout();
    },
    addSubPanel : function(name, members){
      var data = {members : members, type: name};
      var store = new Ext.data.JsonStore({
        data : data,
        root : 'members',
        fields : ['name', 'type', 'mbid', 'beginDate', 'endDate']
      });
      var tpl = new Ext.XTemplate(
        '<ul class="relations">',  
        '<tpl for=".">',
        '<li class="relation">',
        '{name}',
        '</li>',
        '</tpl>',
        '</ul>'
      );
      items = new Ext.DataView({
          autoHeight: true,
          store: store,
          tpl : tpl,
          overClass:'x-view-over',
          itemSelector: "li.relation"
        });
     var subPanel = new Ext.Panel({
        title: name,
        autoHeight: true,
        items :  items
      });
      items.on("click", function(dataview, index, node, e){
        NowPlaying.Application.ui.openArtistTab(store.getAt(index).get('name'), store.getAt(index).get('mbid'));
      });
      this.add(subPanel);
    },
    onRender : function(ct, position){
      NowPlaying.ui.panels.ArtistMembersPanel.superclass.onRender.apply(this, arguments);
      this.updateContent();
   }
  })
});

