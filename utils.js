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
