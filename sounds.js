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
music.Begin = function() {
	music.Playlist = [
		sounds.catskevin,
		sounds.linehook,
		sounds.fingers
	];
	music.CurrentSong = 0;
	for (let i = 0; i < music.Playlist.length; i++) {
		let song = music.Playlist[i];
		song.onended = function() {
			music.CurrentSong++;
			if (music.CurrentSong < music.Playlist.length) {
				music.Playlist[music.CurrentSong].play();
			}
		}
	}
	music.Playlist[0].play();
}
