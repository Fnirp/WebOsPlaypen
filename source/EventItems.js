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
      {kind: enyo.DividerDrawer, caption: "Upcoming",components: [
        {kind: enyo.VirtualRepeater, name: "myItemList", onSetupRow: "getEvents", components: [
            {kind: enyo.Item, name: "item", layout: enyo.HFlexBox, tapHighlight: true, onclick: "selectItem", components: [
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

//    {name: "console", content: "select an item", style: "color: white; background-color: gray; border: 1px solid black; padding: 4px;"},

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
    this.selectedRow = -1;
    this.inherited(arguments);
  },

  loadEventItemsPane: function(url) {
    this.$.webService.setUrl(url);
    this.$.webService.call();
  },

  getEvents: function(inSender, inIndex) {
    if(this.data.length === 0) { return false; }
    var item = this.data[inIndex];

    if (item) {
      var eventName = item.event.name;
      var groupId = item.event.entity.id;
      var groupImage = item.event.entity.profile_image_url;

      var isRowSelected = (inIndex === this.selectedRow); // check if the row is selected

      // color the row if it is
      this.$.item.applyStyle("background", isRowSelected ? "lightblue" : null);
      //populate the rows

      this.$.itemName.setContent(eventName);
      this.$.itemDate.setContent("");
      this.$.itemOrganisation.applyStyle("font-size", "smaller");
      this.$.itemOrganisation.applyStyle("font-weight", "bold");
      this.$.itemOrganisation.setContent(item.event.entity.name);
      this.$.itemDescription.applyStyle("color", "grey");
      this.$.itemDescription.applyStyle("font-size", "smaller");
      if(item.event.location_text) {
        this.$.itemDescription.setContent(item.event.start_date_formatted + " - " + item.event.location_text);
      } else {
        this.$.itemDescription.setContent(item.event.start_date_formatted);
      }
      return true;
    }
  },

  queryResponse: function(inSender, inResponse) {
    if(inResponse.user) {
      this.data = inResponse.user.group_events[0][1]; // [["aug 2011",[list of events]]
    } else {
      this.data = inResponse.entity.group_events[0][1];
    }
    this.$.myItemList.render();
  },

  queryFail: function(inSender, inResponse) {

  },

  getItemUrl: function() {
     var request_url = "http://engagedby.com/users/" + localStorage.getItem('user_id') + ".json";
     return request_url;
  },

  selectItem: function(inSender, inEvent) {
    this.selectedRow = inEvent.rowIndex;

    var item = this.data[inEvent.rowIndex];
    var url = item.event.webpage_url;
    this.owner.loadEventView(url, item.event);
    this.$.myItemList.render();
  }

});
