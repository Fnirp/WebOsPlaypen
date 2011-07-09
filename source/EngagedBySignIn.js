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
      enyo.setCookie("user_id", userId);
      localStorage.setItem('user_id', userId);

      this.owner.next(); // change view
      // this.$.webView.setUrl("https://www.linkedin.com/secure/login?session_full_logout=&trk=hb_signout");
    }
  }

  /*
    //
    tar -cvf //the apps
    copy into:
    /media/internal/myfiles.tar
    enable drive
  }*/

});