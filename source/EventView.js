enyo.kind({
  name: "EngagedBy.EventView",
  kind: enyo.SlidingView,
  components: [
    {
      name: "launchAppService",
      kind: "PalmService",
      service: "palm://com.palm.applicationManager/",
      method: "launch"
    },{
      name: "openAppService",
      kind: "PalmService",
      service: "palm://com.palm.applicationManager/",
      method: "open"
    },
    {kind: "Header", name: "header", content: "Please select an event", components: [
      {kind: enyo.HFlexBox, flex: 1, components: [
          {kind: "Spacer"},
          {kind: enyo.Spinner, name: "itemWebViewSpinner", align: "right"}
      ]}
    ]},
    {kind: enyo.Scroller, flex: 1, components: [
      {kind: "WebView", name: "currentItemWebView", flex: 1, onLoadComplete: "hideWebViewSpinner", onLoadStarted: "showWebViewSpinner"}
    ]},
    {kind: enyo.Toolbar, /*pack: "justify",*/ components: [
      {kind: enyo.GrabButton},
      {flex: 1},
      {icon: "images/calendar_month.png", onclick: "addToCalendar"/*, align: "right"*/},
      {kind: enyo.GrabButton},
      {flex: 1},
      {icon: "images/Refresh.png", onclick: "refreshWebView", align: "right"}
    ]}
  ],

  loadEventViewPane: function(url, event) {
    this.$.header.setContent(event.name);
    this.$.currentItemWebView.setUrl(url);
    this.event = event;
  },

  hideWebViewSpinner: function() {
    this.$.itemWebViewSpinner.hide();
  },
  showWebViewSpinner: function() {
    this.$.itemWebViewSpinner.show();
  },
  refreshWebView: function() {
    this.$.currentItemWebView.resize();
    this.$.currentItemWebView.reloadPage();
  },
  addToCalendar: function() {
    this.addEvent();
    setTimeout( function(t) { t.createEvent(); }, 1000, this);
    setTimeout( function(t) { t.createEvent(); }, 2000, this);
  },


  eventParams: function() {
    var date = new Date(this.event.start_date).valueOf();
    var start_date = date + "";
    params = {
      newEvent: {
        subject: this.event.name + " - " + this.event.entity.name,  // string
        dtstart: start_date,  // string representing the start date/time as timestamp in milliseconds
        // dtend: '1290718800000',    // string representing the end date/time as timestamp in milliseconds
        location: this.event.location_text ? this.event.location_text : "", // string
        // rrule: {
          // freq: "DAILY",
          // count: 3
        // },  // rrule object -- see Calendar schema for details
        tzId: "Europe/London", // string representing a standard Olson timezone name
        // alarm: [{
          // alarmTrigger: {
              // valueType: "DURATION",
              // value: "-PT15M"
          // }
        // }], // array of alarm objects -- see Calendar schema for details
        note: this.event.webpage_url,  // string
        allDay: true  // boolean
      }
    };
    return params;
  },

  createEvent: function() {
    console.log("createEvent");
    this.$.openAppService.call(
      {
        id: 'com.palm.app.calendar',
        params: this.eventParams()
      }
    );
  },

  addEvent: function() {
    console.log("addEvent");
    this.$.launchAppService.call(
      {
        id: 'com.palm.app.calendar',
        params: this.eventParams()
      }
    );
  }

});