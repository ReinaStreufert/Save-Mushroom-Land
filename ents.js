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
		ent.currentmushroom = null;
		for (let i = 0; i < mushrooms.length; i++) {
			let mushroom = mushrooms[i];
			if (mushroom.platformleft <= entleft && mushroom.platformright >= entright && ent.y >= mushroom.platformy && (ent.y + (ent.yvel * elapsedseconds)) < mushroom.platformy) {
				if (mushroom.OnTrigger && !mushroom.trigger) {
					mushroom.OnTrigger();
					mushroom.trigger = true;
				}
				ent.currentmushroom = mushroom;
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
			if (mag < 0) {
				mag = 0;
			}
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
	froggi.Dead = false;
	froggi.direction = 0;
	froggi.jumping = false;
	froggi.jumprequest = false;
	froggi.inair = false;
	froggi.currentmushroom = null;
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
			gamestate.level.OnDeath();
			froggi.Dead = true;
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

	ents.fallingmushroom = {};
	let fallingmushroom = ents.fallingmushroom;
	fallingmushroom.ReceiveKeyUpdates = false;
	fallingmushroom.Dead = false;
	fallingmushroom.x = 0;
	fallingmushroom.y = 0;
	fallingmushroom.animationstart = null;
	fallingmushroom.startrequest = false;
	fallingmushroom.StartAnimation = function() {
		fallingmushroom.startrequest = true;
	}
	fallingmushroom.Reset = function() {
		fallingmushroom.animationstart = null;
	}
	fallingmushroom.Do = function(ctx, time) {
		if (fallingmushroom.startrequest) {
			fallingmushroom.startrequest = false;
			fallingmushroom.animationstart = time;
		}
		if (fallingmushroom.animationstart != null) {
			var stumprect = camera.PlaceTexture(textures.mushroom5stump, fallingmushroom.x, fallingmushroom.y, 0, 1);
			ctx.drawImage(textures.mushroom5stump, stumprect.x, stumprect.y, stumprect.width, stumprect.height);
			var elapsed = time - fallingmushroom.animationstart;
			if (elapsed < gamesettings.fallingmushroomanimationlength) {
				var progress = elapsed / gamesettings.fallingmushroomanimationlength;
				var progressCurved = utils.calculatecubicbezier(gamesettings.fallingmushroomanimationcurve, progress).y;

				var y = fallingmushroom.y + (progressCurved * (gamesettings.fallingmushroomendingy * gamesettings.basescalefactor)) + (textures.mushroom5stump.height * gamesettings.basescalefactor);
				var angle = progressCurved * gamesettings.fallingmushroomendingangle;

				var toprect = camera.PlaceTexture(textures.mushroom5top, fallingmushroom.x, y, 0, 1);
				var centerx = toprect.x + toprect.width / 2;
				var bottomy = toprect.y + toprect.height;
				ctx.translate(centerx, bottomy);
				ctx.rotate(-angle);
				ctx.translate(-centerx, -bottomy);
				ctx.drawImage(textures.mushroom5top, toprect.x, toprect.y, toprect.width, toprect.height);
				ctx.setTransform(1, 0, 0, 1, 0, 0);
			}
		} else {
			var rect = camera.PlaceTexture(textures.mushroom5, fallingmushroom.x, fallingmushroom.y, 0, 1);
			ctx.drawImage(textures.mushroom5, rect.x, rect.y, rect.width, rect.height);
		}
	}

	ents.engineer = {};
	let engineer = ents.engineer;
	engineer.ReceiveKeyUpdates = false;
	engineer.Dead = false;
	engineer.x = 0;
	engineer.y = 0;
	engineer.lastswitch = null;
	engineer.current = 0;
	engineer.Do = function(ctx, time) {
		if (engineer.lastswitch == null) {
			engineer.lastswitch = time;
		}
		let elapsed = time - engineer.lastswitch;
		if (elapsed > gamesettings.engineerswitchinterval) {
			if (engineer.current == 0) {
				engineer.current = 1;
			} else if (engineer.current == 1) {
				engineer.current = 0;
			}
			engineer.lastswitch = time;
			//console.log("switch");
		}
		let usedTexture;
		if (engineer.current == 0) {
			usedTexture = textures.engineer1;
		} else if (engineer.current == 1) {
			usedTexture = textures.engineer2;
		}
		let texRect = camera.PlaceTexture(usedTexture, engineer.x, engineer.y, 0, 1);
		ctx.drawImage(usedTexture, texRect.x, texRect.y, texRect.width, texRect.height);
	}

	ents.benshapiro = {};
	let benshapiro = ents.benshapiro;
	benshapiro.ReceiveKeyUpdates = false;
	benshapiro.Dead = false;
	benshapiro.AIEnabled = false;
	benshapiro.direction = 0;
	benshapiro.facing = -1;
	benshapiro.jumping = false;
	benshapiro.jumprequest = false;
	benshapiro.inair = false;
	benshapiro.currentmushroom = null;
	benshapiro.punch = false;
	benshapiro.x = 0;
	benshapiro.y = 0;
	benshapiro.width = 9 * gamesettings.basescalefactor;
	benshapiro.yvel = 0;
	benshapiro.movespeed = gamesettings.entdefaultmovespeed;
	benshapiro.gravity = gamesettings.gravity;
	benshapiro.jumppower = gamesettings.entenemyjumppower;
	benshapiro.lasttime = null;
	benshapiro.walkcycle = 0;
	benshapiro.lastwalk = 0;

	benshapiro.Do = function(ctx, time) {
		doPhysics(benshapiro, time);
		if (benshapiro.AIEnabled) {
			benshapiro.punch = false;
			if (Math.abs(ents.froggi.x - benshapiro.x) >= gamesettings.minaifollowdistance) {
				if (!benshapiro.inair) {
					if (benshapiro.x < ents.froggi.x) {
						benshapiro.direction = 1;
						benshapiro.facing = 1;
					} else if (benshapiro.x > ents.froggi.x) {
						benshapiro.direction = -1;
						benshapiro.facing = -1;
					}
				}
			} else {
				if (!benshapiro.inair) {
					benshapiro.direction = 0;
					if (benshapiro.x < ents.froggi.x) {
						benshapiro.facing = 1;
					} else if (benshapiro.x > ents.froggi.x) {
						benshapiro.facing = -1;
					}
					if (benshapiro.y < ents.froggi.y) {
						benshapiro.jumprequest = true;
					}
				}
				benshapiro.punch = true;
			}
		} else {
			benshapiro.direction = 0;
		}

		let usedTex;
		let offset = 0;

		if (benshapiro.direction != 0 && !benshapiro.inair) {
			let walkelapsed = time - benshapiro.lastwalk;
			if (walkelapsed > gamesettings.walkcycleinterval) {
				benshapiro.walkcycle++;
				if (benshapiro.walkcycle > 3) {
					benshapiro.walkcycle = 0;
				}
				benshapiro.lastwalk = time;

				if (benshapiro.currentmushroom != null) {
					if (benshapiro.direction == -1 && benshapiro.x <= benshapiro.currentmushroom.platformleft + (gamesettings.jumppoint * gamesettings.basescalefactor)) {
						benshapiro.jumprequest = true;
					}
					if (benshapiro.direction == 1 && benshapiro.x >= benshapiro.currentmushroom.platformright - (gamesettings.jumppoint * gamesettings.basescalefactor)) {
						benshapiro.jumprequest = true;
					}
				}
			}
		} else {
			benshapiro.walkcycle = 0;
		}

		if (benshapiro.facing < 0) {
			if (benshapiro.walkcycle == 0) {
				if (benshapiro.punch) {
					usedTex = textures.benshapiropunchleft;
					offset = -3 * gamesettings.basescalefactor;
				} else {
					usedTex = textures.benshapirostillleft;
				}
			} else if (benshapiro.walkcycle == 1 || benshapiro.walkcycle == 3) {
				usedTex = textures.benshapirowalk1left;
			} else if (benshapiro.walkcycle == 2) {
				usedTex = textures.benshapirowalk2left;
			}
		} else if (benshapiro.facing > 0) {
			if (benshapiro.walkcycle == 0) {
				if (benshapiro.punch) {
					usedTex = textures.benshapiropunchright;
					offset = 3 * gamesettings.basescalefactor;
				} else {
					usedTex = textures.benshapirostillright;
				}
			} else if (benshapiro.walkcycle == 1 || benshapiro.walkcycle == 3) {
				usedTex = textures.benshapirowalk1right;
			} else if (benshapiro.walkcycle == 2) {
				usedTex = textures.benshapirowalk2right;
			}
		}

		var rect = camera.PlaceTexture(usedTex, benshapiro.x + offset, benshapiro.y, 0, 1);

		if (!doOffscreen(benshapiro, rect, ctx)) {
			ctx.drawImage(usedTex, rect.x, rect.y, rect.width, rect.height);
		}
	}
})();
