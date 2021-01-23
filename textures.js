(function() {
	let textureList = [
	  {
	    name: "froggistill",
	    src: "froggi/froggi_still.png"
	  },
	  {
	    name: "froggijump",
	    src: "froggi/froggi_jump.png"
	  },
	  {
	    name: "froggitongueleft",
	    src: "froggi/froggi_tongue_left.png"
	  },
	  {
	    name: "froggitongueright",
	    src: "froggi/froggi_tongue_right.png"
	  },
	  {
	    name: "froggijumptongueleft",
	    src: "froggi/froggi_jump_tongue_left.png"
	  },
	  {
	    name: "froggijumptongueright",
	    src: "froggi/froggi_jump_tongue_right.png"
	  },
	  {
	    name: "mushroom1",
	    src: "mushrooms/mushroom_1.png"
	  },
	  {
	    name: "mushroom2",
	    src: "mushrooms/mushroom_2.png"
	  },
	  {
	    name: "mushroom3",
	    src: "mushrooms/mushroom_3.png"
	  },
	  {
	    name: "mushroom4",
	    src: "mushrooms/mushroom_4.png"
	  },
		{
			name: "mushroom5stump",
			src: "mushrooms/mushroom_5_stump.png"
		},
		{
			name: "mushroom5top",
			src: "mushrooms/mushroom_5_top.png"
		},
		{
			name: "mushroom5",
			src: "mushrooms/mushroom_5.png"
		},
	  {
	    name: "cloud1",
	    src: "env/cloud_1.png"
	  },
	  {
	    name: "cloud2",
	    src: "env/cloud_2.png"
	  },
	  {
	    name: "sun",
	    src: "env/sun.png"
	  },
		{
			name: "sunflipped",
			src: "env/sun_flipped.png"
		},
		{
			name: "offscreen",
			src: "misc/offscreen.png"
		},
		{
			name: "engineer1",
			src: "miscents/engineer_1.png"
		},
		{
			name: "engineer2",
			src: "miscents/engineer_2.png"
		},
		{
			name: "countdown3",
			src: "misc/countdown_3.png"
		},
		{
			name: "countdown2",
			src: "misc/countdown_2.png"
		},
		{
			name: "countdown1",
			src: "misc/countdown_1.png"
		},
		{
			name: "benshapirostillright",
			src: "enemies/benshapiro/ben_shapiro_still.png"
		},
		{
			name: "benshapiropunchright",
			src: "enemies/benshapiro/ben_shapiro_punch.png"
		},
		{
			name: "benshapirowalk1right",
			src: "enemies/benshapiro/ben_shapiro_walk_1.png"
		},
		{
			name: "benshapirowalk2right",
			src: "enemies/benshapiro/ben_shapiro_walk_2.png"
		},
		{
			name: "benshapirostillleft",
			src: "enemies/benshapiro/ben_shapiro_still_left.png"
		},
		{
			name: "benshapiropunchleft",
			src: "enemies/benshapiro/ben_shapiro_punch_left.png"
		},
		{
			name: "benshapirowalk1left",
			src: "enemies/benshapiro/ben_shapiro_walk_1_left.png"
		},
		{
			name: "benshapirowalk2left",
			src: "enemies/benshapiro/ben_shapiro_walk_2_left.png"
		},
		{
			name: "benshapirodead",
			src: "enemies/benshapiro/ben_shapiro_dead.png"
		},
		{
			name: "edsheeranstillright",
			src: "enemies/edsheeran/ed_sheeran_still.png"
		},
		{
			name: "edsheeranstillleft",
			src: "enemies/edsheeran/ed_sheeran_still_left.png"
		},
		{
			name: "edsheeranwalk1right",
			src: "enemies/edsheeran/ed_sheeran_walk_1.png"
		},
    {
			name: "edsheeranwalk2right",
			src: "enemies/edsheeran/ed_sheeran_walk_2.png"
		},
		{
			name: "edsheeranwalk1left",
			src: "enemies/edsheeran/ed_sheeran_walk_1_left.png"
		},
		{
			name: "edsheeranwalk2left",
			src: "enemies/edsheeran/ed_sheeran_walk_2_left.png"
		},
		{
			name: "moon",
			src: "env/moon.png"
		}
	];

	window.textures = {};
	textures.TotalTextures = textureList.length;
	textures.LoadedTextures = 0;
	textures.LoadAll = function(oncomplete) {
	  for (let i = 0; i < textureList.length; i++) {
	    let texentry = textureList[i];
	    textures[texentry.name] = new Image();
	    textures[texentry.name].onload = function() {
	      textures.LoadedTextures++;
	      if (textures.LoadedTextures == textures.TotalTextures) {
	        oncomplete();
	      }
	    }
	    textures[texentry.name].src = texentry.src;
	  }
	}
})();
