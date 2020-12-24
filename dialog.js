(function() {
	window.dialog = {};

	dialog.OnQueueDepleted = null;
	dialog.queue = [];
	dialog.lasttype = null;
	dialog.progress = 0;
	dialog.QueueDialog = function(text) {
		dialog.queue.push(text);
	}
	dialog.NextDialog = function() {
		if (dialog.queue.length > 0) {
			dialog.queue.splice(0, 1);
			if (dialog.queue.length == 0 && dialog.OnQueueDepleted) {
				dialog.OnQueueDepleted();
			}
			dialog.lasttype = null;
			dialog.progress = 0;
		}
	}
	dialog.Do = function(ctx, time) {
		if (dialog.queue.length > 0) {
			let text = dialog.queue[0];
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
			utils.drawWrappedText(ctx, gamesettings.dialogendtext, textrect.x, textrect.y + textrect.height, 16, 10, textrect.width);
		}
	}
})();
