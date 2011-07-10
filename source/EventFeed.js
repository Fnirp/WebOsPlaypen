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
    {kind: "WebService", name: "myGroupsService", onSuccess: "queryResponse", onFailure: "queryFail"},
    {kind: "WebService", name: "otherGroupsService", onSuccess: "otherGroupsResponse", onFailure: "otherGroupsFail"},

    {kind: enyo.Scroller, flex: 1, components: [
      {kind: enyo.DividerDrawer, caption: "My Groups",components: [
        {kind: enyo.VirtualRepeater, name: "myGroupsList", onSetupRow: "getGroup", onclick: "selectItem", components: [
          {kind: enyo.Item, layout: enyo.HFlexBox, tapHighlight: true, components: [
            {kind: "HFlexBox", pack: "top", components: [
              {name: "itemIcon", kind: "Image", style: "width: 48px; height: 48px; border: 2px solid #ccc;", flex: 1},
              {kind: "VFlexBox", pack: "top", components: [
                {name: "itemTitle", style: "margin-left: 10px; text-overflow: ellipsis; overflow: hidden; white-space: nowrap;", content: "1"},
                {name: "itemAmount", style: "margin-left: 10px; text-overflow: ellipsis; overflow: hidden; white-space: nowrap;", content: "1"}
              ]},
            ]}
          ]}
        ]}
      ]},
      {kind: enyo.DividerDrawer, caption: "Popular Groups",components: [
        {kind: enyo.VirtualRepeater, name: "otherGroupsList", onSetupRow: "getOtherGroup", onclick: "selectOtherGroupItem", components: [
          {kind: enyo.Item, layout: enyo.HFlexBox, tapHighlight: true, components: [
            {kind: "HFlexBox", pack: "top", components: [
              {name: "otherGroupItemIcon", kind: "Image", style: "width: 48px; height: 48px; border: 2px solid #ccc;", flex: 1},
              {kind: "VFlexBox", pack: "top", components: [
                {name: "otherGroupItemTitle", style: "margin-left: 10px;", content: "1"},
                {name: "placeHolder", style: "margin-left: 10px;", content: ""},
              ]},
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
    this.data = {};
    this.selectedRow = -1;
    this.inherited(arguments);
  },

  loadGroupsPane: function(url) {
    console.log("3 user_id: " + url);
    this.$.myGroupsService.setUrl(url);
    this.$.myGroupsService.call();
  },
  
  loadOtherGroupsPane: function(url) {
    console.log("loadOtherGroups: " + url);
    this.$.otherGroupsService.setUrl(url);
    this.$.otherGroupsService.call();
  },

  getGroup: function(inSender, inIndex) {
    if(!this.data['myGroups']) { return false; }
    var group = this.data['myGroups'][inIndex];

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
  
  getOtherGroup: function(inSender, inIndex){
    if(!this.data['otherGroups']) { return false; }
    var otherGroup = this.data['otherGroups'][inIndex];

    if (otherGroup) {
      var groupId = otherGroup.entity.id;
      var groupName = otherGroup.entity.name;
      var groupEventsCount = otherGroup.entity.events_count;
      var groupEventsImage = otherGroup.entity.profile_image_url;

      if(groupEventsImage !== ""){
        this.$.otherGroupItemIcon.setSrc(groupEventsImage);
      }else{
        this.$.otherGroupItemIcon.setSrc("../../images/EngagedByIcon.png");
      }

      this.$.otherGroupItemTitle.setContent(groupName);
      return true;
    }
  },

  

  queryResponse: function(inSender, inResponse) {
    console.log("queryResponse!");
    console.log(JSON.stringify(inResponse.user.groups));
    console.log(JSON.stringify(inResponse.user.groups[0].entity));
    console.log(inResponse.user.groups[0].entity.name);

    this.data['myGroups'] = inResponse.user.groups;
    this.$.myGroupsList.render();
  },
  
  otherGroupsResponse: function(inSender, inResponse) {
    console.log("otherGroupsResponse!");
    console.log(JSON.stringify(inResponse.user.other_groups));
    console.log(JSON.stringify(inResponse.user.other_groups[0].entity));
    console.log(inResponse.user.other_groups[0].entity.name);
  
    this.data['otherGroups'] = inResponse.user.other_groups.slice(0, 20);
    this.$.otherGroupsList.render();
  },

  queryFail: function(inSender, inResponse) {
    console.log("queryFail!");
  },

  selectItem: function(inSender, inEvent) {
    this.console("EventsFeed.selectItem is called !" + inEvent.rowIndex);
    var group = this.data["myGroups"][inEvent.rowIndex];
    this.selectedRow = inEvent.rowIndex;
    
    var url = group.entity.events_url;
    
    this.$.myGroupsList.render();

    this.owner.loadEventItems(url);
  },
  
  selectOtherGroupItem: function(inSender, inEvent) {
    this.console("EventsFeed.selectOtherGroupItem is called !" + inEvent.rowIndex);
    var group = this.data['otherGroups'][inEvent.rowIndex];
    var url = group.entity.events_url;
    this.console("********OtherGroupItem eventsurl" + url);

    this.owner.loadEventItems(url);
  }

});