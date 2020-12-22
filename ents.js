window.ents = {};

let doBase = function(ent, time) {
	if (ent.lasttime == null) {
		ent.lasttime = time;
	}
	var elapsed = time - lasttime;
	var elapsedseconds = elapsed / 1000;
	var entleft = ent.x - ent.width / 2;
	var entright = ent.x + ent.width / 2;

	var mushrooms = gamestate.level.mushrooms;
	var inair = true;
	for (let i = 0; i < mushrooms.length; i++) {
		let mushroom = mushrooms[i];
		if (mushroom.platformleft <= entleft && mushroom.platformright >= entright && ent.y <= ) {
			
		}
	}
}

ents.froggi = {};
let froggi = ents.froggi;
froggi.ReceiveKeyUpdates = true;
froggi.direction = 0;
froggi.jumping = false;
froggi.inair = false;
froggi.x = 0;
froggi.y = 0;
froggi.width = 20 * gamesettings.basescalefactor;
froggi.yvel = 0;
froggi.movespeed = gamesettings.entdefaultmovespeed;
froggi.lasttime = null;
froggi.Do = function(ctx, time) {
	var usedtex = textures.froggistill;
	var rect = camera.PlaceTexture(textures.froggistill, froggi.x, froggi.y, 0, 1);
	ctx.drawImage(usedtex, rect.x, rect.y, rect.width, rect.height);
}
