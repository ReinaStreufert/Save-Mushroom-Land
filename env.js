window.env = {};

let cloudTextures = []

env.Initialize = function() {
	cloudTextures = [textures.cloud1, textures.cloud2];

	env.clouds = [];
	var numClouds = utils.randInt(gamesettings.minclouds, gamesettings.maxclouds);
	for (let i = 0; i < numClouds; i++) {
		let cloud = {};
		cloud.texture = cloudTextures[utils.randInt(0, cloudTextures.length - 1)];
		cloud.x = utils.randInt(0, canvas.width);
		cloud.y = utils.randInt(gamesettings.cloudtop, gamesettings.cloudbottom);
		env.clouds.push(cloud);
	}
}
env.Do = function(ctx, time) {
	let rect = camera.PlaceFixedTexture(textures.sun, 0, canvas.height, -1, 1);
	ctx.drawImage(textures.sun, rect.x, rect.y, rect.width, rect.height);
}
