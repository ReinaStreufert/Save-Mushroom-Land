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

	ent.y += ent.yvel * elapsedseconds;
	ent.x += ent.movespeed * ent.direction * elapsedseconds;
	ent.lasttime = time;
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
froggi.Do = function(ctx, time) {
	doPhysics(froggi, time);
	if (!froggi.inair && !froggi.jumping && froggi.direction != 0) {
		froggi.jumprequest = true;
	}
	var usedTex;
	if (froggi.jumping) {
		usedTex = textures.froggijump;
	} else {
		usedTex = textures.froggistill;
	}
	var rect = camera.PlaceTexture(usedTex, froggi.x, froggi.y, 0, 1);
	ctx.drawImage(usedTex, rect.x, rect.y, rect.width, rect.height);

	if (froggi.y < gamesettings.froggideaththreshold) {
		gamestate.level.Initialize();
	}
}
froggi.KeyDown = function(key) {
	if (key.code == "Space") {
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
	}
}
froggi.KeyUp = function(key) {
	if (key.code == "KeyD" && froggi.direction == 1) {
		froggi.direction = 0;
	}
	if (key.code == "KeyA" && froggi.direction == -1) {
		froggi.direction = 0;
	}
}
