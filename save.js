(function() {
	window.save = {};
	save.FirstTime;
	save.Restore = function() {
		let statedata;
		try {
			let statedataTemp = JSON.parse(document.cookie);
			if (typeof(statedataTemp.levelNum) == "number" && statedataTemp.levelNum < levels.levellist.length) {
				statedata = statedataTemp
			} else {
				statedata = null;
			}
		} catch {
			statedata = null;
		}
		if (statedata != null) {
			save.FirstTime = false;
			gamestate.levelNum = statedata.levelNum;
			gamestate.level = levels.levellist[statedata.levelNum];
		} else {
			save.FirstTime = true;
			gamestate.levelNum = 0;
			gamestate.level = levels.levellist[0];
		}
	}
	save.SaveProgress = function() {
		document.cookie = JSON.stringify({levelNum: gamestate.levelNum})
	}
})();
