enyo.kind({
	name: "EngagedBy.SignIn",
	kind: enyo.VFlexBox,
	components: [
	  
	  {
	      kind: "Header", content:"Welcome!",
        style: "text-align: center"
	  },
	  {
        kind: "BasicWebView",
        name: "webView",
        width: "500px",
        style: "margin:auto",
        url: "http://engagedby.com/webos",
        onPageTitleChanged: "pageTitleChanged"
    }
  ]

/*  pageTitleChanged: function() {
    var url = this.$.webView.url;
    if(url.indexOf("user_id=") > 0) {
      var userId = url.split("user_id=")[1];
      enyo.setCookie("user_id", userId);
      // change view
      this.owner.next();
    }

    //    
    tar -cvf //the apps
    copy into:
    /media/internal/myfiles.tar
    enable drive
  }*/

});