window.levels = {};

levels.testlvl = {};
let testlvl = levels.testlvl;
testlvl.Initialize = function() {
	ents.froggi.x = 0;
	ents.froggi.y = 91 * gamesettings.basescalefactor;

	var mushroom1 = {};
	mushroom1.texture = textures.mushroom1;
	mushroom1.x = 0;
	mushroom1.platformy = 91 * gamesettings.basescalefactor;
	mushroom1.platformleft = -55 * gamesettings.basescalefactor;
	mushroom1.platformright = 55 * gamesettings.basescalefactor;

	testlvl.ents = [ents.froggi];
	testlvl.mushrooms = [mushroom1];

	camera.SetFocus(ents.froggi, 1);
	//camera.actualX = ents.froggi.x;
	//camera.actualY = ents.froggi.y;
}

levels.levellist = [
	levels.testlvl
];
