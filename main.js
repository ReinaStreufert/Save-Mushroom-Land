window.canvas = document.getElementById('game');
var ctx = canvas.getContext('2d');
var mouseX = 0;
var mouseY = 0;

var gameplayState = "play";
var levelNumber = 0;
var level = levels[levelNumber];
var camera = {
	centeredOnX: 0,
	centeredOnY: 0,
	zoom: 1
}

ctx.lineCap = 'round';
ctx.strokeStyle = 'DodgerBlue';
ctx.lineJoin = 'round';

document.body.onresize = function() {
	var canvas = document.getElementById('game');
	canvas.width = document.body.offsetWidth;
	canvas.height = document.body.offsetHeight;
}
canvas.width = document.body.offsetWidth;
canvas.height = document.body.offsetHeight;

function getLines(ctx, text, maxWidth) {
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

function drawWrappedText(txt, x, y, px, gap) {
	var lines = getLines(ctx, txt, canvas.width - 200);
	var absy = y;//(y - (lines.length * (px + gap))) + gap;
	for (var i = 0; i < lines.length; i++) {
		ctx.fillText(lines[i], x, absy + (i * (px + gap)));
	}
}

function loop() {
	requestAnimationFrame(loop);
	ctx.fillStyle = gamesettings.skycolor;
	ctx.fillRect(0, 0, canvas.width, canvas.height);
}

canvas.addEventListener('mousemove', function(e) {
	var rect = canvas.getBoundingClientRect();
	mouseX = e.clientX - rect.left;
	mouseY = e.clientY - rect.top;
});
document.addEventListener('keydown', function(e) {

});
requestAnimationFrame(loop);
