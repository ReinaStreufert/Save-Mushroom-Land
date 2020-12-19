window.utils = {};

utils.distance = function(x1, y1, x2, y2) {
	return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
}

/*function pixelstoward(a, b, px) {
	var dist = distance(a, b);
	var rise = (b.y - a.y) / dist;
	var run = (b.x - a.x) / dist;
	var newa = {};
	newa.x = a.x + (run * px);
	newa.y = a.y + (rise * px);
	return newa;
}*/
