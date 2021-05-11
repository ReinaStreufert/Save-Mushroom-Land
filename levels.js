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
			dialog.QueueDialog(window.texts[0]);
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
						dialog.QueueDialog(window.texts[1]);
						dialog.QueueDialog(window.texts[2]);
						dialog.QueueDialog(window.texts[3]);
						dialog.QueueDialog(window.texts[4]);
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

		ents.engineer.x = 615 * gamesettings.basescalefactor;
		ents.engineer.y = 0;

		var wind1 = wind.new(210 * gamesettings.basescalefactor);

		intro.ents = [ents.froggi, ents.fallingmushroom, ents.engineer];
		intro.mushrooms = [mushroom1, mushroom2, mushroom3, mushroom4, mushroom5];
		intro.winds = [wind1];

		camera.SetFocus(ents.froggi, 1);
		ents.froggi.ReceiveKeyUpdates = false;
		ents.froggi.direction = 0;
		window.setTimeout(function() {
			dialog.QueueDialog(window.texts[5]);
			dialog.QueueDialog(window.texts[6]);
			dialog.QueueDialog(window.texts[7]);
			dialog.QueueDialog(window.texts[8]);
			dialog.QueueDialog(window.texts[9]);
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
			dialog.QueueDialog(window.texts[10]);
			dialog.QueueDialog(window.texts[11]);
			intro.firstdeath = false;
		} else {
			dialog.QueueDialog(window.texts[12]); // You died...
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
			dialog.QueueDialog(window.texts[13]);
			dialog.QueueDialog(window.texts[14]);
			dialog.QueueDialog(window.texts[15]);
			dialog.QueueDialog(window.texts[16]);
			dialog.QueueDialog(window.texts[17]);
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
		dialog.QueueDialog(window.texts[18]);
		dialog.QueueDialog(window.texts[19]);
		dialog.OnQueueDepleted = function() {
			benshapiro.Reset();
		}
	}
	benshapiro.OnEnemyDeath = function() {
		camera.SetFocus(ents.benshapiro, 1.5);
		ents.froggi.Dead = true;
		dialog.QueueDialog(window.texts[20]);
		dialog.QueueDialog(window.texts[21]);
		dialog.QueueDialog(window.texts[22]);
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
			dialog.QueueDialog(window.texts[23]);
			dialog.QueueDialog(window.texts[24]);
			dialog.QueueDialog(window.texts[25]);
			dialog.QueueDialog(window.texts[26]);
			dialog.QueueDialog(window.texts[27]);
			dialog.QueueDialog(window.texts[28]);
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
		dialog.QueueDialog(window.texts[29]);
		dialog.QueueDialog(window.texts[30]);
		dialog.OnQueueDepleted = function() {
			edsheeran.Reset();
		}
	}
	edsheeran.OnEnemyDeath = function() {
		camera.SetFocus(ents.edsheeran, 1.5);
		ents.froggi.Dead = true;
		dialog.QueueDialog(window.texts[31]);
		dialog.QueueDialog(window.texts[32]);
		dialog.QueueDialog(window.texts[33]);
		dialog.QueueDialog(window.texts[34]);
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

		ents.portal.x = -110 * gamesettings.basescalefactor;
		ents.portal.y = 65 * gamesettings.basescalefactor;

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
			dialog.QueueDialog(window.texts[35]);
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

		funsexycoolbreak.ents = [ents.portal, ents.froggi, ents.ghost];
		funsexycoolbreak.mushrooms = [mushroom1, mushroom2, mushroom3];
		funsexycoolbreak.winds = [];
		for (let i = 0; i < 5; i++) {
			funsexycoolbreak.winds.push(wind.new(1000 + (30 * 6 * i)));
		}

		camera.SetFocus(ents.froggi, 1);
		ents.froggi.ReceiveKeyUpdates = false;
		ents.froggi.direction = 0;
		window.setTimeout(function() {
			dialog.QueueDialog(window.texts[36]);
			dialog.QueueDialog(window.texts[37]);
			dialog.QueueDialog(window.texts[38]);
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
		dialog.QueueDialog(window.texts[39]);
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
