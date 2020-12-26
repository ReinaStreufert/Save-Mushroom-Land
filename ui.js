(function() {
	window.ui = {};

	ui.cutscenestart = null;
	ui.cutsceneend = null;
	ui.cutscenestartrequest = false;
	ui.cutsceneendrequest = false;

	ui.StartCutScene = function() {
		ui.cutscenestartrequest = true;
	};
	ui.EndCutScene = function() {
		ui.cutsceneendrequest = true;
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
	}
})();
