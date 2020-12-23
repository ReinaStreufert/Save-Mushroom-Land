window.canvas = document.getElementById('game');
let ctx = canvas.getContext('2d');
let mouseX = 0;
let mouseY = 0;

window.gamestate = {};
gamestate.ui = "load";
gamestate.levelNum = 0;
gamestate.level = levels.levellist[gamestate.levelNum];

textures.LoadAll(() => {
	gamestate.level.Initialize();
	gamestate.ui = "play";
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
	ctx.fillStyle = gamesettings.skycolor;
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	if (gamestate.ui == "play") {
		//console.log("ayo");
		camera.Do(time);
		for (let i = 0; i < gamestate.level.mushrooms.length; i++) {
			//console.log("ayo");
			let mushroom = gamestate.level.mushrooms[i];
			let rect = camera.PlaceTexture(mushroom.texture, mushroom.x, 0, 0, 1);
			ctx.drawImage(mushroom.texture, rect.x, rect.y, rect.width, rect.height);
		}
		for (let i = 0; i < gamestate.level.ents.length; i++) {
			let ent = gamestate.level.ents[i];
			ent.Do(ctx, time);
		}
	}
}

canvas.addEventListener('mousemove', function(e) {
	var rect = canvas.getBoundingClientRect();
	mouseX = e.clientX - rect.left;
	mouseY = e.clientY - rect.top;
});
document.addEventListener('keydown', function(e) {
	if (gamestate.ui == "play") {
		for (let i = 0; i < gamestate.level.ents.length; i++) {
			let ent = gamestate.level.ents[i];
			if (ent.ReceiveKeyUpdates) {
				ent.KeyDown(e);
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
requestAnimationFrame(loop);
