window.camera = {};

camera.actualX = 0;
camera.actualY = 0;
camera.actualZoom = 1;
camera.targetX = 0;
camera.targetY = 0;
camera.targetZoom = 1;
camera.focus = null;
camera.slowpanstarttime = null;
camera.slowpanstartX = 0;
camera.slowpanstartY = 0;
camera.slowpanondestreached = null;
camera.mode = "fixedpoint"; // "fixedpoint", "focus" (follows a certain entity), "slowpan"

var lerp = function(x, y, zoom) {
	var difX = x - camera.actualX;
	var difY = y - camera.actualY;
	var difzoom = zoom - camera.actualZoom;

	camera.actualX += difX * gamesettings.cameralerpspeed;
	camera.actualY += difY * gamesettings.cameralerpspeed;
	camera.actualZoom += difzoom * gamesettings.cameralerpspeed;
}

camera.SetFocus = function(ent, zoom) {
	camera.focus = ent;
	camera.targetZoom = zoom;
	camera.mode = "focus";
}
camera.SetFixedPoint = function(x, y, zoom) {
	camera.targetX = x;
	camera.targetY = y;
	camera.targetZoom = zoom;
	camera.mode = "fixedpoint";
}
camera.SetSlowPan = function(x, y, zoom, ondestinationreached) {
	camera.slowpanstarttime = null;
	camera.targetX = x;
	camera.targetY = y;
	camera.targetZoom = zoom;
	camera.slowpanondestreached = ondestinationreached;
	camera.mode = "slowpan";
}
camera.Do = function(time) {
	if (camera.mode == "fixedpoint") {
		lerp(camera.targetX, camera.targetY, camera.targetZoom);
	} else if (camera.mode == "focus") {
		lerp(camera.focus.x, camera.focus.y, camera.targetZoom);
	} else if (camera.mode == "slowpan") {
		if (camera.slowpanstarttime == null) {
			camera.slowpanstarttime = time;
		}
		var elapsed = time - camera.slowpanstarttime;
		var distance = utils.distance(camera.slowpanstartX, camera.slowpanstartY, camera.targetX, camera.targetY);
		var pixelsmoved = (elapsed / 1000) * gamesettings.slowpanspeed;
	}
}
