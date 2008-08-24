Utils.namespace("NowPlaying.ui.windows", {
  RecentTracksWindow : Ext.extend(Ext.Window, {
    title: 'Recent Tracks',
    ctCls : 'recent_tracks_window',
    width: 640,
    closable: true,
    autoHeight : true,
    initComponent : function(){
      this.datasource.connect("beginUpdate", this, "onChange");
      this.datasource.connect("endUpdate", this, "onChange");
      this.datasource.connect("error", this, "onError");
      
      NowPlaying.ui.windows.RecentTracksWindow.superclass.initComponent.apply(this, arguments);
    },
    onChange : function(data){
      this.updateContent();
    },
    onError : function(error){
      this.contentEl.innerHTML = "" + error + "<br/>";
      return;
    },
    updateContent : function(){
      if(!this.body){
         return;
      }
      if(!this.contentEl){
        this.contentEl = document.createElement("div");
        this.contentEl.setAttribute("class", "album_info");
        this.body.appendChild(this.contentEl);
      }

      if(this.datasource.isLoading ){
        this.contentEl.innerHTML = "Loading...";
        return;
      }
      if( this.datasource.isError ){
        this.contentEl.innerHTML = "Error Loading Data";
        return;
      }
      var recent_tracks = this.datasource.recent_tracks();
      if(!recent_tracks || recent_tracks.length == 0 ){
         this.contentEl.innerHTML = "No recent tracks found.";      
      }
      var track_list = "<table>";
      var self = this;
      recent_tracks.forEach(function(track){
        track_list += "<tr><td class='artist'>"+track.artist+"</td> <td class='track'>"+track.name+"</td><td class='time'>"+self.prettyDateDifference(track.date_uts)+"</td></tr>";
      });  
      track_list += "</table>";
      this.contentEl.innerHTML = track_list;

    },
    onRender : function(ct, position){
      NowPlaying.ui.windows.RecentTracksWindow.superclass.onRender.apply(this, arguments);
      this.updateContent();
   },
   prettyDateDifference : function(uts_date){
      var now = (new Date()).getTime()/1000;
      console.log("DateDifference " + now + " : " + uts_date);
      var difference = now - Number(uts_date);
      if(difference > 3600*24*2){
        var days = Math.floor(difference/(3600*24));   
        return days + "days ago"; 
      }if(difference > 3600*24){
        var days = Math.floor(difference/(3600*24));   
        var hrs =  Math.round((difference - (days*3600*24))/3600);
        return days + "day " + hrs + "hrs ago"; 
      }else if(difference > 3600){
        var hrs =  Math.round(difference/3600);   
        return hrs + "hrs ago";
      }else if(difference > 60){
         return Math.round(difference/60) + "mins ago";   
      }else{
         return Math.round(difference) + "s ago";   
      }
       
   },
  })
});

