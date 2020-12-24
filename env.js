window.env = {};

let cloudTextures = []

let generateCloud = function(initial) {
	let cloud = {};
	cloud.texture = cloudTextures[utils.randInt(0, cloudTextures.length)];
	if (initial) {
		cloud.x = utils.randInt(0, canvas.width);
	} else {
		cloud.x = -(cloud.texture.width * gamesettings.basescalefactor);
	}
	cloud.y = utils.randInt(gamesettings.cloudtop, gamesettings.cloudbottom);
	cloud.speed = utils.randInt(gamesettings.cloudminmovespeed, gamesettings.cloudmaxmovespeed);
	cloud.active = true;
	env.clouds.push(cloud);
}

env.lasttime = null;
env.Initialize = function() {
	cloudTextures = [textures.cloud1, textures.cloud2];

	env.clouds = [];
	var numClouds = utils.randInt(gamesettings.minclouds, gamesettings.maxclouds);
	for (let i = 0; i < numClouds; i++) {
		generateCloud(true);
	}
}
env.Do = function(ctx, time) {
	if (env.lasttime == null) {
		env.lasttime = time;
	}
	let elapsed = time - env.lasttime;
	let rect = camera.PlaceFixedTexture(textures.sun, 0, canvas.height, -1, 1);
	ctx.drawImage(textures.sun, rect.x, rect.y, rect.width, rect.height);

	for (let i = 0; i < env.clouds.length; i++) {
		let cloud = env.clouds[i];
		let cloudRect = camera.PlaceFixedTexture(cloud.texture, cloud.x, canvas.height - cloud.y, -1, 1);
		ctx.drawImage(cloud.texture, cloudRect.x, cloudRect.y, cloudRect.width, cloudRect.height);

		cloud.x += cloud.speed * (elapsed / 1000);

		if (cloud.x + (cloud.texture.width * gamesettings.basescalefactor) >= canvas.width && cloud.active) {
			generateCloud(false);
			cloud.active = false;
		}
		if (cloud.x >= canvas.width) {
			env.clouds.splice(i, 1);
			i--;
		}
	}
	env.lasttime = time;
}
