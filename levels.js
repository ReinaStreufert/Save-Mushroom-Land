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
	mushroom1.platformleft = mushroom1.x - 55 * gamesettings.basescalefactor;
	mushroom1.platformright = mushroom1.x + 55 * gamesettings.basescalefactor;

	var mushroom2 = {};
	mushroom2.texture = textures.mushroom2;
	mushroom2.x = 90 * gamesettings.basescalefactor;
	mushroom2.platformy = 81 * gamesettings.basescalefactor;
	mushroom2.platformleft = mushroom2.x - (45 * gamesettings.basescalefactor);
	mushroom2.platformright = mushroom2.x + (45 * gamesettings.basescalefactor);

	var mushroom3 = {};
	mushroom3.texture = textures.mushroom3;
	mushroom3.x = 160 * gamesettings.basescalefactor;
	mushroom3.platformy = 56 * gamesettings.basescalefactor;
	mushroom3.platformleft = mushroom3.x - (40 * gamesettings.basescalefactor);
	mushroom3.platformright = mushroom3.x + (40 * gamesettings.basescalefactor);

	var mushroom4 = {};
	mushroom4.texture = textures.mushroom4;
	mushroom4.x = 280 * gamesettings.basescalefactor;
	mushroom4.platformy = 102 * gamesettings.basescalefactor;
	mushroom4.platformleft = mushroom4.x - (60 * gamesettings.basescalefactor);
	mushroom4.platformright = mushroom4.x + (60 * gamesettings.basescalefactor);


	var wind1 = wind.new(210 * gamesettings.basescalefactor);

	testlvl.ents = [ents.froggi];
	testlvl.mushrooms = [mushroom1, mushroom2, mushroom3, mushroom4];
	testlvl.winds = [wind1];

	camera.SetFocus(ents.froggi, 1);
	//camera.actualX = ents.froggi.x;
	//camera.actualY = ents.froggi.y;
}

levels.levellist = [
	levels.testlvl
];
