window.utils = {};

utils.distance = function(x1, y1, x2, y2) {
	return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
}
utils.pixelstoward = function(x1, y1, x2, y2, px) {
	var dist = distance(x1, y1, x2, y2);
	var rise = (y2 - y1) / dist;
	var run = (x2 - x1) / dist;
	var newa = {};
	newa.x = x1 + (run * px);
	newa.y = x2 + (rise * px);
	return newa;
}

utils.getLines = function(ctx, text, maxWidth) {
	var words = text.split(" ");
	var lines = [];
	var currentLine = words[0];

	for (var i = 1; i < words.length; i++) {
		var word = words[i];
		var width = ctx.measureText(currentLine + " " + word).width;
		if (width < maxWidth) {
			currentLine += " " + word;
		} else {
			lines.push(currentLine);
			currentLine = word;
		}
	}
	lines.push(currentLine);
	return lines;
}

utils.drawWrappedText = function(txt, x, y, px, gap) {
	var lines = getLines(ctx, txt, canvas.width - 200);
	var absy = y;//(y - (lines.length * (px + gap))) + gap;
	for (var i = 0; i < lines.length; i++) {
		ctx.fillText(lines[i], x, absy + (i * (px + gap)));
	}
}
