(function() {
	window.env = {};

	env.skytype = "day"; // day, sunset, night, sunrise

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
	let generateStars = function() {
		console.log("hello");
		env.stars = [];
		let numStars = Math.round((gamesettings.nightstarsonstandardres / 2073600) * (canvas.width * canvas.height));
		for (let i = 0; i < numStars; i++) {
			let star = {};
			star.x = Math.random();
			star.y = Math.random();
			env.stars.push(star);
		}
	}

	env.lasttime = null;
	env.Initialize = function() {
		cloudTextures = [textures.cloud1, textures.cloud2];

		env.clouds = [];
		var numClouds = utils.randInt(gamesettings.minclouds, gamesettings.maxclouds);
		for (let i = 0; i < numClouds; i++) {
			generateCloud(true);
		}
		generateStars();
		window.addEventListener("resize", generateStars);
	}
	env.DoBackground = function(ctx) {
		if (env.skytype == "day") {
			ctx.fillStyle = gamesettings.skycolorday;
		} else if (env.skytype == "sunset") {
			let gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
			gradient.addColorStop(0, gamesettings.skycolorsunset[0]);
			gradient.addColorStop(1, gamesettings.skycolorsunset[1]);
			ctx.fillStyle = gradient;
		} else if (env.skytype == "night") {
			ctx.fillStyle = gamesettings.skycolornight;
		}
		ctx.fillRect(0, 0, canvas.width, canvas.height);
	}
	env.Do = function(ctx, time) {
		if (env.lasttime == null) {
			env.lasttime = time;
		}
		let elapsed = time - env.lasttime;
		if (env.skytype == "sunset") {
			let rect = camera.PlaceFixedTexture(textures.sunflipped, 0, 0, -1, -1);
			ctx.drawImage(textures.sunflipped, rect.x, rect.y, rect.width, rect.height);
		} else if (env.skytype == "day") {
			let rect = camera.PlaceFixedTexture(textures.sun, 0, canvas.height, -1, 1);
			ctx.drawImage(textures.sun, rect.x, rect.y, rect.width, rect.height);
		} else if (env.skytype == "night") {
			let rect = camera.PlaceFixedTexture(textures.moon, canvas.width - 150, canvas.height - 150, 0, 0);
			ctx.drawImage(textures.moon, rect.x, rect.y, rect.width, rect.height);
		}

		if (env.skytype != "night") {
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
		} else {
			for (let i = 0; i < env.stars.length; i++) {
				let star = env.stars[i];
				let starx = canvas.width * star.x;
				let stary = canvas.height * star.y;
				let starrect = {width: 1, height: 1};
				let rect = camera.PlaceFixedTexture(starrect, starx, stary, 0, 0);
				ctx.fillStyle = "#FFFFFF";
				ctx.fillRect(rect.x, rect.y, rect.width, rect.height);
			}
		}
		env.lasttime = time;
	}
	env.DoOverlay = function(ctx) {
		if (env.skytype == "sunset") {
			let gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
			gradient.addColorStop(0, gamesettings.skycolorsunset[0]);
			gradient.addColorStop(1, gamesettings.skycolorsunset[1]);
			ctx.fillStyle = gradient;
			ctx.globalAlpha = 0.7;
			ctx.globalCompositeOperation = "multiply";
			ctx.fillRect(0, 0, canvas.width, canvas.height);
			ctx.globalAlpha = 1;
			ctx.globalCompositeOperation = "source-over";
			ctx.fillStyle = "#00000022";
			//ctx.fillRect(0, 0, canvas.width, canvas.height);
		} else if (env.skytype == "night") {
			ctx.fillStyle = gamesettings.skycolornight;
			ctx.globalAlpha = 0.35;
			ctx.globalCompositeOperation = "multiply";
			ctx.fillRect(0, 0, canvas.width, canvas.height);
			ctx.globalAlpha = 1;
			ctx.globalCompositeOperation = "source-over";
			ctx.fillStyle = "#00000022";
		}
	}
})();
