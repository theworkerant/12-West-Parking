(function($){
	$.extend({"log":function(){ 
		if(arguments.length > 0) {
			
			// join for graceful degregation
			var args = (arguments.length > 1) ? Array.prototype.join.call(arguments, " ") : arguments[0];
			
			// this is the standard; firebug and newer webkit browsers support this
			try { 
				console.log(args);
				return true;
			} catch(e) {		
				// newer opera browsers support posting erros to their consoles
				try { 
					opera.postError(args); 
					return true;
				} catch(e) { }
			}
			
			// catch all; a good old alert box
			alert(args);
			return false;
		}
	}});
})(jQuery);

var jQT = new $.jQTouch({
  icon: 'jqtouch.png',
  addGlossToIcon: true,
  startupScreen: 'jqt_startup.png',
  slideSelector: 'ul li a',
  statusBar: 'black',
  preloadImages: [
      '/stylesheets/img/back_button.png',
      '/stylesheets/img/back_button_clicked.png',
      '/stylesheets/img/button_clicked.png',
      '/stylesheets/img/grayButton.png',
      '/stylesheets/img/whiteButton.png',
      '/stylesheets/img/loading.gif'
      ]
});


if (localStorage.parked == undefined) { localStorage.parked = 0 };

var vehicles = {
  car:        {src: "../images/car.png", src_up: "../images/car_up.png", width: 100, height: 87 },
  motorcycle: {src: "../images/motorcycle.png", src_up: "../images/motorcycle_up.png", width: 100, height: 87 },
};
localStorage.vehicle = "motorcycle";

var lot_parking
var lot_parked
var marker_icon = vehicles[localStorage.vehicle];
var bouncer = ""

bounce = function() {
  this.marker.animate({
    "15%": {y: this.marker.attr("y")-20, easing: ">"},
    "85%": {y: this.marker.attr("y"), easing: "bounce"}
  }, 1400);
};
start_bouncer = function() {
  if (bouncer == "") {
    bouncer = window.setInterval("bounce();", 3000);
  } else {
    stop_bouncer();
  }
};
stop_bouncer = function() {
  bouncer = "";
  window.clearInterval(bouncer);
};

function parking_map(id, W, H, marker_icon) {
  $("#"+id).empty();
  
  this.canvas = Raphael(id, W, H); 
  this.marker = this.canvas.image(marker_icon.src, 0, 0, marker_icon.width, marker_icon.height);
  this.touchable = this.canvas.rect(0, 0, W, H);  
  this.marker.scale(0.8,0.8)
  this.touchable.attr({fill: "#fff", opacity: 0.1});
  $(this.touchable.node).css("cursor", "pointer")
  
  // Set position
  if (parseInt(localStorage.parked)) {
    this.marker.attr({x: localStorage.parked_at_x, y: localStorage.parked_at_y})
  } else {
    this.marker.attr({x: (W/2 - (marker_icon.width/2)), y: (H/2 - (marker_icon.height/2))})
  }
  marker = this.marker

  this.start = function () { 
    // pick it up
    marker.attr({src: marker_icon.src_up}); 
    marker.ox = marker.attr("x");
    marker.oy = marker.attr("y");
  },
  this.move = function (dx, dy) {
    if (!(marker.ox+dx+marker.attr("width") > W) && !(marker.ox+dx < 0)) { marker.attr({x: marker.ox + dx}); };
    if (!(marker.oy+dy+marker.attr("height") > H) && !(marker.oy+dy < 0)) { marker.attr({y: marker.oy + dy}); };
  },
  this.up = function () {
    // set it down
    marker.attr({src: marker_icon.src}); 
    localStorage.parked_at_x = marker.attr("x");
    localStorage.parked_at_y = marker.attr("y");
  };
  
  if (!parseInt(localStorage.parked)) {  
    this.touchable.drag(this.move, this.start, this.up);
  };
  
};

$(document).ready(function() {
  var canvas_w = $(document).width();
  var canvas_h = canvas_w*(3/4);
  
  var parked = function() { 
    localStorage.parked = 1;
    $('#last_parked_area').show();
    $('#parking_at_area').hide();
    start_bouncer();
    show_parked_level(localStorage.level);
    lot_parked = new parking_map("lot_parked", canvas_w, canvas_h, marker_icon);
  };

  var unparked = function() {
    localStorage.parked = 0;
    $('#last_parked_area').hide();
    $('#parking_at_area').show();
    window.clearInterval(bouncer);
    show_parked_level(localStorage.level);
    stop_bouncer();
    lot_parking = new parking_map("lot_parking", canvas_w, canvas_h, marker_icon);
  };
  
  var show_parked_level = function(level) {
    $(".parked_zones li").hide();
    $("#parked .parked_zones li:eq("+(parseInt(level)-1)+")").show();
    $("#parking .parked_zones li:eq("+(parseInt(level)-1)+")").show();
    $(".parked_zones .parking_link").show();
    $(".parked_zones .leaving_link").show();
  };
  
  // Setup pages
  if (parseInt(localStorage.parked)) { parked(); } else { unparked(); };
  
  $(".leaving_link").click(function() {
    unparked();
    alert("Bye!");
    jQT.goBack('#home');
  });
  
  $(".parking_link").click(function() {
    parked();
    alert("Okay, saved that spot!");
    jQT.goBack('#home');
  });
  
  $("#parking_at_area .zones > li").click(function() {
    marker.attr({opacity: 0})
    setTimeout(function() {marker.animate({opacity: 1}, 400), bounce();}, 300);
    
    localStorage.zone_color = $(this).attr("zone_color");
    localStorage.level = $(this).attr("level");
    show_parked_level(localStorage.level);
  })
  
});