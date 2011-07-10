enyo.kind({
  name: "EngagedBy.EventFeed",
  kind: enyo.SlidingView,
  layoutKind: enyo.VFlexLayout,
  events: {
    "onListTap": "",
    "onRefreshTap": ""
  },
  components: [
    {kind: "Header", name: "header", content: "Groups"},
    {kind: "WebService", onSuccess: "queryResponse", onFailure: "queryFail"},

    {kind: enyo.Scroller, flex: 1, components: [
      {kind: enyo.DividerDrawer, caption: "My Groups",components: [
        {kind: enyo.VirtualRepeater, name: "myGroupsList", onSetupRow: "getGroup", components: [
// from feedreader           {kind: "Item", className: "item", onclick: "selectItem", Xonmousedown: "selectItem", components: [
 //  previously         {kind: enyo.Item, className: "item", layout: enyo.HFlexBox, tapHighlight: true, onclick: "selectItem", components: [

            {kind: enyo.Item, name: "item", tapHighlight: true, onclick: "selectItem", Xonmousedown: "selectItem", components: [
               {kind: "HFlexBox", pack: "top", components: [
                 {name: "itemIcon", kind: "Image", style: "width: 48px; height: 48px; border: 2px solid #ccc;", flex: 1},
                 {kind: "VFlexBox", pack: "top", components: [
                   {name: "itemTitle", style: "margin-left: 10px; text-overflow: ellipsis; overflow: hidden; white-space: nowrap;", content: "1"},
                   {name: "itemAmount", style: "margin-left: 10px; text-overflow: ellipsis; overflow: hidden; white-space: nowrap;", content: "1"}
                 ]}
               ]}
             ]}
           ]}
      ]}
    ]},
    {name: "console", content: "select an item", style: "color: white; background-color: gray; border: 1px solid black; padding: 4px;"},

    {kind: enyo.Toolbar, pack: "justify", components: [
      {flex: 1},
      {icon: "images/Refresh.png", onclick: "doRefreshTap", align: "right"}
    ]}
  ],

  console: function(inMessage) {
    this.$.console.setContent(inMessage);
  },

  create: function() {
    this.data = [];
    this.selectedRow = -1;
    this.inherited(arguments);
  },

  loadGroupsPane: function(url) {
    console.log("3 user_id: " + url);
    this.$.webService.setUrl(url);
    this.$.webService.call();
  },

  getGroup: function(inSender, inIndex) {
    if(this.data.length === 0) { return false; }
    var group = this.data[inIndex];

    if (group) {
      

      var groupId = group.entity.id;
      var groupName = group.entity.name;
      var groupEventsCount = group.entity.events_count;
      var groupEventsImage = group.entity.profile_image_url;

      // check if the row is selected
      var isRowSelected = (inIndex == this.selectedRow);
  //    this.selectedRow = - 1; //reset it so that if we change the group it's not defaulting

      // color the row if it is
      this.$.item.applyStyle("background", isRowSelected ? "lightblue" : null);
 
      if(groupEventsImage != ""){
        this.$.itemIcon.show();
        this.$.itemIcon.setSrc(groupEventsImage);
      }else{
        this.$.itemIcon.hide();
      }

      this.$.itemTitle.setContent(groupName);
      this.$.itemAmount.setContent(groupEventsCount + " event(s)");
      return true;
    }
  },

  queryResponse: function(inSender, inResponse) {
    console.log("queryResponse!");
    console.log(JSON.stringify(inResponse.user.groups));
    console.log(JSON.stringify(inResponse.user.groups[0].entity));
    console.log(inResponse.user.groups[0].entity.name);

    this.data = inResponse.user.groups;
    this.$.myGroupsList.render();
  },

  queryFail: function(inSender, inResponse) {
    console.log("queryFail!");
  },

 selectItem: function(inSender, inEvent) {
    this.selectedRow = inEvent.rowIndex;
    
    var group = this.data[inEvent.rowIndex];
    var url = group.entity.events_url;
    
    this.$.myGroupsList.render();

    this.owner.loadEventItems(url);
  }

});