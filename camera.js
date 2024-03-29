(function() {
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
	camera.mode = "first"; // "fixedpoint", "focus" (follows a certain entity), "slowpan"

	let lerp = function(x, y, zoom, doxy) {
		var difX = x - camera.actualX;
		var difY = y - camera.actualY;
		var difzoom = zoom - camera.actualZoom;

		if (doxy) {
			camera.actualX += difX * gamesettings.cameralerpspeed;
			camera.actualY += difY * gamesettings.cameralerpspeed;
		} else {
			camera.actualZoom += difzoom * gamesettings.cameralerpspeed;
		}
	}

	let calculateYZero = function() {
		return ((canvas.height / camera.actualZoom) / 2);
	}

	camera.YZero = function() {
		return calculateYZero();
	}

	camera.SetFocus = function(ent, zoom) {
		camera.focus = ent;
		camera.targetZoom = zoom;
		if (camera.mode == "first") {
			let x = camera.focus.x;
			let y = camera.focus.y;
			if (y < 91 * gamesettings.basescalefactor) {
				y = 91 * gamesettings.basescalefactor;
			}
			camera.actualX = x;
			camera.actualY = y + 90 * gamesettings.basescalefactor;
		}
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
		camera.slowpanstartX = camera.actualX;
		camera.slowpanstartY = camera.actualY;
		camera.targetZoom = zoom;
		camera.slowpanondestreached = ondestinationreached;
		camera.mode = "slowpan";
	}
	camera.Do = function(time) {
		lerp(0, 0, camera.targetZoom, false);
		if (camera.mode == "fixedpoint") {
			lerp(camera.targetX, camera.targetY, camera.targetZoom, true);
		} else if (camera.mode == "focus") {
			let x = camera.focus.x;
			let y = camera.focus.y;
			let yzero = calculateYZero();
			if (y < yzero) {
				y = yzero;
			}
			lerp(x, y, camera.targetZoom, true);
			if (camera.actualY < yzero) {
				camera.actualY = yzero;
			}
		} else if (camera.mode == "slowpan") {
			if (camera.slowpanstarttime == null) {
				camera.slowpanstarttime = time;
			}
			var elapsed = time - camera.slowpanstarttime;
			var distance = utils.distance(camera.slowpanstartX, camera.slowpanstartY, camera.targetX, camera.targetY);
			var pixelsmoved = (elapsed / 1000) * gamesettings.slowpanspeed;
			//console.log(camera.targetX + " " + camera.targetY);
			if (pixelsmoved >= distance) {
				camera.actualX = camera.targetX;
				camera.actualY = camera.targetY;
				camera.mode = "fixedpoint";
				camera.slowpanondestreached();
			} else {
				var newpt = utils.pixelstoward(camera.slowpanstartX, camera.slowpanstartY, camera.targetX, camera.targetY, pixelsmoved);
				camera.actualX = newpt.x;
				camera.actualY = newpt.y;
			}
		}
	}
	camera.PlaceTexture = function(texture, x, y, xOrigin, yOrigin, offscreen = null) {	// origin decides what part of texture the placement point represents, between -1 and 1, -1 is left edge or top edge, 0 is center, 1 is right edge or bottom edge
		var textureW = texture.width * gamesettings.basescalefactor;
		var textureH = texture.height * gamesettings.basescalefactor;
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
		var screenY = (screenPt.y - textureH / 2) - textureH;

		screenX -= canvas.width / 2;
		screenX *= camera.actualZoom;
		screenX += canvas.width / 2;
		screenY -= canvas.height / 2;
		screenY *= camera.actualZoom;
		screenY += canvas.height / 2;

		var result = {x: screenX, y: screenY, width: textureW * camera.actualZoom, height: textureH * camera.actualZoom};
		if (offscreen != null) {
			offscreen.x = result.x;
			offscreen.y = result.y;
			offscreen.width = result.width;
			offscreen.height = result.height;
		}
		if (result.x + result.width < 0 || result.x > canvas.width || result.y + result.height < 0 || result.y > canvas.height) {
			return null;
		}
		//console.log(result.x + " " + result.y + " " + result.width + " " + result.height);
		return result;
	}
	camera.PlaceRect = function(x, y, width, height, xOrigin, yOrigin) {	// origin decides what part of texture the placement point represents, between -1 and 1, -1 is left edge or top edge, 0 is center, 1 is right edge or bottom edge
		var textureW = width;
		var textureH = height;
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
		var screenY = (screenPt.y - textureH / 2) - textureH;

		screenX -= canvas.width / 2;
		screenX *= camera.actualZoom;
		screenX += canvas.width / 2;
		screenY -= canvas.height / 2;
		screenY *= camera.actualZoom;
		screenY += canvas.height / 2;

		var result = {x: screenX, y: screenY, width: textureW * camera.actualZoom, height: textureH * camera.actualZoom};
		return result;
	}

	camera.WorldPointToScreenPoint = function(x, y) {
		screenPt = camera.PlacePoint(x, y);
		var screenX = screenPt.x;
		var screenY = screenPt.y;

		screenX -= canvas.width / 2;
		screenX *= camera.actualZoom;
		screenX += canvas.width / 2;
		screenY -= canvas.height / 2;
		screenY *= camera.actualZoom;
		screenY += canvas.height / 2;

		return {x: screenX, y: screenY};
	}

	camera.PlaceFixedTexture = function(texture, x, y, xOrigin, yOrigin) {	// origin decides what part of texture the placement point represents, between -1 and 1, -1 is left edge or top edge, 0 is center, 1 is right edge or bottom edge
		var textureW = texture.width * gamesettings.basescalefactor;
		var textureH = texture.height * gamesettings.basescalefactor;
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

		var screenPt = camera.PlacePointFixed(normX, normY);
		var screenX = screenPt.x - textureW / 2;
		var screenY = (screenPt.y - textureH / 2);

		screenX -= canvas.width / 2;
		screenX *= camera.actualZoom;
		screenX += canvas.width / 2;
		screenY -= canvas.height / 2;
		screenY *= camera.actualZoom;
		screenY += canvas.height / 2;

		var result = {x: screenX, y: screenY, width: textureW * camera.actualZoom, height: textureH * camera.actualZoom};
		//console.log(result.x + " " + result.y + " " + result.width + " " + result.height);
		return result;
	}

	camera.PlacePoint = function(x, y) {
		var screenX = x - camera.actualX;
		var screenY = y - camera.actualY;
		screenX = screenX + canvas.width / 2;
		screenY = screenY + canvas.height / 2;

		return {x: screenX, y: canvas.height - screenY};
	}

	camera.PlacePointFixed = function(x, y) {
		return {x: x, y: canvas.height - y};
	}
})();
