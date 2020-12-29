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
	froggi.Health = 1;
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
	froggi.lasttongue = 0;
	froggi.Do = function(ctx, time) {
		doPhysics(froggi, time);
		if (!froggi.inair && !froggi.jumping && froggi.direction != 0) {
			froggi.jumprequest = true;
		}
		var tongueelapsed = time - froggi.lasttongue;
		var usedTex;
		var offset = 0;
		if (froggi.jumping) {
			if (froggi.tongue == 1 && tongueelapsed <= gamesettings.froggitonguetime) {
				usedTex = textures.froggijumptongueright;
				offset = 7 * gamesettings.basescalefactor;
			} else if (froggi.tongue == -1 && tongueelapsed <= gamesettings.froggitonguetime) {
				usedTex = textures.froggijumptongueleft;
				offset = -7 * gamesettings.basescalefactor;
			} else {
				usedTex = textures.froggijump;
			}
		} else {
			if (froggi.tongue == 1 && tongueelapsed <= gamesettings.froggitonguetime) {
				usedTex = textures.froggitongueright
				offset = 7.5 * gamesettings.basescalefactor;
			} else if (froggi.tongue == -1 && tongueelapsed <= gamesettings.froggitonguetime) {
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
		ctx.fillStyle = "red";
		//var tonguept = camera.WorldPointToScreenPoint(froggi.x + 24 * gamesettings.basescalefactor * froggi.tongue, froggi.y + (froggi.Height() - 6 * gamesettings.basescalefactor));
		//ctx.fillRect(tonguept.x - 5, tonguept.y - 5, 10, 10);
		if (froggi.y < gamesettings.froggideaththreshold) {
			froggi.Kill();
		}


	}
	froggi.KeyDown = function(key) {
		if (froggi.Dead) {
			return;
		}
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
			if (froggi.lasttime - froggi.lasttongue > gamesettings.froggitonguetime) {
				froggi.tongue = 1;
				var tonguept = {x: froggi.x + 24 * gamesettings.basescalefactor * froggi.tongue, y: froggi.y + (froggi.Height() - 6 * gamesettings.basescalefactor)};
				froggi.lasttongue = froggi.lasttime;

				if (ents.benshapiro.AIEnabled) {
					if (froggi.x < ents.benshapiro.x) {
						console.log((tonguept.x >= ents.benshapiro.x - ents.benshapiro.width / 2) + ' ' + (tonguept.y >= ents.benshapiro.y) + ' ' + (tonguept.y <= ents.benshapiro.y + ents.benshapiro.Height()));
						if (tonguept.x >= ents.benshapiro.x - ents.benshapiro.width / 2 && tonguept.y >= ents.benshapiro.y && tonguept.y <= ents.benshapiro.y + ents.benshapiro.Height()) {
							ents.benshapiro.TakeDamage(gamesettings.froggidamage);
						}
					}
				}
			}
		} else if (key.code == "ArrowLeft") {
			if (froggi.lasttime - froggi.lasttongue > gamesettings.froggitonguetime) {
				froggi.tongue = -1;
				var tonguept = {x: froggi.x + 24 * gamesettings.basescalefactor * froggi.tongue, y: froggi.y + (froggi.Height() - 6 * gamesettings.basescalefactor)};
				froggi.lasttongue = froggi.lasttime;

				if (ents.benshapiro.AIEnabled) {
					if (froggi.x > ents.benshapiro.x) {
						//console.log(tonguept.x <= ents.benshapiro.x + ents.benshapiro.width / 2 + ' ' + tonguept.y >= ents.benshapiro.y + ' ' + tonguept.y <= ents.benshapiro.y + ents.benshapiro.Height());
						console.log(tonguept.x + ' ' + ents.benshapiro.x + ents.benshapiro.width / 2);
						if (tonguept.x <= ents.benshapiro.x + ents.benshapiro.width / 2 && tonguept.y >= ents.benshapiro.y && tonguept.y <= ents.benshapiro.y + ents.benshapiro.Height()) {
							ents.benshapiro.TakeDamage(gamesettings.froggidamage);
						}
					}
				}
			}
		}
	}
	froggi.KeyUp = function(key) {
		if (froggi.Dead) {
			return;
		}
		if (key.code == "KeyD" && froggi.direction == 1) {
			froggi.direction = 0;
		} else if (key.code == "KeyA" && froggi.direction == -1) {
			froggi.direction = 0;
		}
	}
	froggi.TestHitbox = function(x, y) {
		let hitboxrange;
		if (froggi.jumping) {
			hitboxrange = {x: froggi.x - 10 * gamesettings.basescalefactor, y: froggi.y, width: 20 * gamesettings.basescalefactor, height: 19 * gamesettings.basescalefactor};
		} else {
			hitboxrange = {x: froggi.x - 10 * gamesettings.basescalefactor, y: froggi.y, width: 20 * gamesettings.basescalefactor, height: 16 * gamesettings.basescalefactor};
		}
		if (x >= hitboxrange.x && x <= hitboxrange.x + hitboxrange.width && y >= hitboxrange.y && y <= hitboxrange.y + hitboxrange.height) {
			return true;
		} else {
			return false;
		}
	}
	froggi.Height = function() {
		if (froggi.jumping) {
			return 19 * gamesettings.basescalefactor;
		} else {
			return 16 * gamesettings.basescalefactor;
		}
	};
	froggi.TakeDamage = function(health) {
		froggi.Health -= health;
		if (froggi.Health < 0.01) {
			froggi.Health = 0;
			froggi.Kill();
		}
	}
	froggi.Kill = function() {
		froggi.Dead = true;
		froggi.jumprequest = false;
		froggi.direction = 0;
		gamestate.level.OnDeath();
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
	benshapiro.deadInternal = false;
	benshapiro.AIEnabled = false;
	benshapiro.Health = 1;
	benshapiro.direction = 0;
	benshapiro.facing = -1;
	benshapiro.jumping = false;
	benshapiro.jumprequest = false;
	benshapiro.inair = false;
	benshapiro.currentmushroom = null;
	benshapiro.punch = false;
	benshapiro.lastpunch = 0;
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
		let lastpunchelapsed = time - benshapiro.lastpunch;
		if (benshapiro.AIEnabled) {
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
				if (benshapiro.direction == 0) {
					if (ents.froggi.TestHitbox(benshapiro.x + (9 * gamesettings.basescalefactor * benshapiro.facing), benshapiro.y + 8 * gamesettings.basescalefactor)) {
						if (lastpunchelapsed > gamesettings.benshapiropunchinterval) {
							benshapiro.lastpunch = time;
							lastpunchelapsed = 0;
							ents.froggi.TakeDamage(gamesettings.benshapirodamage);
						}
					}
				}
			}
		} else {
			benshapiro.direction = 0;
		}

		if (lastpunchelapsed <= gamesettings.benshapiropunchinterval / 2) {
			benshapiro.punch = true;
		} else {
			benshapiro.punch = false;
		}

		let usedTex;
		let offset = 0;

		if (benshapiro.currentmushroom != null) {
			if (benshapiro.direction == -1 && benshapiro.x <= benshapiro.currentmushroom.platformleft + (gamesettings.jumppoint * gamesettings.basescalefactor)) {
				if (benshapiro.currentmushroom.edgemushroom == -1) {
					benshapiro.direction = 0;
				} else {
					benshapiro.jumprequest = true;
				}
			}
			if (benshapiro.direction == 1 && benshapiro.x >= benshapiro.currentmushroom.platformright - (gamesettings.jumppoint * gamesettings.basescalefactor)) {
				if (benshapiro.currentmushroom.edgemushroom == 1) {
					benshapiro.direction = 0;
				} else {
					benshapiro.jumprequest = true;
				}
			}
		}

		if (benshapiro.direction != 0 && !benshapiro.inair) {
			let walkelapsed = time - benshapiro.lastwalk;
			if (walkelapsed > gamesettings.walkcycleinterval) {
				benshapiro.walkcycle++;
				if (benshapiro.walkcycle > 3) {
					benshapiro.walkcycle = 0;
				}
				benshapiro.lastwalk = time;
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

		if (benshapiro.deadInternal) {
			usedTex = textures.benshapirodead;
		}

		var rect = camera.PlaceTexture(usedTex, benshapiro.x + offset, benshapiro.y, 0, 1);

		if (!doOffscreen(benshapiro, rect, ctx)) {
			ctx.drawImage(usedTex, rect.x, rect.y, rect.width, rect.height);
		}
	}
	benshapiro.TakeDamage = function(damage) {
		benshapiro.Health -= damage;
		sounds.PlayBenShapiroSound();
		if (benshapiro.Health <= 0.01) {
			benshapiro.deadInternal = true;
			benshapiro.AIEnabled = false;
			benshapiro.Health = 1;
			gamestate.level.OnEnemyDeath();
		}
	}
	benshapiro.Height = function() {
		return 23 * gamesettings.basescalefactor;
	}
})();
