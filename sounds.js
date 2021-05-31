(function() {
	let soundList = [
	  {
	    name: "catskevin",
	    src: "sounds/music/you_cant_eat_cats_kevin.mp3",
			volume: 0.75
	  },
	  {
	    name: "linehook",
	    src: "sounds/music/line_without_a_hook.mp3",
			volume: 0.75
	  },
	  {
	    name: "fingers",
	    src: "sounds/music/fingers.mp3",
			volume: 0.75
	  },
		{
			name: "benshapiro1",
			src: "sounds/gameplaysounds/ben_shapiro_1.mp3",
			volume: 1
		},
		{
			name: "benshapiro2",
			src: "sounds/gameplaysounds/ben_shapiro_2.mp3",
			volume: 1
		},
		{
			name: "benshapiro3",
			src: "sounds/gameplaysounds/ben_shapiro_3.mp3",
			volume: 1
		},
		{
			name: "benshapiro4",
			src: "sounds/gameplaysounds/ben_shapiro_4.mp3",
			volume: 1
		},
		{
			name: "benshapiro5",
			src: "sounds/gameplaysounds/ben_shapiro_5.mp3",
			volume: 1
		},
		{
			name: "benshapiro6",
			src: "sounds/gameplaysounds/ben_shapiro_6.mp3",
			volume: 1
		}
	];

	window.sounds = {};
	sounds.TotalSounds = soundList.length;
	sounds.LoadedSounds = 0;
	sounds.LoadAll = function() {
	  for (let i = 0; i < soundList.length; i++) {
	    let soundentry = soundList[i];
	    sounds[soundentry.name] = new Audio();
	    sounds[soundentry.name].src = soundentry.src;
			sounds[soundentry.name].volume = soundentry.volume;
			sounds.LoadedSounds++;
	  }
		sounds.benshapirosounds = [sounds.benshapiro1, sounds.benshapiro2, sounds.benshapiro3, sounds.benshapiro4, sounds.benshapiro5, sounds.benshapiro6];
	}
	sounds.StopAll = function() {
		for (let i = 0; i < soundList.length; i++) {
	    let soundentry = soundList[i];
	    sounds[soundentry.name].pause();
	  }
	}
	sounds.PlaySound = function(sound) {
		sound.pause();
		sound.currentTime = 0;
		sound.play();
	}
	sounds.PlayBenShapiroSound = function() {
		if (!window.school) {
			sounds.PlaySound(sounds.benshapirosounds[utils.randInt(0, sounds.benshapirosounds.length)]);
		}
	}
})();
