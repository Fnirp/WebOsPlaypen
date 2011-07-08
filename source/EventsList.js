enyo.kind({
  name: "EngagedBy.Events",
  kind: enyo.VFlexBox,
  components: [
      {kind: "PageHeader", content: "Engaged By"},
      {kind: "Input", components:[{kind: "Button", caption: "Search", onclick: "btnClick"}]},
      {kind: "RowGroup", caption: "Events", components: [
          {name: "getFeed", kind: "WebService",
            onSuccess: "gotFeed",
            onFailure: "gotFeedFailure"}]},
      {kind: "RowGroup", caption: "Recomendations", components: []}
  ],
  
  btnClick: function() {
      var url = "http://query.yahooapis.com/v1/public/yql?q=select" +
      "%20title%2C%20description%20from%20rss%20where%20url%3D%22" +
      this.$.input.getValue() + "%22&format=json&callback=";
      this.$.getFeed.setUrl(url);
      this.$.getFeed.call();
  },
  gotEvent: function(inSender, inResponse) {
  this.$.button.setCaption("Success");
  },
  gotEventFailure: function(inSender, inResponse) {
    this.$.button.setCaption("Failure");
  }

});

