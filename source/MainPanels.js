/**
 * @author Jenny Ekelund
 */
enyo.kind({
	name: "EngagedBy",
	kind: enyo.VFlexBox,
	components: [
		{name: "slidingPane", kind: "SlidingPane", flex: 1, 
		  components: [
			{name: "left", width: "320px", kind:"SlidingView", 
			  components: [
        {kind: "Header", content:"Events"},
        {kind: "Scroller", flex: 1, 
          components: [   
          //Insert your components here
            {kind: "EventsList"}
					]
				}
			]},
			{name: "middle", width: "320px", kind:"SlidingView", peekWidth: 50, components: [
					{kind: "Header", content:"Recommended"},
					{kind: "Scroller", flex: 1, components: [
						//Insert your components here
						{kind: "RecommendedList"}
					]},
					{kind: "Toolbar", components: [
						{kind: "GrabButton"}
					]}
			]},
			{name: "right", kind:"SlidingView", flex: 1, components: [
					{kind: "Header", content:"Details"},
					{kind: "Scroller", flex: 1, components: [
						//Insert your components here
					]},
					{kind: "Toolbar", components: [
						{kind: "GrabButton"}
					]}
			]}
		]}
	]
});