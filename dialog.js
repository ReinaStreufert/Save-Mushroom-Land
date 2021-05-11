(function() {
	window.dialog = {};

	dialog.OnQueueDepleted = null;
	dialog.queue = [];
	dialog.lasttype = null;
	dialog.progress = 0;
	dialog.QueueDialog = function(text) {
		dialog.queue.push({text: text, type: "dialog"});
	};
	dialog.QueuePrompt = function(text) {
		let returnobject = {result: null};
		dialog.queue.push({text: text, type: "prompt", returnobject: returnobject});
		return returnobject;
	};
	dialog.NextDialog = function() {
		if (dialog.queue.length > 0) {
			dialog.queue.splice(0, 1);
			if (dialog.queue.length == 0 && dialog.OnQueueDepleted) {
				dialog.OnQueueDepleted();
			}
			dialog.lasttype = null;
			dialog.progress = 0;
		}
	};
	dialog.Do = function(ctx, time) {
		if (dialog.queue.length > 0) {
			let text = dialog.queue[0].text;
			let dialogrect = {x: gamesettings.dialogmargin, y: canvas.height - gamesettings.dialogmargin - gamesettings.dialogheight, width: canvas.width - gamesettings.dialogmargin * 2, height: gamesettings.dialogheight};
			let textrect = {x: dialogrect.x + gamesettings.dialogpadding, y: dialogrect.y + gamesettings.dialogpadding, width: dialogrect.width - gamesettings.dialogpadding * 2, height: dialogrect.height - gamesettings.dialogpadding * 2};

			ctx.fillStyle = gamesettings.dialogcolor;
			ctx.fillRect(dialogrect.x, dialogrect.y, dialogrect.width, dialogrect.height);
			ctx.strokeStyle = gamesettings.dialogbordercolor;
			ctx.lineWidth = gamesettings.dialogborderwidth;
			ctx.strokeRect(dialogrect.x, dialogrect.y, dialogrect.width, dialogrect.height);

			if (dialog.lasttype == null) {
				dialog.lasttype = time;
			}
			let elapsed = time - dialog.lasttype;
			if (dialog.progress < text.length && elapsed > gamesettings.dialogtextinterval) {
				dialog.progress++;
				dialog.lasttype = time;
			}

			ctx.font = "24px 'Press Start 2P'";
			ctx.textAlign = "left";
			ctx.textBaseline = "top";
			ctx.fillStyle = gamesettings.dialogtextcolor;
			utils.drawWrappedText(ctx, text.substr(0, dialog.progress), textrect.x, textrect.y, 24, 10, textrect.width);

			ctx.textBaseline = "bottom";
			ctx.font = "24px 'Press Start 2P'";
			let endtext = gamesettings.dialogendtext;
			if (dialog.queue[0].type == "prompt") {
				endtext = gamesettings.promptendtext;
			}
			utils.drawWrappedText(ctx, endtext, textrect.x, textrect.y + textrect.height, 16, 10, textrect.width);
		}
	};
	document.addEventListener('keydown', function(e) {
		if (gamestate.ui == "play") {
			if (dialog.queue.length > 0) {
				if (dialog.queue[0].type == "dialog") {
					if (e.code == "Enter") {
						dialog.NextDialog();
					}
				} else if (dialog.queue[0].type == "prompt") {
					if (e.code == "KeyY") {
						dialog.queue[0].returnobject.result = true;
						dialog.NextDialog();
					} else if (e.code == "KeyN") {
						dialog.queue[0].returnobject.result = false;
						dialog.NextDialog();
					}
				}
			}
		}
	});
})();
