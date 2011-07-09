
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
/*	kind: enyo.VFlexBox,	
	published: {
		selectedRecord: null
	},*/
	components: [
	  {kind: "Header", content:"Events"},
		{kind: "WebService", url: "data/events.json", onSuccess: "queryResponse", onFailure: "queryFail"},
//		{name: "console", content: "select an item", style: "color: white; background-color: gray; border: 1px solid black; padding: 4px;"},


		{flex: 1, name: "list", kind: "VirtualList", className: "list", onSetupRow: "listSetupRow", components: [
			{kind: "Divider"},
			  {kind: "Item", className: "item", onclick: "selectItem", Xonmousedown: "selectItem", components: [
//    	{name: "item", kind: "SwipeableItem", className: "item", tapHighlight: false, confirmCaption: "Delete", onConfirm: "swipeDelete", onclick: "itemClick", components: [
          {kind: "HFlexBox", components: [
            {name: "itemColor", className: "item-color"},
            {name: "itemName", flex: 1},
            {name: "itemIndex", className: "item-index"}
        ]},
				{name: "itemOrganisation", className: "item-organisation"},
				{name: "itemDescription", className: "item-description"}
			]}
		]},
		{kind: enyo.Toolbar, pack: "justify", components: [
			{kind: enyo.GrabButton},
			{flex: 1},
			{icon: "images/Refresh.png", onclick: "doRefreshTap", align: "right"}
		]}

//		{name: "console", style: "color: white; background-color: gray; padding: 4px; border: 1px solid black"}
	],
	
	create: function() {
		this.data = [];
		this.inherited(arguments);
		this.$.webService.call();
	},
	
	queryResponse: function(inSender, inResponse) {
		this.data = inResponse.results;
/*		this.data.sort(function(inA, inB) {
			// names are in "First Last" format, this code converts to "LastFirst" for comparison
			var an = inA.name.split(" ");
			an = an.pop() + an.pop();
			var bn = inB.name.split(" ");
			bn = bn.pop() + bn.pop();
			if (an < bn) return -1;
			if (an > bn) return 1;
			return 0;
		});*/
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
	selectItem: function(inSender, inEvent) {
		this.$.list.select(inEvent.rowIndex);
	}
});