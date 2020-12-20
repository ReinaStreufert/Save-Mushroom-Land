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

let lerp = function(x, y, zoom, doxy) {
	var difX = x - camera.actualX;
	var difY = y - camera.actualY;
	var difzoom = zoom - camera.actualZoom;

	if (doxy) {
		camera.actualX += difX * gamesettings.cameralerpspeed;
		camera.actualY += difY * gamesettings.cameralerpspeed;
	}
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
		lerp(camera.targetX, camera.targetY, camera.targetZoom, true);
	} else if (camera.mode == "focus") {
		lerp(camera.focus.x, camera.focus.y, camera.targetZoom, true);
	} else if (camera.mode == "slowpan") {
		if (camera.slowpanstarttime == null) {
			camera.slowpanstarttime = time;
		}
		var elapsed = time - camera.slowpanstarttime;
		var distance = utils.distance(camera.slowpanstartX, camera.slowpanstartY, camera.targetX, camera.targetY);
		var pixelsmoved = (elapsed / 1000) * gamesettings.slowpanspeed;

		if (pixelsmoved >= distance) {
			camera.actualX = camera.targetX;
			camera.actualY = camera.targetY;
			camera.targetZoom = zoom;
			camera.mode = "fixedpoint";
			camera.slowpanondestreached();
		} else {
			var newpt = utils.pixelstoward(camera.slowpanstartX, camera.slowpanstartY, camera.targetX, camera.targetY, pixelsmoved);
			camera.actualX = newpt.x;
			camera.actualY = newpt.y;
		}
		lerp(0, 0, camera.targetZoom, false);
	}
}
camera.PlaceTexture = function(texture, x, y, xOrigin, yOrigin) {	// origin decides what part of texture the placement point represents, between -1 and 1, -1 is left edge or top edge, 0 is center, 1 is right edge or bottom edge
	var textureW = texture.width * gamesettings.basescalefactor * camera.actualZoom;
	var textureH = texture.height * gamesettings.basescalefactor * camera.actualZoom;
	var normX = x;
	var normY = y;
	if (xOrigin < 0) {
		normX = x + textureW / 2;
	} else if (xOrigin > 0) {
		normX = x - textureW / 2;
	}
	if (yOrigin < 0) {
		normY = y + textureH / 2;
	} else if (yOrigin > 0) {
		normY = y - textureH / 2;
	}

	var screenPt = camera.PlacePoint(normX, normY);
	var screenX = screenPt.x - textureW / 2;
	var screenY = screenPt.y - textureH / 2;

	return {x: screenX, y: screenY, width: textureW, height: textureH};
}

camera.PlacePoint = function(x, y) {
	var screenX = x - camera.actualX;
	var screenY = y - camera.actualY;
	screenX = screenX * camera.actualZoom;
	screenY = screenY * camera.actualZoom;
	screenX = screenX + canvas.width / 2;
	screenY = screenY + canvas.height / 2;

	return {x: screenX, y: screenY};
}
