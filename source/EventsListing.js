/**
 * @author Jenny Ekelund
 */
enyo.kind({
	name: "App",
	kind: enyo.VFlexBox,
	components: [
	  {kind: "VFlexBox", className: "enyo-fit", components: [
			{kind: "VFlexBox", flex: 1, style: "background: white;", components: [
				{flex: 1, style: "margin-left: 620px; background: black; opacity: 0.5;"}
			]}
		]},
    {kind: "SlidingPane", flex: 1, components: [
        {name: "left", width: "320px", components: [
            {kind: "PanelOutline", headerContent: "Panel 1", flex: 1, onGo: "next", components: [
              {kind: "WebService", url: "data/events.json", onSuccess: "queryResponse", onFailure: "queryFail"},
              /*{kind: "PageHeader", content: "Events"},*/
              {flex: 1, name: "list", kind: "VirtualList", className: "list", onSetupRow: "listSetupRow", components: [
                {name: "itemCaption", onclick: "itemCaptionClick"},
                {name: "itemDrawer", open: false, kind: "Drawer", onOpenAnimationComplete: "openAnimationComplete", components: [
                  {name: "itemVirtualRepeater", kind: "VirtualRepeater", onSetupRow: "repeaterSetupRow", components: [
                    {name: "repeaterItem", onclick: "repeaterItemClick"}
                  ]}
                ]}
              ]},     
              {name: "button", kind: "Button", caption: "Debugging: ", onclick: "loadData"}
            ]}
        ]},
                  
        {name: "middle", width: "320px", peekWidth: 68},
        {name: "right", flex: 1, onResize: "slidingResize"}
    ]}
  ],
	
	create: function() {
		this.data = [];
		this.inherited(arguments);
	},
	
	loadData: function(inSender) {
		this.$.webService.call();
	},
	
	queryResponse: function(inSender, inResponse) {
	 
		this.data = inResponse.results;
/*		this.data.sort(function(inA, inB) 
		  {
			// names are in "First Last" format, this code converts to "LastFirst" for comparison
			var an = inA.name.split(" ");
			an = an.pop() + an.pop();
			var bn = inB.name.split(" ");
			bn = bn.pop() + bn.pop();
			if (an < bn) { return -1;}
			if (an > bn) { return 1; }
			return 0;
			}
		);*/
		this.$.list.refresh();
	},
	
	makeSubData: function(inRowIndex) {
	  //ok, so trying for the description here
/*	  var description = [];
	  description[0] = this.data[inRowIndex];
	  this.$.button.setCaption(description);
	  return description;*/
		var r = [];
		for (var j=0, t=10/*2+enyo.irand(3)*/; j < t; j++) {
			r.push({number: enyo.irand(t)});
		}
		return r;
		
	},
	
	listSetupRow: function(inSender, inIndex) {
		var record = this.data[inIndex];
		this.$.button.setCaption("Listing");
		if (record) {
			this.repeaterData = record;
			this.$.itemCaption.setContent(record.name + " (" + inIndex + ")");
			//this.$.itemDrawer.canGenerate = this.$.itemDrawer.open && Boolean(record.items && record.items.length);
			return true;
		}
	},
	
	repeaterSetupRow: function(inSender, inIndex) {
		var d = this.repeaterData;
		var record = d && d.items && d.items[inIndex];
	//	this.$.button.setCaption("Here");
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
		this.$.button.setCaption(d.number);
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
		enyo.job("fetchDataForRow" + inRowIndex, enyo.bind(this, "gotDataForRow", inRowIndex, inRowData, this.makeSubData(inRowIndex)), 100);
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
		if (this.lastOpen !== null && this.lastOpen !== inRowIndex) 
		{
			if (this.$.list.prepareRow(this.lastOpen)) 
			{
				this.animationCount++;
			}
			this.$.itemDrawer.setOpen(false);
		}
		// remember the last open drawer
		this.lastOpen = o ? inRowIndex : null;
	},
	
	repeaterItemClick: function(inSender, inEvent) 
	{
		var i = this.$.list.fetchRowIndex();
		var dataClicked = this.data[i].items[inEvent.rowIndex];
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