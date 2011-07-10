enyo.kind({
	name: "EngagedBy.SignIn",
	kind: enyo.VFlexBox,
	className: "enyo-bg",
	components: [
	  
			{kind: "HFlexBox", tapHighlight: false, components: [
				{
				  content: "",
				  name: "spinnerLabel"
				},
				{kind: "Spacer"},
				{kind: "enyo.Spinner", name: "feedWebViewSpinner"}
			]},

        {
            kind: "BasicWebView",
            name: "webView", 
            url: "http://engagedby.com/webos",
            onPageTitleChanged: "pageTitleChanged",
            onLoadComplete: "hideWebViewSpinner", 
            onLoadStarted: "showWebViewSpinner"
        }
  ],
    
  pageTitleChanged: function() {
    var url = this.$.webView.url;

    if(url.indexOf("user_id=") > 0) {
      var userId = url.split("user_id=")[1];

      console.log("user_id: " + userId);

      enyo.setCookie("user_id", userId);
      localStorage.setItem('user_id', userId);

      this.owner.next(); // change view

      var request_url = "http://engagedby.com/users/" + localStorage.getItem('user_id') + ".json";
      console.log("1 user_id: " + request_url);
      this.owner.loadGroups(request_url);
      // this.$.webView.setUrl("https://www.linkedin.com/secure/login?session_full_logout=&trk=hb_signout");
    }
  },
  
  hideWebViewSpinner: function() {
		this.$.feedWebViewSpinner.hide();
		this.$.spinnerLabel.setContent("");
	},
	showWebViewSpinner: function() {
		this.$.feedWebViewSpinner.show();
		this.$.spinnerLabel.setContent("Loading...");
	}

});