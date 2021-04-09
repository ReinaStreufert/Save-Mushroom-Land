(function() {
	window.canvas = document.getElementById('game');
	let ctx = canvas.getContext('2d');
	let mouseX = 0;
	let mouseY = 0;

	window.gamestate = {};
	gamestate.ui = "load";
	//gamestate.levelNum = 1;
	//gamestate.level = levels.levellist[gamestate.levelNum];
	save.Restore();
	gamestate.menuItem = 0;
	if (save.FirstTime) {
		gamestate.menuItems = 2;
	} else {
		gamestate.menuItems = 3;
	}

	textures.LoadAll(() => {
		gamestate.ui = "menu";
	});


	document.body.onresize = function() {
		var canvas = document.getElementById('game');
		canvas.width = document.body.offsetWidth;
		canvas.height = document.body.offsetHeight;
	}
	canvas.width = document.body.offsetWidth;
	canvas.height = document.body.offsetHeight;

	let loop = function(time) {
		ctx.imageSmoothingEnabled = false;
		requestAnimationFrame(loop);

		if (gamestate.ui == "play") {
			//ctx.fillStyle = gamesettings.skycolor;
			//ctx.fillRect(0, 0, canvas.width, canvas.height);
			env.DoBackground(ctx);
			camera.Do(time);
			env.Do(ctx, time);
			for (let i = 0; i < gamestate.level.winds.length; i++) {
				let column = gamestate.level.winds[i];
				column.Do(ctx, time);
			}
			for (let i = 0; i < gamestate.level.mushrooms.length; i++) {
				let mushroom = gamestate.level.mushrooms[i];
				let rect = camera.PlaceTexture(mushroom.texture, mushroom.x, 0, 0, 1);
				ctx.drawImage(mushroom.texture, rect.x, rect.y, rect.width, rect.height);
			}
			let deletes = [];
			for (let i = 0; i < gamestate.level.ents.length; i++) {
				let ent = gamestate.level.ents[i];
				if (!ent.Dead) {
					ent.Do(ctx, time);
				}
				if (ent.Destroy) {
					deletes.push(ent);
				}
			}
			for (let i = 0; i < deletes.length; i++) {
				for (let ii = 0; ii < gamestate.level.ents.length; ii++) {
					if (deletes[i] == gamestate.level.ents[ii]) {
						gamestate.level.ents.splice(ii, 1);
						break;
					}
				}
			}
			env.DoOverlay(ctx);
			ui.Do(ctx, time);
			dialog.Do(ctx, time);
		} else if (gamestate.ui == "load") {
			ctx.fillStyle = "#000000";
			ctx.fillRect(0, 0, canvas.width, canvas.height);
			ctx.font = "16px 'Press Start 2P'";
			ctx.textAlign = "center";
			ctx.fillStyle = "#FFFFFF";
			ctx.fillText("LOADING...", canvas.width / 2, canvas.height / 2);
		} else if (gamestate.ui == "menu") {
			ctx.fillStyle = "#000000";
			ctx.fillRect(0, 0, canvas.width, canvas.height);
			ctx.font = "16px 'Press Start 2P'";
			ctx.textAlign = "center";
			ctx.fillStyle = "#FFFFFF";
			ctx.fillText("SAVE MUSHROOM LAND", canvas.width / 2, canvas.height / 2 - 15);
			ctx.textAlign = "left";
			let playText = "Play";
			if (!save.FirstTime) {
				playText = "Resume";
			}
			if (gamestate.menuItem == 0) {
				ctx.fillText(">" + playText, canvas.width / 2 - 50, canvas.height / 2 + 15);
			} else {
				ctx.fillText(" " + playText, canvas.width / 2 - 50, canvas.height / 2 + 15);
			}
			if (gamestate.menuItem == 1) {
				ctx.fillText(">Extras", canvas.width / 2 - 50, canvas.height / 2 + 45);
			} else {
				ctx.fillText(" Extras", canvas.width / 2 - 50, canvas.height / 2 + 45);
			}
			if (!save.FirstTime) {
				if (gamestate.menuItem == 2) {
					ctx.fillText(">Reset", canvas.width / 2 - 50, canvas.height / 2 + 75);
				} else {
					ctx.fillText(" Reset", canvas.width / 2 - 50, canvas.height / 2 + 75);
				}
			}
			ui.Do(ctx, time);
		}
	}

	canvas.addEventListener('mousemove', function(e) {
		var rect = canvas.getBoundingClientRect();
		mouseX = e.clientX - rect.left;
		mouseY = e.clientY - rect.top;
	});
	canvas.addEventListener('mousedown', function(e) {

	});
	document.addEventListener('keydown', function(e) {
		if (gamestate.ui == "play") {
			for (let i = 0; i < gamestate.level.ents.length; i++) {
				let ent = gamestate.level.ents[i];
				if (ent.ReceiveKeyUpdates) {
					ent.KeyDown(e);
				}
			}
			if (e.code == "Enter") {
				dialog.NextDialog();
			}
		} else if (gamestate.ui == "menu") {
			if (e.code == "ArrowDown") {
				gamestate.menuItem++;
				if (gamestate.menuItem >= gamestate.menuItems) {
					gamestate.menuItem = 0;
				}
			} else if (e.code == "ArrowUp") {
				gamestate.menuItem--;
				if (gamestate.menuItem < 0) {
					gamestate.menuItem = gamestate.menuItems - 1;
				}
			} else if (e.code == "Enter") {
				if (gamestate.menuItem == 0) {
					//levels.NextLevel();
					utils.openFullscreen();
					env.Initialize();
					sounds.LoadAll();
					gamestate.level.Initialize();
					gamestate.ui = "play";
				} else if (gamestate.menuItem == 2) {
					gamestate.levelNum = 0;
					save.SaveProgress();
					save.Restore();
					gamestate.menuItem = 0;
					gamestate.menuItems = 2;
				}
			}
		}
	});
	document.addEventListener('keyup', function(e) {
		if (gamestate.ui == "play") {
			for (let i = 0; i < gamestate.level.ents.length; i++) {
				let ent = gamestate.level.ents[i];
				if (ent.ReceiveKeyUpdates) {
					ent.KeyUp(e);
				}
			}
		}
	});
	document.addEventListener('wheel', function(e) {
		let zoomDelta = (0 - e.deltaY) / 1000;
		camera.targetZoom += zoomDelta;
		if (camera.targetZoom < 1) {
			camera.targetZoom = 1;
		} else if (camera.targetZoom > 5) {
			camera.targetZoom = 5;
		}
	});
	requestAnimationFrame(loop);
})();
