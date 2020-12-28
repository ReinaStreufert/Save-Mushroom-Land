(function() {
	window.levels = {};

	levels.intro = {};
	let intro = levels.intro;
	intro.Initialize = function() {
		intro.firstdeath = true;
		env.skytype = "day";

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
		mushroom3.trigger = false;
		mushroom3.OnTrigger = function() {
			ents.froggi.ReceiveKeyUpdates = false;
			ents.froggi.direction = 0;
			dialog.QueueDialog("ok so that mf to the right of you is like wind nd it'll propel you upwards :)");
			dialog.OnQueueDepleted = function() {
				ents.froggi.ReceiveKeyUpdates = true;
			}
		}

		var mushroom4 = {};
		mushroom4.texture = textures.mushroom4;
		mushroom4.x = 280 * gamesettings.basescalefactor;
		mushroom4.platformy = 102 * gamesettings.basescalefactor;
		mushroom4.platformleft = mushroom4.x - (60 * gamesettings.basescalefactor);
		mushroom4.platformright = mushroom4.x + (60 * gamesettings.basescalefactor);

		var mushroom5 = {};
		mushroom5.texture = textures.mushroom1;
		mushroom5.x = 380 * gamesettings.basescalefactor;
		mushroom5.platformy = 91 * gamesettings.basescalefactor;
		mushroom5.platformleft = mushroom5.x - (55 * gamesettings.basescalefactor);
		mushroom5.platformright = mushroom5.x + (55 * gamesettings.basescalefactor);
		mushroom5.trigger = false;
		mushroom5.OnTrigger = function() {
			ents.froggi.ReceiveKeyUpdates = false;
			ents.froggi.direction = 0;
			ui.StartCutScene();
			camera.SetSlowPan(550 * gamesettings.basescalefactor, camera.YZero(), 1, function() {
				ents.fallingmushroom.StartAnimation();
				camera.SetSlowPan(600 * gamesettings.basescalefactor, camera.YZero(), 1, function() {
					ui.EndCutScene();
					window.setTimeout(function() {
						dialog.QueueDialog("uh-oh, looks like the LEAGUE OF MUSHROOM HATERS are getting more mushrooms cut down");
						dialog.QueueDialog("they're literally destroying your home. smh my head [insert partially-ironic eye roll emoji]");
						dialog.QueueDialog("yk what, you're fed up w this bullshit, you should just kill them bitches");
						dialog.QueueDialog("it's time to fight the mushroom haters.");
					}, gamesettings.cutscenemarkanimationlength);
					dialog.OnQueueDepleted = function() {
						window.setTimeout(function() {
							levels.NextLevel();
						}, 500)
					}
				})
			});
		}

		ents.fallingmushroom.Reset();
		ents.fallingmushroom.x = 600 * gamesettings.basescalefactor;
		ents.fallingmushroom.y = 0;

		ents.engineer.x = 612 * gamesettings.basescalefactor;
		ents.engineer.y = 0;

		var wind1 = wind.new(210 * gamesettings.basescalefactor);

		intro.ents = [ents.froggi, ents.fallingmushroom, ents.engineer];
		intro.mushrooms = [mushroom1, mushroom2, mushroom3, mushroom4, mushroom5];
		intro.winds = [wind1];

		camera.SetFocus(ents.froggi, 1);
		ents.froggi.ReceiveKeyUpdates = false;
		ents.froggi.direction = 0;
		window.setTimeout(function() {
			dialog.QueueDialog("omg hi you look so pretty !! [insert bottom emoji]");
			dialog.QueueDialog("ok so this is mushroom land and you're a froggi :))");
			dialog.QueueDialog("in a sec you'll be able to use SPACE or W to jump nd then A and D to jump left and right or move while in the air");
			dialog.QueueDialog("you can use RIGHT ARROW and LEFT ARROW to stick your tongue out which will be used for attacking later");
			dialog.QueueDialog("nd yeah you can hop between mushrooms and stuff so yeah try it ilyyy <3");
			dialog.OnQueueDepleted = function() {
				ents.froggi.ReceiveKeyUpdates = true;
			}
		}, 1000);
		//camera.actualX = ents.froggi.x;
		//camera.actualY = ents.froggi.y;
	}
	intro.Reset = function() {
		ents.froggi.Dead = false;
		ents.froggi.x = 0;
		ents.froggi.y = 91 * gamesettings.basescalefactor;
	}
	intro.OnDeath = function() {
		if (intro.firstdeath) {
			dialog.QueueDialog("oh wack you died :((");
			dialog.QueueDialog("dw tho you'll just respawn nd it's cool :)");
			intro.firstdeath = false;
		} else {
			dialog.QueueDialog("You died...");
		}
		dialog.OnQueueDepleted = function() {
			intro.Reset();
		}
	}

	levels.benshapiro = {};
	let benshapiro = levels.benshapiro;
	benshapiro.Initialize = function() {
		ents.froggi.x = 0;
		ents.froggi.y = 56 * gamesettings.basescalefactor;
		env.skytype = "sunset";

		var mushroom1 = {};
		mushroom1.texture = textures.mushroom3;
		mushroom1.x = 0 * gamesettings.basescalefactor;
		mushroom1.platformy = 56 * gamesettings.basescalefactor;
		mushroom1.platformleft = mushroom1.x - (40 * gamesettings.basescalefactor);
		mushroom1.platformright = mushroom1.x + (40 * gamesettings.basescalefactor);

		var mushroom2 = {};
		mushroom2.texture = textures.mushroom2;
		mushroom2.x = 90 * gamesettings.basescalefactor;
		mushroom2.platformy = 81 * gamesettings.basescalefactor;
		mushroom2.platformleft = mushroom2.x - (45 * gamesettings.basescalefactor);
		mushroom2.platformright = mushroom2.x + (45 * gamesettings.basescalefactor);

		var mushroom3 = {};
		mushroom3.texture = textures.mushroom1;
		mushroom3.x = 190 * gamesettings.basescalefactor;
		mushroom3.platformy = 91 * gamesettings.basescalefactor;
		mushroom3.platformleft = mushroom3.x - 55 * gamesettings.basescalefactor;
		mushroom3.platformright = mushroom3.x + 55 * gamesettings.basescalefactor;

		var mushroom4 = {};
		mushroom4.texture = textures.mushroom2;
		mushroom4.x = 290 * gamesettings.basescalefactor;
		mushroom4.platformy = 81 * gamesettings.basescalefactor;
		mushroom4.platformleft = mushroom4.x - (45 * gamesettings.basescalefactor);
		mushroom4.platformright = mushroom4.x + (45 * gamesettings.basescalefactor);

		var mushroom5 = {};
		mushroom5.texture = textures.mushroom4;
		mushroom5.x = 390 * gamesettings.basescalefactor;
		mushroom5.platformy = 102 * gamesettings.basescalefactor;
		mushroom5.platformleft = mushroom5.x - (60 * gamesettings.basescalefactor);
		mushroom5.platformright = mushroom5.x + (60 * gamesettings.basescalefactor);

		benshapiro.ents = [ents.froggi];
		benshapiro.mushrooms = [mushroom1, mushroom2, mushroom3, mushroom4, mushroom5];
		benshapiro.winds = [];

		camera.SetFocus(ents.froggi, 1);
		ents.froggi.ReceiveKeyUpdates = false;
		ents.froggi.direction = 0;
		window.setTimeout(function() {
			dialog.QueueDialog("this is BEN SHAPIRO, he's the first mushroom hater >:(");
			dialog.QueueDialog("like his political arguments, his attacks are v uncreative");
			dialog.QueueDialog("all he knows how to do is punch. but mmmmm look at those muscles (haha get it im being you)");
			dialog.QueueDialog("BEN SHAPIRO has 3 hearts, use your tongue to attack him and avoid his punches");
			dialog.QueueDialog("you can do this baby ily :) <3");
			dialog.OnQueueDepleted = function() {
				ents.froggi.ReceiveKeyUpdates = true;
				window.setTimeout(function() {
					ui.StartCountdown(function() {

					});
				}, 500);
			}
		}, 1000);
	}
	benshapiro.Reset = function() {
		ents.froggi.Dead = false;
		ents.froggi.x = 0;
		ents.froggi.y = 56 * gamesettings.basescalefactor;
		window.setTimeout(function() {
			ui.StartCountdown(function() {

			});
		}, 500);
	}
	benshapiro.OnDeath = function() {
		dialog.QueueDialog("you lost against ben shapiro lmao");
		dialog.QueueDialog("its cool try again ily");
		dialog.OnQueueDepleted = function() {
			benshapiro.Reset();
		}
	}

	levels.levellist = [
		levels.intro,
		levels.benshapiro
	];
	levels.NextLevel = function() {
		music.Stop();
		ui.FadeOut(function() {
			gamestate.levelNum++;
			gamestate.level = levels.levellist[gamestate.levelNum];
			gamestate.level.Initialize();
			ui.FadeIn(function() {
				music.NextSong();
			});
		});
	}
})();
