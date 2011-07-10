enyo.kind({
  name: "EngagedBy.EventItems",
  kind: enyo.SlidingView,
  layoutKind: enyo.VFlexLayout,
  events: {
    "onListTap": "",
    "onRefreshTap": ""
  },
  published: {
    selectedRecord: null
  },
  components: [
    {name: "console", content: "select an item", style: "color: white; background-color: gray; border: 1px solid black; padding: 4px;"},
    {kind: "Header", content:"Events"},
    {kind: "WebService", url: "http://engagedby.com/users/9.json", onSuccess: "queryResponse", onFailure: "queryFail"},
    
    {kind: enyo.Scroller, flex: 1, components: [
      {kind: enyo.DividerDrawer, caption: "Time",components: [
        {kind: enyo.VirtualRepeater, name: "myItemList", onSetupRow: "getEvents", onclick: "doListTap", components: [
             {kind: enyo.Item, layout: enyo.HFlexBox, tapHighlight: true, components: [                
                 {name: "itemName", style: "text-overflow: ellipsis; overflow: hidden; white-space: nowrap;", content: "", flex: 1},
//                 {name: "itemOrganisation", style: "text-overflow: ellipsis; overflow: hidden; white-space: nowrap;", content: "1"},
//                 {name: "itemDescription", style: "text-overflow: ellipsis; overflow: hidden; white-space: nowrap;", content: "1"},
                 {name: "itemDate", style: "text-overflow: ellipsis; overflow: hidden; white-space: nowrap;", content: "1"}
             ]}
           ]}
      ]}
    ]},

/*
    {flex: 1, name: "list", kind: "VirtualList", className: "list", onSetupRow: "listSetupRow", components: [
      {kind: "Divider"},
        {kind: "Item", className: "item", onclick: "selectItem", Xonmousedown: "selectItem", components: [
          {kind: "HFlexBox", components: [
            {name: "itemColor", className: "item-color"},
            {name: "itemName", flex: 1},
            {name: "itemIndex", className: "item-index"}
        ]},
        {name: "itemOrganisation", className: "item-organisation"},
        {name: "itemDescription", className: "item-description"}
      ]}
    ]},*/
    {kind: enyo.Toolbar, pack: "justify", components: [
      {kind: enyo.GrabButton},
      {flex: 1},
      {icon: "images/Refresh.png", onclick: "doRefreshTap", align: "right"}
    ]}

//    {name: "console", style: "color: white; background-color: gray; padding: 4px; border: 1px solid black"}
  ],
  
  console: function(inMessage) {
    this.$.console.setContent(inMessage);
  },
  
  create: function() {
    this.data = [];
    this.inherited(arguments);
    this.$.webService.call();
    this.console("EventsItem.create has been called --------!");
  },
  
  getEvents: function(inSender, inIndex) {
    console.log("EventsItem.getEvents has been called --------!");
    this.console("EventsItem.getEvents has been called --------!");
    if(this.data.length == 0) return false;
    var events = this.data[inIndex];
    
    if (events) {
      this.console("Our json string: " + enyo.json.stringify(this.data[inIndex]));
      var groupId = events.entity.id;
      var eventName = events.entity.name;
      var groupImage = events.entity.profile_image_url;
      this.console("EventName: " + eventName);

      // bind data to item controls
      this.setupDivider(inIndex);
//      this.$.item.applyStyle("background-color", inSender.isSelected(inIndex) ? "lightblue" : null);
      this.$.itemDate.setContent("(" + inIndex + ")");
      this.$.itemName.setContent(eventName);
      this.$.itemOrganisation.applyStyle("font-size", "smaller");
      this.$.itemOrganisation.applyStyle("font-weight", "bold");
      this.$.itemOrganisation.setContent(record.organisation);
      this.$.itemDescription.applyStyle("color", "grey");
      this.$.itemDescription.applyStyle("font-size", "smaller");
      this.$.itemDescription.setContent(groupImage);
      return true;
    }
  },
  
  queryResponse: function(inSender, inResponse) {
    console.log("queryResponse!");
    this.console("EventsItem.queryResponse has been called --------!");
/*    console.log(JSON.stringify(inResponse.user.groups));
    console.log(JSON.stringify(inResponse.user.groups[0].entity));
    console.log(inResponse.user.groups[0].entity.name);
  */  
    this.data = inResponse.user.groups;
    this.$.myItemList.render();
  },
  
  queryFail: function(inSender, inResponse) {
    
  },
  
  /*repeaterSetupRow: function(inSender, inIndex) {
    this.console("EventsItem.repeaterSetupRow has been called --------!");
    
    var d = this.repeaterData;
    var record = d && d.items && d.items[inIndex];
    if (record) {
      this.$.repeaterItem.setContent(record.number);
      return true;
    }
  },*/
  
  lastOpen: null,
  
  itemCaptionClick: function(inSender, inEvent) {
    var r = inEvent.rowIndex;
    // get row data
    var d = this.data[r];
    if (!(d && d.items)) {
      this.fetchDataForRow(r, this.data[r]);
    } else {
      this.toggleDrawer(r);
    }
  },
  selectItem: function(inSender, inEvent) {
    this.$.list.select(inEvent.rowIndex);
  }
});


/*  
  
  ----------------
  create: function() {
    this.data = [];
    this.inherited(arguments);
    this.$.webService.call();
  },
  
  queryResponse: function(inSender, inResponse) {
    this.data = inResponse.results;
    this.$.list.refresh();
  },
  
  getGroupName: function(inIndex) {
    // get previous record
    var r0 = this.data[inIndex -1];
    // get (and memoized) first letter of last name
    if (r0 && !r0.letter) {
      r0.letter = r0.name.split(" ").pop()[0];
    }
    var a = r0 && r0.letter;
    // get record
    var r1 = this.data[inIndex];
    if (!r1.letter) {
      r1.letter = r1.name.split(" ").pop()[0];
    }
    var b = r1.letter;
    // new group if first letter of last name has changed
    return a != b ? b : null;
  },
  
  setupDivider: function(inIndex) {
    // use group divider at group transition, otherwise use item border for divider
    var group = this.getGroupName(inIndex);
    this.$.divider.setCaption(group);
    this.$.divider.canGenerate = Boolean(group);
    this.$.item.applyStyle("border-top", Boolean(group) ? "none" : "1px solid silver;");
  },
  
  listSetupRow: function(inSender, inIndex) {
    var record = this.data[inIndex];
    if (record) {
      // bind data to item controls
      this.setupDivider(inIndex);
      this.$.item.applyStyle("background-color", inSender.isSelected(inIndex) ? "lightblue" : null);
      this.$.itemIndex.setContent("(" + inIndex + ")");
      this.$.itemName.setContent(record.name);
      this.$.itemColor.applyStyle("background-color", record.color);
      this.$.itemOrganisation.applyStyle("font-size", "smaller");
      this.$.itemOrganisation.applyStyle("font-weight", "bold");
      this.$.itemOrganisation.setContent(record.organisation);
      this.$.itemDescription.applyStyle("color", "grey");
      this.$.itemDescription.applyStyle("font-size", "smaller");
      this.$.itemDescription.setContent(record.description);
      return true;
    }
  },
  */
