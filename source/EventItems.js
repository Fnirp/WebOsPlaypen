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
    {kind: "Header", content:"Events"},
    {kind: "WebService", onSuccess: "queryResponse", onFailure: "queryFail"},

    //{kind: "WebService", url: "http://engagedby.com/users/9.json", onSuccess: "queryResponse", onFailure: "queryFail"},
    
    {kind: enyo.Scroller, flex: 1, components: [
      {kind: enyo.DividerDrawer, caption: "Time",components: [
        {kind: enyo.VirtualRepeater, name: "myItemList", onSetupRow: "getEvents", onclick: "selectItem", components: [
            {kind: enyo.Item, name: "item", layout: enyo.HFlexBox, tapHighlight: true, components: [   
                 {kind: "HFlexBox", components: [
                   {name: "itemName", flex: 1, style: "text-overflow: ellipsis; overflow: hidden; white-space: nowrap;", content: "", flex: 1},
                   {name: "itemDate", style: "text-overflow: ellipsis; overflow: hidden; white-space: nowrap;", content: "1"}
                 ]},
                 {name: "itemOrganisation", style: "text-overflow: ellipsis; overflow: hidden; white-space: nowrap;", content: "1"},
                 {name: "itemDescription", style: "text-overflow: ellipsis; overflow: hidden; white-space: nowrap;", content: "1"}
             ]}
           ]}
      ]}
    ]},

    {name: "console", content: "select an item", style: "color: white; background-color: gray; border: 1px solid black; padding: 4px;"},

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

  ],
  
  console: function(inMessage) {
    this.$.console.setContent(inMessage);
  },
    
  create: function() {
    this.data = [];
    this.inherited(arguments);
  },

  loadEventItemsPane: function(url) {
    console.log("3 user_id: " + url);
    this.console("loadEventItemsPane is called");
    this.console("Url is: " + url);
    this.$.webService.setUrl(url);
    this.$.webService.call();
  },

  
  getEvents: function(inSender, inIndex) {
    if(this.data.length == 0) return false;
    var events = this.data[inIndex];
    
    if (events) {
      this.console("Our json string: " + enyo.json.stringify(this.data[inIndex]));
      var groupId = events.entity.id;
      var eventName = events.entity.name;
      var groupImage = events.entity.profile_image_url;
      this.console("EventName: " + eventName);

      // bind data to item controls
  //    this.$.item.applyStyle("background-color", inSender.isSelected(inIndex) ? "lightblue" : null);
      this.$.itemName.setContent(eventName);
      this.$.itemDate.setContent("24 May");
      this.$.itemOrganisation.applyStyle("font-size", "smaller");
      this.$.itemOrganisation.applyStyle("font-weight", "bold");
      this.$.itemOrganisation.setContent("My organisation");
      this.$.itemDescription.applyStyle("color", "grey");
      this.$.itemDescription.applyStyle("font-size", "smaller");
      this.$.itemDescription.setContent("Some description");
      return true;
    }
  },
  
  queryResponse: function(inSender, inResponse) {
    console.log("queryResponse!");
    this.console("EventsItem.queryResponse has been called --------!");
    if(inResponse.user) {
      this.data = inResponse.user.group_events[0][1]; // [["aug 2011",[list of events]]
    } else {
      this.data = inResponse.entity.group_events[0][1];
    }
    this.console(JSON.stringify(this.data));
    this.$.myItemList.render();
  },
  
  queryFail: function(inSender, inResponse) {
    
  },
  
  getItemUrl: function() {
     var request_url = "http://engagedby.com/users/" + localStorage.getItem('user_id') + ".json";
     return request_url;
  },
  
  selectItem: function(inSender, inEvent) {
   // this.$.list.select(inEvent.rowIndex); //this doesn't work for whatever reason ....
    var request_url = getItemUrl();
    this.owner.loadEventView(request_url);
  }

});

