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
    {kind: "Header", style: "min-height: 60px;", components: [
      {kind: enyo.HFlexBox, flex: 1, components: [
        {content: "", name: "selectedItemName", style: "text-overflow: ellipsis; overflow: hidden; white-space: nowrap;", flex: 1},
        {kind: enyo.Spinner, name: "itemWebViewSpinner", align: "right"}
      ]}
    ]},
    {kind: enyo.Scroller, flex: 1, components: [
      {kind: "WebView", name: "currentItemWebView", flex: 1, onLoadComplete: "hideWebViewSpinner", onLoadStarted: "showWebViewSpinner"}
    ]},
    {kind: enyo.Toolbar, /*pack: "justify",*/ components: [
      {kind: enyo.GrabButton},
      {flex: 1},
      {icon: "images/CalendarMonth.png", onclick: "addToCalendar"/*, align: "right"*/},
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
  },
  addToCalendar: function() {
    this.addEvent();
    setTimeout( function(t) { t.createEvent(); }, 1000, this);
    setTimeout( function(t) { t.createEvent(); }, 2000, this);
  },


  eventParams: function() {
    params = {
      newEvent: {
        subject: 'Take daily medicine',  // string
        dtstart: '1290711600000', // string representing the start date/time as timestamp in milliseconds
        dtend: '1290718800000',  // string representing the end date/time as timestamp in milliseconds
        location: 'Wherever I am!', // string
        rrule: {
          freq: "DAILY",
          count: 3
        },  // rrule object -- see Calendar schema for details
        tzId: "America/Los_Angeles", // string representing a standard Olson timezone name
        alarm: [{
          alarmTrigger: {
              valueType: "DURATION",
              value: "-PT15M"
          }
        }], // array of alarm objects -- see Calendar schema for details
        note: 'Take alergy medicine, 1 pill, or 2 if you feel like it.',  // string
        allDay: false  // boolean
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