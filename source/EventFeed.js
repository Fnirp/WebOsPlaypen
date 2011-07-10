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
            {kind: enyo.Item, name: "item", layout: enyo.HFlexBox, tapHighlight: true, onclick: "selectItem", components: [
               {name: "itemTitle", style: "text-overflow: ellipsis; overflow: hidden; white-space: nowrap;", content: ""},
               {name: "itemAmount", style: "text-overflow: ellipsis; overflow: hidden; white-space: nowrap;", content: "1"}
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

      this.$.itemTitle.setContent(groupName);
      this.$.itemAmount.setContent(groupEventsCount);
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
    this.console("EventsFeed.selectItem is called !" + inEvent.rowIndex);
//    this.$.item.select(inEvent.rowIndex);  //this doesn't work for whatever reason..
    var group = this.data[inEvent.rowIndex];
//    this.console(JSON.stringify(this.data[inEvent.rowIndex]));
    var url = group.entity.events_url;
    this.console("eventsurl" + url);
    
//    this.console("after geturl ");
    this.owner.loadEventItems(url);
  }

});