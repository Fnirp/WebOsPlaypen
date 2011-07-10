/**
 * @author Jenny Ekelund
 */
enyo.kind({
	name: "EngagedBy",
	kind: "Pane",
	className: "layout",
	components: [
	  {
	    kind: "EngagedBy.SignIn",
	    srcId: "SignIn"
	  },
	  {
      kind: enyo.VFlexBox,
      srcId: "Events",
      components: [
        {
          kind: "SlidingPane", flex: 1, multiViewMinWidth: 480, onSelect: "paneSelected", name: "feedSlidingPane",
          components: [
            {name: "eventFeedPane", width: "320px", kind: "EngagedBy.EventFeed", onListTap: "showFeed", onRefreshTap: "refreshTap"},
            {name: "eventItemsPane", width: "320px", peekWidth: 50, kind: "EngagedBy.EventItems", onListTap: "openFeedItem", onRefreshTap: "refreshFeedItemsList"},
            {name: "feedWebViewPane", flex: 1, peekWidth: 100, kind: "EngagedBy.EventView", onResize: "resizeWebView"}
          ]
        }
      ]
    }
  ],

  loadProfile: function(url) {
    console.log("2 user_id: " + url);
    this.$.eventFeedPane.loadTheProfile(url);
  }
});