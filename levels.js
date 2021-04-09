(function() {
	window.levels = {};

	levels.intro = {};
	let intro = levels.intro;
	intro.Initialize = function() {
		sounds.PlaySound(sounds.catskevin);
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
		sounds.PlaySound(sounds.linehook);

		ents.froggi.x = 0;
		ents.froggi.y = 56 * gamesettings.basescalefactor;
		ents.froggi.Health = 1;
		ents.benshapiro.x = 390 * gamesettings.basescalefactor;
		ents.benshapiro.y = 102 * gamesettings.basescalefactor;
		ents.benshapiro.AIEnabled = false;
		env.skytype = "sunset";

		var mushroom1 = {};
		mushroom1.texture = textures.mushroom3;
		mushroom1.x = 0 * gamesettings.basescalefactor;
		mushroom1.platformy = 56 * gamesettings.basescalefactor;
		mushroom1.platformleft = mushroom1.x - (40 * gamesettings.basescalefactor);
		mushroom1.platformright = mushroom1.x + (40 * gamesettings.basescalefactor);
		mushroom1.edgemushroom = -1;

		var mushroom2 = {};
		mushroom2.texture = textures.mushroom2;
		mushroom2.x = 90 * gamesettings.basescalefactor;
		mushroom2.platformy = 81 * gamesettings.basescalefactor;
		mushroom2.platformleft = mushroom2.x - (45 * gamesettings.basescalefactor);
		mushroom2.platformright = mushroom2.x + (45 * gamesettings.basescalefactor);
		mushroom2.edgemushroom = 0;

		var mushroom3 = {};
		mushroom3.texture = textures.mushroom1;
		mushroom3.x = 190 * gamesettings.basescalefactor;
		mushroom3.platformy = 91 * gamesettings.basescalefactor;
		mushroom3.platformleft = mushroom3.x - 55 * gamesettings.basescalefactor;
		mushroom3.platformright = mushroom3.x + 55 * gamesettings.basescalefactor;
		mushroom3.edgemushroom = 0;

		var mushroom4 = {};
		mushroom4.texture = textures.mushroom2;
		mushroom4.x = 290 * gamesettings.basescalefactor;
		mushroom4.platformy = 81 * gamesettings.basescalefactor;
		mushroom4.platformleft = mushroom4.x - (45 * gamesettings.basescalefactor);
		mushroom4.platformright = mushroom4.x + (45 * gamesettings.basescalefactor);
		mushroom4.edgemushroom = 0;

		var mushroom5 = {};
		mushroom5.texture = textures.mushroom4;
		mushroom5.x = 390 * gamesettings.basescalefactor;
		mushroom5.platformy = 102 * gamesettings.basescalefactor;
		mushroom5.platformleft = mushroom5.x - (60 * gamesettings.basescalefactor);
		mushroom5.platformright = mushroom5.x + (60 * gamesettings.basescalefactor);
		mushroom5.edgemushroom = 1;

		benshapiro.ents = [ents.froggi, ents.benshapiro];
		benshapiro.mushrooms = [mushroom1, mushroom2, mushroom3, mushroom4, mushroom5];
		benshapiro.winds = [];

		camera.SetFocus(ents.benshapiro, 1.5);
		ents.froggi.ReceiveKeyUpdates = false;
		ents.froggi.direction = 0;
		window.setTimeout(function() {
			dialog.QueueDialog("this is BEN SHAPIRO, he's the first mushroom hater >:(");
			dialog.QueueDialog("like his political arguments, his attacks are v uncreative");
			dialog.QueueDialog("all he knows how to do is punch. but mmmmm look at those muscles (haha get it im being you)");
			dialog.QueueDialog("use your tongue to attack him and avoid his punches");
			dialog.QueueDialog("you can do this baby ily :) <3");
			dialog.OnQueueDepleted = function() {
				ents.froggi.ReceiveKeyUpdates = true;
				camera.SetFocus(ents.froggi, 1);
				window.setTimeout(function() {
					ui.StartCountdown(function() {
						ents.benshapiro.AIEnabled = true;
					});
				}, 500);
			}
		}, 1000);
	}
	benshapiro.Reset = function() {
		ents.froggi.Dead = false;
		ents.froggi.x = 0;
		ents.froggi.y = 56 * gamesettings.basescalefactor;
		ents.froggi.Health = 1;
		ents.benshapiro.x = 390 * gamesettings.basescalefactor;
		ents.benshapiro.y = 102 * gamesettings.basescalefactor;
		ents.benshapiro.Health = 1;
		ents.benshapiro.AIEnabled = false;
		window.setTimeout(function() {
			ui.StartCountdown(function() {
				ents.benshapiro.AIEnabled = true;
			});
		}, 500);
	}
	benshapiro.OnDeath = function() {
		ents.benshapiro.AIEnabled = false;
		dialog.QueueDialog("you lost against ben shapiro lmao");
		dialog.QueueDialog("its cool try again ily");
		dialog.OnQueueDepleted = function() {
			benshapiro.Reset();
		}
	}
	benshapiro.OnEnemyDeath = function() {
		camera.SetFocus(ents.benshapiro, 1.5);
		ents.froggi.Dead = true;
		dialog.QueueDialog("AHHH good job baby :)) <3");
		dialog.QueueDialog("im so proud of you [insert bottom emoji] !!!");
		dialog.QueueDialog("but you're not done yet. there are 2 more mushroom haters to kill.");
		dialog.OnQueueDepleted = function() {
			levels.NextLevel();
		}
	}
	levels.edsheeran = {};
	let edsheeran = levels.edsheeran;
	edsheeran.Initialize = function() {
		//sounds.PlaySound(sounds.linehook);

		ents.froggi.x = 0;
		ents.froggi.y = 91 * gamesettings.basescalefactor;
		ents.froggi.Health = 1;
		ents.froggi.Dead = false;

		ents.edsheeran.x = 370 * gamesettings.basescalefactor;
		ents.edsheeran.y = 102 * gamesettings.basescalefactor;
		ents.edsheeran.AIEnabled = false;
		/*ents.benshapiro.x = 390 * gamesettings.basescalefactor;
		ents.benshapiro.y = 102 * gamesettings.basescalefactor;
		ents.benshapiro.AIEnabled = false;*/

		env.skytype = "night";

		var mushroom1 = {};
		mushroom1.texture = textures.mushroom1;
		mushroom1.x = 0 * gamesettings.basescalefactor;
		mushroom1.platformy = 91 * gamesettings.basescalefactor;
		mushroom1.platformleft = mushroom1.x - (55 * gamesettings.basescalefactor);
		mushroom1.platformright = mushroom1.x + (55 * gamesettings.basescalefactor);
		mushroom1.edgemushroom = -1;

		var mushroom2 = {};
		mushroom2.texture = textures.mushroom4;
		mushroom2.x = 110 * gamesettings.basescalefactor;
		mushroom2.platformy = 102 * gamesettings.basescalefactor;
		mushroom2.platformleft = mushroom2.x - (60 * gamesettings.basescalefactor);
		mushroom2.platformright = mushroom2.x + (60 * gamesettings.basescalefactor);
		mushroom2.edgemushroom = 0;

		var mushroom3 = {};
		mushroom3.texture = textures.mushroom3;
		mushroom3.x = 240 * gamesettings.basescalefactor;
		mushroom3.platformy = 56 * gamesettings.basescalefactor;
		mushroom3.platformleft = mushroom3.x - 40 * gamesettings.basescalefactor;
		mushroom3.platformright = mushroom3.x + 40 * gamesettings.basescalefactor;
		mushroom3.edgemushroom = 0;

		var mushroom4 = {};
		mushroom4.texture = textures.mushroom4;
		mushroom4.x = 370 * gamesettings.basescalefactor;
		mushroom4.platformy = 102 * gamesettings.basescalefactor;
		mushroom4.platformleft = mushroom4.x - (60 * gamesettings.basescalefactor);
		mushroom4.platformright = mushroom4.x + (60 * gamesettings.basescalefactor);
		mushroom4.edgemushroom = 0;

		var mushroom5 = {};
		mushroom5.texture = textures.mushroom1;
		mushroom5.x = 480 * gamesettings.basescalefactor;
		mushroom5.platformy = 91 * gamesettings.basescalefactor;
		mushroom5.platformleft = mushroom5.x - (55 * gamesettings.basescalefactor);
		mushroom5.platformright = mushroom5.x + (55 * gamesettings.basescalefactor);
		mushroom5.edgemushroom = 1;

		var wind1 = wind.new(185 * gamesettings.basescalefactor);
		var wind2 = wind.new(295 * gamesettings.basescalefactor);

		edsheeran.ents = [ents.froggi, ents.edsheeran];
		edsheeran.mushrooms = [mushroom1, mushroom2, mushroom3, mushroom4, mushroom5];
		edsheeran.winds = [wind1, wind2];

		camera.SetFocus(ents.edsheeran, 1.5);
		ents.froggi.ReceiveKeyUpdates = false;
		ents.froggi.direction = 0;
		window.setTimeout(function() {
			dialog.QueueDialog("ew look its ED SHEERAN.");
			dialog.QueueDialog("by staying a virgin until 30, ed sheeran gained the power of virginity rays.");
			dialog.QueueDialog("he cant punch you, but he will shoot virginity rays at you");
			dialog.QueueDialog("if they hit you, you'll take damage. dodge them and hit him as much as you can.");
			dialog.QueueDialog("virginity rays fade out as they travel, the further the ray travels the less damage it will deal.");
			dialog.QueueDialog("babe its literally ed sheeran, you can do this i believe in you :)");
			dialog.OnQueueDepleted = function() {
				ents.froggi.ReceiveKeyUpdates = true;
				camera.SetFocus(ents.froggi, 1);
				window.setTimeout(function() {
					ui.StartCountdown(function() {
						ents.edsheeran.AIEnabled = true;
					});
				}, 500);
			}
		}, 1000);
	}
	edsheeran.Reset = function() {
		ents.froggi.Dead = false;
		ents.froggi.x = 0;
		ents.froggi.y = 91 * gamesettings.basescalefactor;
		ents.froggi.Health = 1;
		ents.edsheeran.x = 370 * gamesettings.basescalefactor;
		ents.edsheeran.y = 102 * gamesettings.basescalefactor;
		ents.edsheeran.Health = 1;
		ents.edsheeran.AIEnabled = false;
		for (let i = 0; i < edsheeran.ents.length; i++) {
			if (edsheeran.ents[i].ray) {
				edsheeran.ents[i].Destroy = true;
			}
		}
		window.setTimeout(function() {
			ui.StartCountdown(function() {
				ents.edsheeran.AIEnabled = true;
			});
		}, 500);
	}
	edsheeran.OnDeath = function() {
		dialog.QueueDialog("yknow... they say those who are killed by virgins become virgins.");
		dialog.QueueDialog("i think i can help fix that if you want ;)");
		dialog.OnQueueDepleted = function() {
			edsheeran.Reset();
		}
	}
	edsheeran.OnEnemyDeath = function() {
		camera.SetFocus(ents.edsheeran, 1.5);
		ents.froggi.Dead = true;
		dialog.QueueDialog("OMG OMG you killed ed sheeran youre so hot rn");
		dialog.QueueDialog("killing ed sheeran makes you v sexy");
		dialog.QueueDialog("go send me nudes rn do it or dont thats okay too i dont wanna make you feel pressured but fucking do it bitch but again only if youre comfortable consent is a very important thing to have in a relationship and i would never want to make you do something you're not comfortable with so please tell me if i ever make you feel that way anyways send me nudes you dumb bitch but fr i love you so much and i always want you to feel comfortable and safe so if you dont want to thats completely okay and i would never make you do that like seriously i mean that with all my heart i love you so much now show me you're fucking tits");
		dialog.QueueDialog("ANYWAYS you get to have a nice break before the final boss so enjoy that :)");
		dialog.OnQueueDepleted = function() {
			levels.NextLevel();
		}
	}

	levels.funsexycoolbreak = {};
	let funsexycoolbreak = levels.funsexycoolbreak;
	funsexycoolbreak.Initialize = function() {
		env.skytype = "day";

		ents.froggi.x = 0;
		ents.froggi.y = 91 * gamesettings.basescalefactor;
		ents.froggi.Dead = false;
		ents.froggi.Health = 1;
		ents.froggi.happy = true; // yay!!!!!!

		ents.ghost.x = 500;
		ents.ghost.y = 95 * gamesettings.basescalefactor;

		var mushroom1 = {};
		mushroom1.texture = textures.mushroom1;
		mushroom1.x = 0;
		mushroom1.platformy = 91 * gamesettings.basescalefactor;
		mushroom1.platformleft = mushroom1.x - 55 * gamesettings.basescalefactor;
		mushroom1.platformright = mushroom1.x + 55 * gamesettings.basescalefactor;

		var mushroom2 = {};
		mushroom2.texture = textures.mushroom3;
		mushroom2.x = 110 * gamesettings.basescalefactor;
		mushroom2.platformy = 56 * gamesettings.basescalefactor;
		mushroom2.platformleft = mushroom2.x - (40 * gamesettings.basescalefactor);
		mushroom2.platformright = mushroom2.x + (40 * gamesettings.basescalefactor);
		mushroom2.trigger = false;
		mushroom2.OnTrigger = function() {
			ents.froggi.ReceiveKeyUpdates = false;
			ents.froggi.direction = 0;
			dialog.QueueDialog("idk i like fucking around in the wind thingies a lot i think its hella fun so if you agree here's a bunch of them :)");
			dialog.OnQueueDepleted = function() {
				ents.froggi.ReceiveKeyUpdates = true;
			}
		}

		var mushroom3 = {};
		mushroom3.texture = textures.mushroom3;
		mushroom3.x = -110 * gamesettings.basescalefactor;
		mushroom3.platformy = 56 * gamesettings.basescalefactor;
		mushroom3.platformleft = mushroom3.x - (40 * gamesettings.basescalefactor);
		mushroom3.platformright = mushroom3.x + (40 * gamesettings.basescalefactor);

		funsexycoolbreak.ents = [ents.froggi, ents.ghost];
		funsexycoolbreak.mushrooms = [mushroom1, mushroom2, mushroom3];
		funsexycoolbreak.winds = [];
		for (let i = 0; i < 5; i++) {
			funsexycoolbreak.winds.push(wind.new(1000 + (30 * 6 * i)));
		}

		camera.SetFocus(ents.froggi, 1);
		ents.froggi.ReceiveKeyUpdates = false;
		ents.froggi.direction = 0;
		window.setTimeout(function() {
			dialog.QueueDialog("okay yeah no hi hi i figured you might want a break before the final boss :)");
			dialog.QueueDialog("so yeah hangout w the ghost and relax for a little bit");
			dialog.QueueDialog("take as much time as you need here and when you're ready go through the portal on the left ilyyyyyy");
			dialog.OnQueueDepleted = function() {
				ents.froggi.ReceiveKeyUpdates = true;
			}
		}, 1000);
	}
	funsexycoolbreak.Reset = function() {
		ents.froggi.Dead = false;
		ents.froggi.x = 0;
		ents.froggi.y = 91 * gamesettings.basescalefactor;
		ents.froggi.Health = 1;
	}
	funsexycoolbreak.OnDeath = function() {
		dialog.QueueDialog("this is your break so yeah no you didnt die lets forget that happened ;)");
		dialog.OnQueueDepleted = function() {
			intro.Reset();
		}
	}

	levels.levellist = [
		levels.intro,
		levels.benshapiro,
		levels.edsheeran,
		levels.funsexycoolbreak
	];
	levels.NextLevel = function() {
		sounds.StopAll();
		ui.FadeOut(function() {
			gamestate.levelNum++;
			save.SaveProgress();
			dialog.QueueDialog("Your progress has been saved... If you wanna stop for now, you may close the tab. You may resume at any time.");
			dialog.OnQueueDepleted = function() {
				gamestate.level = levels.levellist[gamestate.levelNum];
				gamestate.level.Initialize();
				ui.FadeIn(function() {
					//gamestate.level.OnFadeIn();
				});
			}
		});
	}
})();
