function BirmeUtils() {
}

BirmeUtils.getFitScale = function(ow, oh, nw, nh, fitStyle) {
	var wRatio = nw / ow;
	var hRatio = nh / oh;
	var biggerRatio;
	var smallerRatio;
	if(hRatio > wRatio) {
		biggerRatio = hRatio;
		smallerRatio = wRatio;
	} else {
		biggerRatio = wRatio;
		smallerRatio = hRatio;
	}
	var scale;
	if(fitStyle == "contain") {
		scale = smallerRatio;
	} else if(fitStyle == "crop") {
		scale = biggerRatio;
	}
	return scale;
}

BirmeUtils.getCropStart = function(ow, oh, nw, nh, cropAlign) {
	var dx = parseInt(ow - nw);
	var dy = parseInt(oh - nh);
	if(dx < 0) {
		dx = 0;
	}
	if(dy < 0) {
		dy = 0;
	}
	var startPos = {
		x : 0,
		y : 0
	};
	switch(cropAlign.x) {
		case 'center':
			startPos.x = dx / 2;
			break;
		case 'left':
			startPos.x = 0;
			break;
		case 'right':
			startPos.x = dx;
			break;
	}
	switch(cropAlign.y) {
		case 'center':
			startPos.y = dy / 2;
			break;
		case 'top':
			startPos.y = 0;
			break;
		case 'bottom':
			startPos.y = dy;
			break;
	}
	return startPos;
}// JavaScript Document