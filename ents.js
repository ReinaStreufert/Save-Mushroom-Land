(function() {
	window.ents = {};

	let doPhysics = function(ent, time) {
		if (ent.lasttime == null) {
			ent.lasttime = time;
		}
		var elapsed = time - ent.lasttime;
		var elapsedseconds = elapsed / 1000;
		var entleft = ent.x - ent.width / 2;
		var entright = ent.x + ent.width / 2;

		ent.yvel -= ent.gravity * elapsedseconds;

		var winds = gamestate.level.winds;
		for (let i = 0; i < winds.length; i++) {
			let column = winds[i];
			if (entright >= column.Left() && entleft <= column.Right() && ent.y < gamesettings.windthreshold) {
				//console.log("asd");
				ent.yvel += (ent.gravity + gamesettings.windforce) * elapsedseconds;
			}
		}
		var mushrooms = gamestate.level.mushrooms;
		var inair = true;
		for (let i = 0; i < mushrooms.length; i++) {
			let mushroom = mushrooms[i];
			if (mushroom.platformleft <= entleft && mushroom.platformright >= entright && ent.y >= mushroom.platformy && (ent.y + (ent.yvel * elapsedseconds)) < mushroom.platformy) {
				inair = false;
				ent.yvel = 0;
				ent.jumping = false;
				ent.y = mushroom.platformy;
			}
		}
		ent.inair = inair;
		if (ent.jumprequest) {
			if (!ent.inair) {
				ent.yvel = ent.jumppower;
				ent.jumping = true;
			}
			ent.jumprequest = false;
		}

		if (ent.yvel > gamesettings.terminalvelocity) {
			ent.yvel = gamesettings.terminalvelocity;
		} else if (ent.yvel < -gamesettings.terminalvelocity) {
			ent.yvel = -gamesettings.terminalvelocity;
		}

		ent.y += ent.yvel * elapsedseconds;
		ent.x += ent.movespeed * ent.direction * elapsedseconds;
		ent.lasttime = time;
	}

	let doOffscreen = function(ent, texrect, ctx) {
		if (texrect.y > canvas.height) {
			var deathThesholdScreen = camera.WorldPointToScreenPoint(0, gamesettings.froggideaththreshold).y;
			var yzero = camera.WorldPointToScreenPoint(0, 0).y;
			var maxdifference = (deathThesholdScreen - yzero);
			var difference = maxdifference - (deathThesholdScreen - texrect.y);
			var mag = ((difference / maxdifference) * 1);

			var rect = camera.PlaceTexture(textures.offscreen, ent.x, gamesettings.offscreenarrowoffset, 0, 0);
			//var magrect = {x: rect.x - (rect.width * mag) / 2, y: rect.y - (rect.height * mag) / 2, width: rect.width * mag, height: rect.height * mag};
			ctx.globalAlpha = mag;
			ctx.drawImage(textures.offscreen, rect.x, rect.y, rect.width, rect.height);
			ctx.globalAlpha = 1;
			return true;
		} else {
			return false;
		}
	}

	ents.froggi = {};
	let froggi = ents.froggi;
	froggi.ReceiveKeyUpdates = true;
	froggi.direction = 0;
	froggi.jumping = false;
	froggi.jumprequest = false;
	froggi.inair = false;
	froggi.x = 0;
	froggi.y = 0;
	froggi.width = 20 * gamesettings.basescalefactor;
	froggi.yvel = 0;
	froggi.movespeed = gamesettings.entdefaultmovespeed;
	froggi.gravity = gamesettings.gravity;
	froggi.jumppower = gamesettings.entdefaultjumppower;
	froggi.lasttime = null;

	froggi.tongue = 0;
	froggi.Do = function(ctx, time) {
		doPhysics(froggi, time);
		if (!froggi.inair && !froggi.jumping && froggi.direction != 0) {
			froggi.jumprequest = true;
		}
		var usedTex;
		var offset = 0;
		if (froggi.jumping) {
			if (froggi.tongue == 1) {
				usedTex = textures.froggijumptongueright;
				offset = 7 * gamesettings.basescalefactor;
			} else if (froggi.tongue == -1) {
				usedTex = textures.froggijumptongueleft;
				offset = -7 * gamesettings.basescalefactor;
			} else {
				usedTex = textures.froggijump;
			}
		} else {
			if (froggi.tongue == 1) {
				usedTex = textures.froggitongueright
				offset = 7.5 * gamesettings.basescalefactor;
			} else if (froggi.tongue == -1) {
				usedTex = textures.froggitongueleft;
				offset = -7.5 * gamesettings.basescalefactor;
			} else {
				usedTex = textures.froggistill;
			}
		}
		var rect = camera.PlaceTexture(usedTex, froggi.x + offset, froggi.y, 0, 1);

		if (!doOffscreen(froggi, rect, ctx)) {
			ctx.drawImage(usedTex, rect.x, rect.y, rect.width, rect.height);
		}
		if (froggi.y < gamesettings.froggideaththreshold) {
			gamestate.level.Reset();
		}


	}
	froggi.KeyDown = function(key) {
		if (key.code == "Space" || key.code == "KeyW") {
			froggi.jumprequest = true;
		} else if (key.code == "KeyD") {
			froggi.direction = 1;
			if (!froggi.inair) {
				froggi.jumprequest = true;
			}
		} else if (key.code == "KeyA") {
			froggi.direction = -1;
			if (!froggi.inair) {
				froggi.jumprequest = true;
			}
		} else if (key.code == "ArrowRight") {
			froggi.tongue = 1;
		} else if (key.code == "ArrowLeft") {
			froggi.tongue = -1;
		}
	}
	froggi.KeyUp = function(key) {
		if (key.code == "KeyD" && froggi.direction == 1) {
			froggi.direction = 0;
		} else if (key.code == "KeyA" && froggi.direction == -1) {
			froggi.direction = 0;
		} else if (key.code == "ArrowRight" && froggi.tongue == 1) {
			froggi.tongue = 0;
		} else if (key.code == "ArrowLeft" && froggi.tongue == -1) {
			froggi.tongue = 0;
		}
	}
})();
