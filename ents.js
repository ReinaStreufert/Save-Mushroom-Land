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
			if (rect != null) {
				ctx.globalAlpha = mag;
				ctx.drawImage(textures.offscreen, rect.x, rect.y, rect.width, rect.height);
				ctx.globalAlpha = 1;
			}
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
	froggi.happy = false;
	froggi.lastheart = 0;

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
				if (froggi.happy) {
					usedTex = textures.froggijumphappy;
				} else {
					usedTex = textures.froggijump;
				}
			}
		} else {
			if (froggi.tongue == 1 && tongueelapsed <= gamesettings.froggitonguetime) {
				usedTex = textures.froggitongueright
				offset = 7.5 * gamesettings.basescalefactor;
			} else if (froggi.tongue == -1 && tongueelapsed <= gamesettings.froggitonguetime) {
				usedTex = textures.froggitongueleft;
				offset = -7.5 * gamesettings.basescalefactor;
			} else {
				if (froggi.happy) {
					usedTex = textures.froggistillhappy;
				} else {
					usedTex = textures.froggistill;
				}
			}
		}

		if (froggi.happy) {
			if (froggi.lastheart == 0) {
				froggi.lastheart = time;
			}
			if (time - froggi.lastheart >= gamesettings.heartgeninterval) {
				froggi.lastheart = time;
				let heart = ents.hearts.new();
				gamestate.level.ents.push(heart);
			}
		}

		var offscreen = {};
		var rect = camera.PlaceTexture(usedTex, froggi.x + offset, froggi.y, 0, 1, offscreen);

		if (!doOffscreen(froggi, offscreen, ctx) && rect != null) {
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
			if (froggi.happy) {
				return; // i didnt feel like doubling the amount of froggi sprites so i didnt make happy tongue sprites. they're not needed on the break level so.
			}
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
				if (ents.edsheeran.AIEnabled) {
					if (froggi.x < ents.edsheeran.x) {
						console.log((tonguept.x >= ents.edsheeran.x - ents.edsheeran.width / 2) + ' ' + (tonguept.y >= ents.edsheeran.y) + ' ' + (tonguept.y <= ents.edsheeran.y + ents.edsheeran.Height()));
						if (tonguept.x >= ents.edsheeran.x - ents.edsheeran.width / 2 && tonguept.y >= ents.edsheeran.y && tonguept.y <= ents.edsheeran.y + ents.edsheeran.Height()) {
							ents.edsheeran.TakeDamage(gamesettings.froggidamage);
						}
					}
				}
			}
		} else if (key.code == "ArrowLeft") {
			if (froggi.happy) {
				return; // i didnt feel like doubling the amount of froggi sprites so i didnt make happy tongue sprites. they're not needed on the break level so.
			}
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
				if (ents.edsheeran.AIEnabled) {
					if (froggi.x > ents.edsheeran.x) {
						//console.log(tonguept.x <= ents.edsheeran.x + ents.edsheeran.width / 2 + ' ' + tonguept.y >= ents.edsheeran.y + ' ' + tonguept.y <= ents.edsheeran.y + ents.edsheeran.Height());
						console.log(tonguept.x + ' ' + ents.edsheeran.x + ents.edsheeran.width / 2);
						if (tonguept.x <= ents.edsheeran.x + ents.edsheeran.width / 2 && tonguept.y >= ents.edsheeran.y && tonguept.y <= ents.edsheeran.y + ents.edsheeran.Height()) {
							ents.edsheeran.TakeDamage(gamesettings.froggidamage);
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
			if (stumprect != null) {
				ctx.drawImage(textures.mushroom5stump, stumprect.x, stumprect.y, stumprect.width, stumprect.height);
			}
			var elapsed = time - fallingmushroom.animationstart;
			if (elapsed < gamesettings.fallingmushroomanimationlength) {
				var progress = elapsed / gamesettings.fallingmushroomanimationlength;
				var progressCurved = utils.calculatecubicbezier(gamesettings.fallingmushroomanimationcurve, progress).y;

				var y = fallingmushroom.y + (progressCurved * (gamesettings.fallingmushroomendingy * gamesettings.basescalefactor)) + (textures.mushroom5stump.height * gamesettings.basescalefactor);
				var angle = progressCurved * gamesettings.fallingmushroomendingangle;

				var toprect = camera.PlaceTexture(textures.mushroom5top, fallingmushroom.x, y, 0, 1);
				if (toprect != null) {
					var centerx = toprect.x + toprect.width / 2;
					var bottomy = toprect.y + toprect.height;
					ctx.translate(centerx, bottomy);
					ctx.rotate(-angle);
					ctx.translate(-centerx, -bottomy);
					ctx.drawImage(textures.mushroom5top, toprect.x, toprect.y, toprect.width, toprect.height);
					ctx.setTransform(1, 0, 0, 1, 0, 0);
				}
			}
		} else {
			var rect = camera.PlaceTexture(textures.mushroom5, fallingmushroom.x, fallingmushroom.y, 0, 1);
			if (rect != null) {
				ctx.drawImage(textures.mushroom5, rect.x, rect.y, rect.width, rect.height);
			}
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
		if (texRect != null) {
			ctx.drawImage(usedTexture, texRect.x, texRect.y, texRect.width, texRect.height);
		}
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
		let lastpunchelapsed = time - benshapiro.lastpunch;
		doPhysics(benshapiro, time);
		if (benshapiro.AIEnabled) {
			if (!benshapiro.deadInternal) {
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
				if (!benshapiro.inair) {
					benshapiro.direction = 0;
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

		if (benshapiro.deadInternal && benshapiro.direction == 0) {
			usedTex = textures.benshapirodead;
		}

		var offscreen = {};
		var rect = camera.PlaceTexture(usedTex, benshapiro.x + offset, benshapiro.y, 0, 1, offscreen);

		if (!doOffscreen(benshapiro, offscreen, ctx) && rect != null) {
			ctx.drawImage(usedTex, rect.x, rect.y, rect.width, rect.height);
		}
	}
	benshapiro.TakeDamage = function(damage) {
		benshapiro.Health -= damage;
		sounds.PlayBenShapiroSound();
		if (benshapiro.Health <= 0.01) {
			benshapiro.deadInternal = true;
			//benshapiro.AIEnabled = false;
			benshapiro.Health = 1;
			gamestate.level.OnEnemyDeath();
		}
	}
	benshapiro.Height = function() {
		return 23 * gamesettings.basescalefactor;
	}

	ents.edsheeran = {};
	let edsheeran = ents.edsheeran;
	edsheeran.ReceiveKeyUpdates = false;
	edsheeran.Dead = false;
	edsheeran.deadInternal = false;
	edsheeran.fullDeath = false;
	edsheeran.AIEnabled = false;
	edsheeran.Health = 1;
	edsheeran.direction = 0;
	edsheeran.facing = -1;
	edsheeran.jumping = false;
	edsheeran.jumprequest = false;
	edsheeran.inair = false;
	edsheeran.currentmushroom = null;
	edsheeran.x = 0;
	edsheeran.y = 0;
	edsheeran.width = 9 * gamesettings.basescalefactor;
	edsheeran.yvel = 0;
	edsheeran.movespeed = gamesettings.entdefaultmovespeed;
	edsheeran.gravity = gamesettings.gravity;
	edsheeran.jumppower = gamesettings.entenemyjumppower;
	edsheeran.lasttime = null;
	edsheeran.walkcycle = 0;
	edsheeran.lastwalk = 0;
  edsheeran.AIEnabled = false;
	edsheeran.lastvirginityray = 0;
	edsheeran.virginityraygenerated = false;
  edsheeran.Do = function(ctx, time) {
		if (edsheeran.lastvirginityray == 0) {
			edsheeran.lastvirginityray = time;
		}
		let virginityelapsed = time - edsheeran.lastvirginityray;
		doPhysics(edsheeran, time);
    if (edsheeran.AIEnabled) {
      if (!edsheeran.inair) {
				if (edsheeran.deadInternal) {
					edsheeran.direction = 0;
					if (!edsheeran.fullDeath) {
						edsheeran.fullDeath = true;
						gamestate.level.OnEnemyDeath();
					}
				} else {
					if (edsheeran.currentmushroom != null && ents.froggi.currentmushroom != null) {
						if (edsheeran.currentmushroom.edgemushroom == 1) {
							if (edsheeran.currentmushroom == ents.froggi.currentmushroom) {
								edsheeran.direction = -1;
							} else {
								edsheeran.direction = 0;
							}
						} else if (edsheeran.currentmushroom.edgemushroom == -1) {
							if (edsheeran.currentmushroom == ents.froggi.currentmushroom) {
								edsheeran.direction = 1;
							} else {
								edsheeran.direction = 0;
							}
						} else if (edsheeran.x > ents.froggi.x) {
							edsheeran.direction = 1;
						} else if (edsheeran.x < ents.froggi.x) {
							edsheeran.direction = -1;
						}
					}
					if (virginityelapsed > gamesettings.virginityrayinterval) {
						edsheeran.direction = 0;
						if (ents.edsheeran.x > ents.froggi.x) {
							edsheeran.facing = -1;
						} else {
							edsheeran.facing = 1;
						}
						if (!edsheeran.virginityraygenerated) {
							let virginityray = ents.virginityrays.new();
							gamestate.level.ents.push(virginityray);
							edsheeran.virginityraygenerated = true;
							console.log('ray');
						}
						if (virginityelapsed > gamesettings.virginityrayinterval + gamesettings.virginityrayrest) {
							edsheeran.virginityraygenerated = false;
							edsheeran.lastvirginityray = time;
						}
					}
				}
      } else if (virginityelapsed > gamesettings.virginityrayinterval) {
				edsheeran.lastvirginityray = time - gamesettings.virginityrayinterval;
			}
    } else {
			edsheeran.direction = 0;
		}
    if (edsheeran.currentmushroom != null) {
      if (edsheeran.direction == -1 && edsheeran.x <= edsheeran.currentmushroom.platformleft + (gamesettings.jumppoint * gamesettings.basescalefactor)) {
        if (edsheeran.currentmushroom.edgemushroom == -1) {
          edsheeran.direction = 0;
        } else {
          edsheeran.jumprequest = true;
        }
      }
      if (edsheeran.direction == 1 && edsheeran.x >= edsheeran.currentmushroom.platformright - (gamesettings.jumppoint * gamesettings.basescalefactor)) {
        if (edsheeran.currentmushroom.edgemushroom == 1) {
          edsheeran.direction = 0;
        } else {
          edsheeran.jumprequest = true;
        }
      }
    }

    if (edsheeran.direction != 0 && !edsheeran.inair) {
			let walkelapsed = time - edsheeran.lastwalk;
			if (walkelapsed > gamesettings.walkcycleinterval) {
				edsheeran.walkcycle++;
				if (edsheeran.walkcycle > 3) {
					edsheeran.walkcycle = 0;
				}
				edsheeran.lastwalk = time;
			}
		} else {
			edsheeran.walkcycle = 0;
		}

    let usedTex;

    if (edsheeran.direction != 0) {
      edsheeran.facing = edsheeran.direction;
    }
    if (edsheeran.facing < 0) {
      if (edsheeran.walkcycle == 0) {
        usedTex = textures.edsheeranstillleft;
      } else if (edsheeran.walkcycle == 1 || edsheeran.walkcycle == 3) {
				usedTex = textures.edsheeranwalk1left;
			} else if (edsheeran.walkcycle == 2) {
				usedTex = textures.edsheeranwalk2left;
			}
    } else if (edsheeran.facing > 0) {
      if (edsheeran.walkcycle == 0) {
        usedTex = textures.edsheeranstillright;
      } else if (edsheeran.walkcycle == 1 || edsheeran.walkcycle == 3) {
				usedTex = textures.edsheeranwalk1right;
			} else if (edsheeran.walkcycle == 2) {
				usedTex = textures.edsheeranwalk2right;
			}
    }
		if (edsheeran.deadInternal && edsheeran.direction == 0) {
			usedTex = textures.edsheerandead;
		}

		var offscreen = {};
    var rect = camera.PlaceTexture(usedTex, edsheeran.x, edsheeran.y, 0, 1, offscreen);

		if (!doOffscreen(edsheeran, offscreen, ctx) && rect != null) {
			ctx.drawImage(usedTex, rect.x, rect.y, rect.width, rect.height);
		}


  };
  edsheeran.TakeDamage = function(damage) {
		edsheeran.Health -= damage / 2;
		if (edsheeran.Health <= 0.01) {
			edsheeran.deadInternal = true;
			//edsheeran.AIEnabled = false;
			edsheeran.Health = 1;
		}
	}
	edsheeran.Height = function() {
		return 23 * gamesettings.basescalefactor;
	}

	ents.virginityrays = {};
	let virginityrays = ents.virginityrays;
	virginityrays.new = function() {
		let virginityray = {};
		virginityray.startx = ents.edsheeran.x + (gamesettings.virginityrayspawnxoffset * edsheeran.facing * gamesettings.basescalefactor);
		virginityray.starty = ents.edsheeran.y + (gamesettings.virginityrayspawnyoffset * gamesettings.basescalefactor);
		virginityray.targetx = ents.froggi.x;
		virginityray.targety = ents.froggi.y;
		virginityray.starttime = 0;
		virginityray.ray = true;

		virginityray.Do = function(ctx, time) {
			if (virginityray.starttime == 0) {
				virginityray.starttime = time;
			}
			let elapsed = time - virginityray.starttime;
			let xdiff = virginityray.targetx - virginityray.startx;
			let ydiff = virginityray.targety - virginityray.starty;
			let angle = Math.atan2(ydiff, xdiff);
			let distance = utils.distance(virginityray.startx, virginityray.starty, virginityray.targetx, virginityray.targety);
			let totaltime = (distance / gamesettings.virginityrayspeed) * 1000;
			let travelled = (elapsed / totaltime) * distance;
			let currentlocation = utils.pixelstoward(virginityray.startx, virginityray.starty, virginityray.targetx, virginityray.targety, travelled);

			let lifeleft = 1 - (travelled / gamesettings.virginityraylifespan);
			if (lifeleft <= 0) {
				virginityray.Destroy = true;
			} else if (ents.froggi.TestHitbox(currentlocation.x, currentlocation.y)) {
				virginityray.Destroy = true;
				ents.froggi.TakeDamage(lifeleft * gamesettings.virginityraymaxdamage);
			}
			if (lifeleft < 0) {
				lifeleft = 0;
			}

			var rect = camera.PlaceTexture(textures.virginityray, currentlocation.x, currentlocation.y, 0, 0);

			if (rect != null) {
				let x = rect.x + rect.width / 2;
				let y = rect.y + rect.height / 2;
				ctx.globalAlpha = lifeleft;
				ctx.translate(x, y);
				ctx.rotate(-angle);
				ctx.translate(-x, -y);
				ctx.drawImage(textures.virginityray, rect.x, rect.y, rect.width, rect.height);
				ctx.setTransform(1, 0, 0, 1, 0, 0);
				ctx.globalAlpha = 1;
			}
		}

		return virginityray;
	};

	ents.hearts = {};
	let hearts = ents.hearts;
	hearts.new = function() {
		let heart = {};
		heart.starttime = 0;
		heart.x = ents.froggi.x + ((Math.random() - 0.5) * ents.froggi.width);
		heart.y = ents.froggi.y + ents.froggi.Height();
		heart.velx = Math.random() * gamesettings.heartmaxstartvelocity;
		heart.lasttime = 0;
		if (heart.x < ents.froggi.x) {
			heart.velx = 0 - heart.velx;
		}
		heart.startthreshold = heart.y + gamesettings.heartstartthresholdoffset;
		heart.starty = heart.y;

		heart.Do = function(ctx, time) {
			if (heart.lasttime == 0) {
				heart.lasttime = time;
			}
			let elapsed = time - heart.lasttime;
			var elapsedseconds = elapsed / 1000;
			heart.y += gamesettings.heartrisespeed * elapsedseconds;
			heart.x += heart.velx * elapsedseconds;
			if (heart.velx < 0) {
				heart.velx += gamesettings.heartvelocitydecay * elapsedseconds;
			}
			if (heart.velx > 0) {
				heart.velx -= gamesettings.heartvelocitydecay * elapsedseconds;
			}
			if (heart.velx < 1 && heart.velx > -1) {
				heart.velx = 0;
			}
			let opacity = 1;
			if (heart.y < heart.startthreshold) {
				let journey = heart.startthreshold - heart.starty;
				let current = heart.y - heart.starty;
				opacity = current / journey;
			}
			if (heart.y > gamesettings.heartendthreshold) {
				heart.Destroy = true;
			}

			var rect = camera.PlaceTexture(textures.heart, heart.x, heart.y, 0, 0);

			if (rect != null) {
				let x = rect.x + rect.width / 2;
				let y = rect.y + rect.height / 2;
				ctx.globalAlpha = opacity;
				ctx.translate(x, y);
				ctx.rotate(Math.atan2(-gamesettings.heartrisespeed, heart.velx) + 1.57079633);
				ctx.translate(-x, -y);
				ctx.drawImage(textures.heart, rect.x, rect.y, rect.width, rect.height);
				ctx.setTransform(1, 0, 0, 1, 0, 0);
				ctx.globalAlpha = 1;
			}

			heart.lasttime = time;
		}

		return heart;
	}

	ents.ghost = {};
	let ghost = ents.ghost;
	ghost.ReceiveKeyUpdates = false;
	ghost.Dead = false;
	ghost.x = 0;
	ghost.y = 0;
	ghost.destx = 0;
	ghost.desty = 0;
	ghost.lastswitch = null;
	ghost.current = 0;
	ghost.cycle = null;
	ghost.currently = "vibing";
	ghost.nextdecision = 0;
	ghost.lasttime = 0;
	ghost.Do = function(ctx, time) {
		if (ghost.nextdecision == 0) {
			ghost.nextdecision = time + utils.randInt(gamesettings.ghostmindecisioninterval, gamesettings.ghostmaxdecisioninterval);
		}
		if (ghost.lasttime == 0) {
			ghost.lasttime = time;
		}
		if (ghost.cycle == null) {
			ghost.cycle = [textures.ghost1still, textures.ghost2still, textures.ghost3still, textures.ghost4still];
		}
		if (ghost.lastswitch == null) {
			ghost.lastswitch = time;
		}
		let elapsed = time - ghost.lastswitch;
		if (elapsed > gamesettings.walkcycleinterval) {
			ghost.current++;
			if (ghost.current > 3) {
				ghost.current = 0;
			}
			ghost.lastswitch = time;
			//console.log("switch");
		}

		let elapsedseconds = (time - ghost.lasttime) / 1000;
		let followbox = {x: ents.froggi.x - gamesettings.ghostfollowdistance / 2, y: ents.froggi.y - gamesettings.ghostfollowdistance / 2, width: gamesettings.ghostfollowdistance, height: gamesettings.ghostfollowdistance};
		if (ghost.x < followbox.x || ghost.y < followbox.y || ghost.x > followbox.x + followbox.width || ghost.y > followbox.y + followbox.height) {
			ghost.currently = "following";
		} else if (ghost.currently == "following") {
			ghost.currently = "vibing";
		}
		if (ghost.currently == "following") {
			let newposition = utils.pixelstoward(ghost.x, ghost.y, ents.froggi.x, ents.froggi.y, gamesettings.ghostmovespeed * elapsedseconds);
			ghost.x = newposition.x;
			ghost.y = newposition.y;
		} else {
			if (time >= ghost.nextdecision) {
				ghost.nextdecision = time + utils.randInt(gamesettings.ghostmindecisioninterval, gamesettings.ghostmaxdecisioninterval);
				ghost.currently = "exploring";
				ghost.destx = utils.randInt(followbox.x, followbox.x + followbox.width);
				ghost.desty = utils.randInt(followbox.y, followbox.y + followbox.height);
			}
			if (ghost.currently == "exploring") {
				let newposition = utils.pixelstoward(ghost.x, ghost.y, ghost.destx, ghost.desty, gamesettings.ghostmovespeed * elapsedseconds);
				ghost.x = newposition.x;
				ghost.y = newposition.y;
				let distance = utils.distance(ghost.x, ghost.y, ghost.destx, ghost.desty);
				if (distance < 5) {
					ghost.currently = "vibing";
				}
			}
		}
		ghost.lasttime = time;

		let usedTexture;
		usedTexture = ghost.cycle[ghost.current];
		let texRect = camera.PlaceTexture(usedTexture, ghost.x, ghost.y + (Math.sin(time * gamesettings.ghosthoverspeed) + 1) * gamesettings.ghosthoverheight / 2, 0, 1);
		if (texRect != null) {
			ctx.drawImage(usedTexture, texRect.x, texRect.y, texRect.width, texRect.height);
		}
	};

	ents.portal = {};
	let portal = ents.portal;
	portal.ReceiveKeyUpdates = false;
	portal.Dead = false;
	portal.x = 0;
	portal.y = 0;
	portal.lastcycle = 0;
	portal.current = 0;
	portal.Do = function(ctx, time) {
		if (portal.lastcycle == 0) {
			portal.lastcycle = time;
			portal.cycle = [textures.portal1anim, textures.portal2anim, textures.portal3anim];
		}
		if (time - portal.lastcycle > gamesettings.portalanimationinterval) {
			portal.lastcycle = time;
			portal.current++;
			if (portal.current > 2) {
				portal.current = 0;
			}
		}

		let texRect = camera.PlaceTexture(portal.cycle[portal.current], portal.x, portal.y + (Math.sin(time * gamesettings.portalhoverspeed) + 1) * gamesettings.portalhoverheight / 2, 0, 1);
		if (texRect != null) {
			ctx.drawImage(portal.cycle[portal.current], texRect.x, texRect.y, texRect.width, texRect.height);
		}
	}
})();
