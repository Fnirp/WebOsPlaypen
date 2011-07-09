enyo.kind({
	name: "EngagedBy.SignIn",
	kind: enyo.VFlexBox,

	components: [
	  {
	    kind: "Pane",
	    flex: 1,
      components: [{
        kind: "BasicWebView",
        name: "webView",
        url: "http://engagedby.com/webos",
        onPageTitleChanged: "pageTitleChanged"
      }]
    }
  ],

  pageTitleChanged: function() {
    var url = this.$.webView.url;
    if(url.indexOf("user_id=") > 0) {
      var userId = url.split("user_id=")[1];
      enyo.setCookie("user_id", userId);
      // change view
      this.owner.next();
    }
  }

});