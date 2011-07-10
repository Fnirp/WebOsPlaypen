enyo.kind({
	name: "EngagedBy.SignIn",
	kind: enyo.VFlexBox,
	className: "enyo-bg",
	components: [
	  {
        kind: "BasicWebView",
        name: "webView",
        width: "600px",
        style: "margin:auto",
        url: "http://engagedby.com/webos",
        onPageTitleChanged: "pageTitleChanged"
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
      var otherGroupsRequestUrl = "http://engagedby.com/users/" + localStorage.getItem('user_id') + "/other_groups.json";
      
      console.log("1 user_id: " + request_url);
      console.log("(Other Groups): " + otherGroupsRequestUrl);
      
      this.owner.loadGroups(request_url);
      this.owner.loadOtherGroups(otherGroupsRequestUrl);
      // this.$.webView.setUrl("https://www.linkedin.com/secure/login?session_full_logout=&trk=hb_signout");
    }
  }
});