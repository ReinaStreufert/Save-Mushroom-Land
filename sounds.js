(function() {
	let soundList = [
	  {
	    name: "catskevin",
	    src: "/sounds/music/you_cant_eat_cats_kevin.mp3"
	  },
	  {
	    name: "linehook",
	    src: "/sounds/music/line_without_a_hook.mp3"
	  },
	  {
	    name: "fingers",
	    src: "/sounds/music/fingers.mp3"
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
			sounds.LoadedSounds++;
	  }
	}
	window.music = {};
	music.currentsongNum = -1;
	music.currentsong = null;
	music.Initialize = function() {
		music.Playlist = [
			sounds.catskevin,
			sounds.linehook,
			sounds.fingers
		];
	}
	music.NextSong = function() {
		music.currentsongNum++;
		if (music.currentsongNum < music.Playlist.length) {
			music.currentsong = music.Playlist[music.currentsongNum];
			music.currentsong.play();
		}
	}
	music.Stop = function() {
		music.currentsong.pause();
	}
})();
