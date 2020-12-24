window.wind = {};
wind.new = function(x) {
	let column = {};
	column.x = x;
	column.marks = [];
	column.lastgen = null;
	column.lasttime = null;

	column.Left = function() {
		return column.x - ((gamesettings.windwidth * gamesettings.basescalefactor) / 2)
	}
	column.Right = function() {
		return column.x + ((gamesettings.windwidth * gamesettings.basescalefactor) / 2)
	}
	column.Do = function(ctx, time) {
		if (column.lasttime == null) {
			column.lasttime = time;
		}
		if (column.lastgen == null) {
			column.lastgen = time - gamesettings.windmarkgeninterval;
		}
		var elapsed = time - column.lasttime;
		var elapsedseconds = elapsed / 1000;
		var elapsedgen = time - column.lastgen;
		//console.log(time + " - " + column.lastgen + " = " + elapsedgen);
		//console.log(elapsedgen);

		if (elapsedgen >= gamesettings.windmarkgeninterval) {
			let mark = {};
			mark.x = utils.randInt(0, gamesettings.windwidth);
			//console.log(mark.x);
			mark.height = utils.randInt(gamesettings.windmarkminheight, gamesettings.windmarkmaxheight);
			mark.y = -mark.height * gamesettings.basescalefactor;

			column.marks.push(mark);
			column.lastgen = time;
		}

		let left = column.Left();
		ctx.fillStyle = gamesettings.windcolor;
		let rect = {};
		rect.x = left - gamesettings.basescalefactor;
		rect.y = 0; // arbitrary
		rect.width = gamesettings.windwidth + 2;
		rect.height = 5; // arbitrary

		let screenrect = camera.PlaceTexture(rect, rect.x, rect.y, -1, 1);
		ctx.fillRect(screenrect.x, 0, screenrect.width, canvas.height);

		ctx.fillStyle = gamesettings.windmarkcolor;
		for (let i = 0; i < column.marks.length; i++) {
			let mark = column.marks[i];
			let markrect = {};
			markrect.x = left + (mark.x * gamesettings.basescalefactor);
			markrect.y = mark.y;
			markrect.width = 1;
			markrect.height = mark.height;

			let screenrect = camera.PlaceTexture(markrect, markrect.x, markrect.y, -1, 1);
			ctx.fillRect(screenrect.x, screenrect.y, screenrect.width, screenrect.height);

			mark.y += gamesettings.windmarkspeed * elapsedseconds;
			if (mark.y > gamesettings.windmarkthreshold) {
				column.marks.splice(i, 1);
				i--;
			}
		}
		column.lasttime = time;
	}
	return column;
}
