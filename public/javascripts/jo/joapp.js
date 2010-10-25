/*
	NOTE:
	What follows is a mishmash of coding techniques put together as a rough
	test for the library. It it not intended as a "best practice" coding exmaple,
	but reather shows off some of the many approaches you can use to interact
	with the Jo framework.
*/

// required
jo.load();

// not required
jo.setDebug(true);

// placed in a module pattern, not a terrible idea for application level code
var App = (function() {
	var stack;
	var scn;
	var button;
	var backbutton;
	var page;
	var login;
	var test;
	var more;
	var option;
	var select;
	var moreback;
	var urldata;
	var levels;
	var menu;
	var cssnode;
	
//	var blipsound = new joSound("blip2.wav");
//	var bloopsound = new joSound("blip0.wav");
	var cancelbutton;

	/*
		EXAMPLE: if you want to configure what HTML tag and optional CSS class name a given
		UI class creates, you can change that by altering the properties in the class directly.
		NOTE: this should be done after jo is loaded, but before you create any new UI objects.
	*/
	// uncomment to try this out:
//		joInput.prototype.tagName = "input";
//		joInput.prototype.className = "stuff";

	function init() {		
		// silly, but you you can load style tags with a string
		// which may be moderately useful. the node is returned,
		// so in theory you could replace it or remove it.
		// a more practical case would be to use the loadCSS() method
		// to load in an additional stylesheet
		cssnode = joDOM.applyCSS(".htmlgroup { background: #fff; }");
		
		// more css, but deferred loading until after the app initializes
/*
		joYield(function() {
//			bodycssnode = joDOM.loadCSS("../docs/html/doc.css");
			
			// dynamic CSS loading based on platform, in this case FireFox
			// doesn't do stack transitions well, so we're downshifting

//			if (jo.matchPlatform("iphone ipad safari"))
//				joDOM.loadCSS("../css/aluminum/webkit.css");
//			else if (jo.matchPlatform("chrome webkit webos"))
//				joDOM.loadCSS("../css/aluminum/webkit.css");
//				joDOM.loadCSS("../css/aluminum/chrome.css");
//			else
//				joDOM.loadCSS("../css/aluminum/gecko.css");
			
			// as an optimization, I recommend in a downloadable app that
			// you create a custom CSS file for each platform using some
			// sort of make-like process.
		}, this);
*/
		
		var toolbar;
		var nav;
		
		// chaining is supported on constructors and any setters		
		scn = new joScreen(
			new joContainer([
				new joFlexcol([
					nav = new joNavbar(),
					new joContainer(
						stack = new joStackScroller()
					)
				]),
				toolbar = new joToolbar("Some footer thingy")
			]).setStyle({position: "absolute", top: "0", left: "0", bottom: "0", right: "0"})
		);
		
		nav.setStack(stack);
		
		// this is a bit of a hack for now; adds a CSS rule which puts enough
		// space at the bottom of scrolling views to allow for our floating
		// toolbar. Going to find a slick way to automagically do this in the
		// framework at some point.
		joYield(function() {
			var style = new joCSSRule('jostack > joscroller > *:after { content: ""; display: block; height: ' + (toolbar.container.offsetHeight) + 'px; }');
		});
		
		var ex;
		
		blue = new joCard([
     new joFooter([
       selectbutton = new joButton("I'm parked here!"),
       new joDivider(),
       backbutton = new joButton("Back")
     ])
    ]).setTitle("Level 1, Blue");
		
		menu = new joCard([
			list = new joMenu([
				{ title: "Blue", id: "blue" },
				{ title: "Green", id: "green" },
				{ title: "Orange", id: "orange" },
				{ title: "Yellow", id: "yellow" },
				{ title: "Purple", id: "purple" }
			])
		]).setTitle("I just parked in");
		menu.activate = function() {
			// maybe this should be built into joMenu...
			list.deselect();
		};

		list.selectEvent.subscribe(function(id) {
		  
      if (id == "blue")
       stack.push(blue);
      else if (id == "green")
        stack.push(green);
      else if (id == "orange")
        stack.push(orange);
      else if (id == "yellow")
        stack.push(yellow);
      else if (id == "purple")
        stack.push(purple);
		}, this);

    // moreback.selectEvent.subscribe(function() { stack.pop(); }, this);
    // button.selectEvent.subscribe(click.bind(this));
		backbutton.selectEvent.subscribe(back, this);
    // html.selectEvent.subscribe(link, this);
		
		stack.pushEvent.subscribe(blip, this);
		stack.popEvent.subscribe(bloop, this);
		
		joGesture.forwardEvent.subscribe(stack.forward, stack);
		joGesture.backEvent.subscribe(stack.pop, stack);

		stack.push(menu);
	}
	
	function blip() {
//		blipsound.play();
	}
	
	function bloop() {
//		bloopsound.play();
	}
	
	function link(href) {
		joLog("HTML link clicked: " + href);
		urldata.setData(href);
		stack.push(more);
	}
	
	function click() {
		stack.push(page);
	}
	
	function back() {
		stack.pop();
	}
	
	// public stuff
	return {
		"init": init,
		"getStack": function() { return stack },
		"getButton": function() { return button },
		"getSelect": function() { return select },
		"getOption": function() { return option }
	}
}());
