/**
 * @author Jenny Ekelund
 */
enyo.kind({
	name: "App",
	kind: enyo.VFlexBox,
	components: [
		{kind: "WebService", url: "data/canonDbList_dbService.json", onSuccess: "queryResponse", onFailure: "queryFail"},
		{kind: "PageHeader", content: "Events"},
		{flex: 1, name: "list", kind: "VirtualList", className: "list", onSetupRow: "listSetupRow", components: [
			{name: "itemCaption", onclick: "itemCaptionClick"},
			{name: "itemDrawer", open: false, kind: "Drawer", onOpenAnimationComplete: "openAnimationComplete", components: [
				{name: "itemVirtualRepeater", kind: "VirtualRepeater", onSetupRow: "repeaterSetupRow", components: [
					{name: "repeaterItem", onclick: "repeaterItemClick"}
				]}
			]}
		]},
		{kind: "Button", caption: "Debugging: ", onclick: "loadData"}
	]
});