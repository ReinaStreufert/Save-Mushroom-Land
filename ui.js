(function() {
	window.ui = {};

	ui.event = null;

	ui.cutscenestart = null;
	ui.cutsceneend = null;
	ui.cutscenestartrequest = false;
	ui.cutsceneendrequest = false;

	ui.faderequest = false;
	ui.fadestart = null;
	ui.fadetype = 0;

	ui.countdownstart = null;

	ui.StartCutScene = function() {
		ui.cutscenestartrequest = true;
	};
	ui.EndCutScene = function() {
		ui.cutsceneendrequest = true;
	};
	ui.FadeOut = function(oncomplete) {
		ui.faderequest = true;
		ui.event = oncomplete;
		ui.fadetype = 0;
	};
	ui.FadeIn = function(oncomplete) {
		ui.faderequest = true;
		ui.event = oncomplete;
		ui.fadetype = 1;
	};
	ui.StartCountdown = function(oncomplete) {
		ui.event = oncomplete;
		ui.countdownrequest = true;
	};
	ui.Do = function(ctx, time) {
		if (ui.cutscenestartrequest) {
			ui.cutscenestart = time;
			ui.cutsceneend = null;
			ui.cutscenestartrequest = false;
		}
		if (ui.cutsceneendrequest) {
			ui.cutscenestart = null;
			ui.cutsceneend = time;
			ui.cutsceneendrequest = false;
		}
		if (ui.cutscenestart != null) {
			let cutsceneelapsed = time - ui.cutscenestart;
			let alpha = gamesettings.cutscenemarkalpha;
			if (cutsceneelapsed < gamesettings.cutscenemarkanimationlength) {
				let progress = cutsceneelapsed / gamesettings.cutscenemarkanimationlength;
				let progressCurved = utils.calculatecubicbezier(gamesettings.cutscenemarkanimationcurve, progress).y;
				alpha = progressCurved * gamesettings.cutscenemarkalpha;
				//console.log(alpha);
			}
			let topgradient = ctx.createLinearGradient(0, 0, 0, gamesettings.cutscenemarkheight);
			topgradient.addColorStop(0, 'rgba(0, 0, 0, ' + alpha + ')');
			topgradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
			ctx.fillStyle = topgradient;
			ctx.fillRect(0, 0, canvas.width, gamesettings.cutscenemarkheight);

			let bottomgradient = ctx.createLinearGradient(0, canvas.height - gamesettings.cutscenemarkheight, 0, canvas.height);
			bottomgradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
			bottomgradient.addColorStop(1, 'rgba(0, 0, 0, ' + alpha + ')');
			ctx.fillStyle = bottomgradient;
			ctx.fillRect(0, canvas.height - gamesettings.cutscenemarkheight, canvas.width, gamesettings.cutscenemarkheight);
		}
		if (ui.cutsceneend != null) {
			let cutsceneelapsed = time - ui.cutsceneend;
			let alpha = 0;
			if (cutsceneelapsed < gamesettings.cutscenemarkanimationlength) {
				let progress = cutsceneelapsed / gamesettings.cutscenemarkanimationlength;
				let progressCurved = utils.calculatecubicbezier(gamesettings.cutscenemarkanimationcurve, progress).y;
				alpha = gamesettings.cutscenemarkalpha - (progressCurved * gamesettings.cutscenemarkalpha);
				let topgradient = ctx.createLinearGradient(0, 0, 0, gamesettings.cutscenemarkheight);
				topgradient.addColorStop(0, 'rgba(0, 0, 0, ' + alpha + ')');
				topgradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
				ctx.fillStyle = topgradient;
				ctx.fillRect(0, 0, canvas.width, gamesettings.cutscenemarkheight);

				let bottomgradient = ctx.createLinearGradient(0, canvas.height - gamesettings.cutscenemarkheight, 0, canvas.height);
				bottomgradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
				bottomgradient.addColorStop(1, 'rgba(0, 0, 0, ' + alpha + ')');
				ctx.fillStyle = bottomgradient;
				ctx.fillRect(0, canvas.height - gamesettings.cutscenemarkheight, canvas.width, gamesettings.cutscenemarkheight);
			} else {
				cutsceneend = null;
			}
		}

		if (gamestate.ui == "play") {
			for (let i = 0; i < gamestate.level.ents.length; i++) {
				let ent = gamestate.level.ents[i];
				if (ent.Health && ent.Health < 1 && !ent.Dead) {
					let rect = camera.PlaceRect(ent.x, ent.y + ent.Height() + gamesettings.healthbaroffset, gamesettings.healthbarwidth, gamesettings.healthbarheight, 0, 1);
					//console.log(rect.x + ' ' + rect.y);
					ctx.strokeStyle = gamesettings.healthbaroutlinecolor;
					ctx.lineWidth = gamesettings.healthbaroutlinewidth;
					ctx.strokeRect(rect.x, rect.y, rect.width, rect.height);
					ctx.fillStyle = gamesettings.healthbaroutlinecolor;
					ctx.fillRect(rect.x, rect.y, rect.width, rect.height);

					let healthrect = camera.PlaceRect(ent.x - gamesettings.healthbarwidth / 2, ent.y + ent.Height() + gamesettings.healthbaroffset, gamesettings.healthbarwidth * ent.Health, gamesettings.healthbarheight, -1, 1);
					ctx.fillStyle = gamesettings.healthbarcolor;
					ctx.fillRect(healthrect.x, healthrect.y, healthrect.width, healthrect.height);
				}
			}
		}

		if (ui.faderequest) {
			ui.faderequest = false;
			ui.fadestart = time;
		}
		if (ui.fadestart != null) {
			let fadeelapsed = time - ui.fadestart;
			let alpha = 1;
			if (fadeelapsed < gamesettings.fadelength) {
				alpha = fadeelapsed / gamesettings.fadelength;
			}
			if (ui.fadetype == 1) {
				alpha = 1 - alpha;
			}
			if (ui.fadetype == 1 && fadeelapsed > gamesettings.fadelength) {
				ui.fadestart = null;
			} else {
				ctx.fillStyle = "rgba(0, 0, 0, " + alpha + ")";
				ctx.fillRect(0, 0, canvas.width, canvas.height);
			}
			if (fadeelapsed >= gamesettings.fadelength) {
				if (ui.event) {
					ui.event();
					ui.event = null;
				}
			}
		}

		if (ui.countdownrequest) {
			ui.countdownrequest = false;
			ui.countdownstart = time;
		}
		if (ui.countdownstart != null) {
			let countdownelapsed = time - ui.countdownstart;
			let tex = null;
			let alpha;
			if (countdownelapsed > 4500) {
				if (ui.event) {
					ui.event();
				}
				ui.countdownstart = null;
			} else if (countdownelapsed >= 3000) {
				tex = textures.countdown1;
				alpha = 1 - ((countdownelapsed - 3000) / 1500);
			} else if (countdownelapsed >= 1500) {
				tex = textures.countdown2;
				alpha = 1 - ((countdownelapsed - 1500) / 1500);
			} else if (countdownelapsed >= 0) {
				tex = textures.countdown3;
				alpha = 1 - (countdownelapsed / 1500);
			}
			if (tex != null) {
				ctx.globalAlpha = alpha;
				ctx.drawImage(tex, canvas.width / 2 - (tex.width * gamesettings.basescalefactor) / 2, canvas.height / 2 - (tex.height * gamesettings.basescalefactor) / 2, tex.width * gamesettings.basescalefactor, tex.height * gamesettings.basescalefactor);
				ctx.globalAlpha = 1;
			}
		}
	}
})();
