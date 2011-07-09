enyo.kind({
	name: "EngagedBy.EventView",
	kind: enyo.SlidingView,
	components: [
		{kind: enyo.Header, style: "min-height: 60px;", components: [
			{kind: enyo.HFlexBox, flex: 1, components: [
				{content: "", name: "selectedItemName", style: "text-overflow: ellipsis; overflow: hidden; white-space: nowrap;", flex: 1},
				{kind: enyo.Spinner, name: "itemWebViewSpinner", align: "right"}
			]}
		]},
		{kind: enyo.Scroller, flex: 1, components: [
			{kind: "WebView", name: "currentItemWebView", flex: 1, onLoadComplete: "hideWebViewSpinner", onLoadStarted: "showWebViewSpinner"}
		]},
		{kind: enyo.Toolbar, pack: "justify", components: [
			{kind: enyo.GrabButton},
			{flex: 1},
			{icon: "images/Refresh.png", onclick: "refreshWebView", align: "right"}
		]}
	],
	hideWebViewSpinner: function() {
		this.$.feedViewSpinner.hide();
	},
	showWebViewSpinner: function() {
		this.$.feedViewSpinner.show();
	},
	refreshWebView: function() {
		this.$.currentItemWebView.reloadPage();
	}
});