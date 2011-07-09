enyo.kind({
	name: "EngagedBy.EventFeed",
	kind: enyo.SlidingView,
	layoutKind: enyo.VFlexLayout,
	events: {
		"onListTap": "",
		"onRefreshTap": ""
	},
	components: [
	  {kind: "Header", content:"Groups"},
		{kind: "WebService", url: "data/events.json", onSuccess: "queryResponse", onFailure: "queryFail"},
		//{kind: "Button", caption: "Load Data", onclick: "loadData"},

		{flex: 1, name: "list", kind: "VirtualList", className: "list", onSetupRow: "getFeed", components: [
			{name: "itemCaption", onclick: "itemCaptionClick"},
			{name: "itemDrawer", open: false, kind: "Drawer", onOpenAnimationComplete: "openAnimationComplete", components: [
				{name: "itemVirtualRepeater", kind: "VirtualRepeater", onSetupRow: "repeaterSetupRow", components: [
					{name: "repeaterItem", onclick: "repeaterItemClick"}
				]}
			]}
		  ]},
		{kind: enyo.Toolbar, pack: "justify", components: [
			{flex: 1},
			{icon: "images/Refresh.png", onclick: "doRefreshTap", align: "right"}
		]}		
	],
	
	/*
	------------
	components:[
		{kind: enyo.Header, style: "min-height: 60px;", components: [
			{content: "Feeds"}
		]},
		{kind: enyo.Scroller, flex: 1, components: [
			{kind: enyo.VirtualRepeater, name: "feedList", onSetupRow: "getFeed", onclick: "doListTap", components: [
				{kind: enyo.SwipeableItem, onConfirm: "doDeleteFeed", layoutKind: enyo.HFlexLayout, tapHighlight: true, components: [
					{name: "listItemTitle", content: ""}
				]}
			]}
		]},
		{kind: enyo.Toolbar, pack: "justify", components: [
			{flex: 1},
			{icon: "images/menu-icon-new.png", onclick: "doNewFeedTap", align: "right"}
		]}

	],
	getFeed: function(inSender, inIndex) {
		var r = this.owner.feedList[inIndex];
		
		if (r) {
			this.$.listItemTitle.setContent(r.title);
			return true;
		}
	}

});-----------------------
	*/
	
	create: function() {
		this.data = [];
		this.inherited(arguments);
		this.$.webService.call();
	},
	getFeed: function(inSender, inIndex) {
		var record = this.data[inIndex];
		if (record) {
			this.repeaterData = record;
			this.$.itemCaption.setContent(record.name + " (" + inIndex + ")");
			//this.$.itemDrawer.canGenerate = this.$.itemDrawer.open && Boolean(record.items && record.items.length);
			return true;
		}
	},
	queryResponse: function(inSender, inResponse) {
		this.data = inResponse.results;
		this.$.list.refresh();
	},
	makeSubData: function() {
		var r = [];
		for (var j=0, t=10/*2+enyo.irand(3)*/; j < t; j++) {
			r.push({number: enyo.irand(t)});
		}
		return r;
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
	fetchDataForRow: function(inRowIndex, inRowData) {
		enyo.job("fetchDataForRow" + inRowIndex, enyo.bind(this, "gotDataForRow", inRowIndex, inRowData, this.makeSubData()), 100);
	},
	gotDataForRow: function(inRowIndex, inRowData, inSubData) {
		inRowData.items = inSubData;
		// populate the row's repeater with data
		this.$.list.prepareRow(inRowIndex);
		this.repeaterData = inRowData;
		//
		this.$.itemDrawer.render();
		this.$.list.prepareRow(inRowIndex);
		// toggle the drawer
		this.toggleDrawer(inRowIndex);
	},
	// want only one drawer open at a time.
	toggleDrawer: function(inRowIndex) {
		this.animationCount = 1;
		// toggle and remember state
		this.$.itemDrawer.toggleOpen();
		var o = this.$.itemDrawer.getOpen();
		// close the last drawer
		if (this.lastOpen != null && this.lastOpen != inRowIndex) {
			if (this.$.list.prepareRow(this.lastOpen)) {
				this.animationCount++;
			}
			this.$.itemDrawer.setOpen(false);
		}
		// remember the last open drawer
		this.lastOpen = o ? inRowIndex : null;
	},
	repeaterItemClick: function(inSender, inEvent) {
		var i = this.$.list.fetchRowIndex();
		var dataClicked = this.data[i].items[inEvent.rowIndex]
		this.log(dataClicked);
	},
	openAnimationComplete: function(inSender) {
		this.animationCount--;
		if (!this.animationCount) {
			this.$.list.refresh();
			//this.log("refresh");
		}
	}
});