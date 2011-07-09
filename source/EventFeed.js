enyo.kind({
	name: "EngagedBy.EventFeed",
	kind: enyo.SlidingView,
	layoutKind: enyo.VFlexLayout,
	events: {
		"onListTap": "",
		"onRefreshTap": ""
	},
	components: [
	  {kind: "Header", content: "Groups"},
		{kind: "WebService", url: "http://engagedby.com/users/8.json", onSuccess: "queryResponse", onFailure: "queryFail"},

    {kind: enyo.Scroller, flex: 1, components: [
      {kind: enyo.DividerDrawer, caption: "My Groups",components: [
        {kind: enyo.VirtualRepeater, name: "myGroupsList", onSetupRow: "getGroup", onclick: "doListTap", components: [
             {kind: enyo.Item, layout: enyo.HFlexBox, tapHighlight: true, components: [
               {name: "listItemTitle", style: "text-overflow: ellipsis; overflow: hidden; white-space: nowrap;", content: ""},
               {name: "listItemSize", style: "text-overflow: ellipsis; overflow: hidden; white-space: nowrap;", content: "1"}
             ]}
           ]}
      ]}
    ]},
		{kind: enyo.Toolbar, pack: "justify", components: [
			{flex: 1},
			{icon: "images/Refresh.png", onclick: "doRefreshTap", align: "right"}
		]}
	],

	create: function() {
		this.data = [];
		this.inherited(arguments);

		this.$.header.setContent(localStorage.getItem("user_id"));
		this.$.webService.call();
	},

	getGroup: function(inSender, inIndex) {
	  if(this.data.length == 0) return false;
		var group = this.data[inIndex];

    if (group) {
      var groupId = group.entity.id;
      var groupName = group.entity.name;
      var groupEventsCount = group.entity.events_count;
      var groupEventsImage = group.entity.profile_image_url;

      this.$.listItemTitle.setContent(groupName);
      this.$.listItemSize.setContent(groupEventsCount);
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

	},

	repeaterSetupRow: function(inSender, inIndex) {
		var d = this.repeaterData;
		var record = d && d.items && d.items[inIndex];
		if (record) {
			this.$.repeaterItem.setContent(record.number);
			return true;
		}
	},

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
	// do asynchonous call for additional data
	// note: normally would use a service call for this, just mocking the delay for now.
	// note that private data like the rowIndex can be placed on the service request object.
  // fetchDataForRow: function(inRowIndex, inRowData) {
  //  enyo.job("fetchDataForRow" + inRowIndex, enyo.bind(this, "gotDataForRow", inRowIndex, inRowData, this.makeSubData()), 100);
  // },
  // gotDataForRow: function(inRowIndex, inRowData, inSubData) {
  //  inRowData.items = inSubData;
  //  // populate the row's repeater with data
  //  this.$.list.prepareRow(inRowIndex);
  //  this.repeaterData = inRowData;
  //  //
  //  this.$.itemDrawer.render();
  //  this.$.list.prepareRow(inRowIndex);
  //  // toggle the drawer
  //  this.toggleDrawer(inRowIndex);
  // },
  // // want only one drawer open at a time.
  // toggleDrawer: function(inRowIndex) {
  //  this.animationCount = 1;
  //  // toggle and remember state
  //  this.$.itemDrawer.toggleOpen();
  //  var o = this.$.itemDrawer.getOpen();
  //  // close the last drawer
  //  if (this.lastOpen != null && this.lastOpen != inRowIndex) {
  //    if (this.$.list.prepareRow(this.lastOpen)) {
  //      this.animationCount++;
  //    }
  //    this.$.itemDrawer.setOpen(false);
  //  }
  //  // remember the last open drawer
  //  this.lastOpen = o ? inRowIndex : null;
  // },
  // repeaterItemClick: function(inSender, inEvent) {
  //  var i = this.$.list.fetchRowIndex();
  //  var dataClicked = this.data[i].items[inEvent.rowIndex]
  //  this.log(dataClicked);
  // },
  // openAnimationComplete: function(inSender) {
  //  this.animationCount--;
  //  if (!this.animationCount) {
  //    this.$.list.refresh();
  //    //this.log("refresh");
  //  }
  // }
});