function initUserSettings() {
	document.getElementById('percText').onchange = percChanged;
	document.getElementById('percText').value = 100;
	document.getElementById('widthText').onchange = dimChanged;
	document.getElementById('heightText').onchange = dimChanged;
	document.getElementById('widthText').value = 800;
	document.getElementById('heightText').value = 600;
	addFlexListeners();
	document.getElementsByName('flexBtns')[0].checked = true;
	document.getElementById('cropAlignX').selectedIndex = 1;
	document.getElementById('cropAlignY').selectedIndex = 1;
	document.getElementById('cropAlignX').onchange = cropChanged;
	document.getElementById('cropAlignY').onchange = cropChanged;
	resizeByBtns = document.getElementsByName('resizeByBtn');
	addResizeByListeners();
	resizeByBtns[0].checked = true;
	setResizeMode('dim');
	document.getElementById('qualityText').onchange = qualityChanged;
	document.getElementById('qualityText').value = 80;
	$('#qualityText').removeAttr("disabled"); qualityChanged;
	document.getElementById('borderWidthText').onchange = borderWidthChanged;
	document.getElementById('borderWidthText').value = 0;
	$('#borderWidthText').removeAttr("disabled"); borderWidthChanged;
}

function addResizeByListeners() {
	for(var i = 0; i < resizeByBtns.length; i++) {
		resizeByBtns[i].onclick = function() {
			setResizeMode(this.value);
		};
	}
}

function addFlexListeners() {
	var flexBtns = document.getElementsByName('flexBtns');
	for(var i = 0; i < flexBtns.length; i++) {
		flexBtns[i].onclick = function() {
			flexChanged(this.value);
		};
	}
}

function disableFlex() {
	var flexBtns = document.getElementsByName('flexBtns');
	for(var i = 0; i < flexBtns.length; i++) {
		flexBtns[i].setAttribute('disabled', true);
	}
}

function enableFlex() {
	var flexBtns = document.getElementsByName('flexBtns');
	for(var i = 0; i < flexBtns.length; i++) {
		flexBtns[i].removeAttribute('disabled');
	}
}

function setResizeMode(value) {
	var $percText = $('#percText');
	var $resizeByPerc = $('#resizeByPercText');
	var $resizeByDim = $('#resizeByDimContent');
	var $widthText = $('#widthText');
	var $heightText = $('#heightText');
	var $flexSelect = $('#flexSelect');
	switch(value) {
		case 'perc':
			$percText.removeAttr("disabled");
			percChanged();
			$resizeByPerc.css({
				opacity : 1
			});
			$resizeByDim.css({
				opacity : .5
			});
			$widthText.attr("disabled", true);
			$heightText.attr("disabled", true);
			$('#cropX').attr("disabled", true);
			$('#cropY').attr("disabled", true);
			disableFlex();
			currentUserSettings.resizeByPerc = true;
			break;
		case 'dim':
			$percText.attr("disabled", true);
			$resizeByPerc.css({
				opacity : .5
			});
			$resizeByDim.css({
				opacity : 1
			});
			$widthText.removeAttr("disabled");
			$heightText.removeAttr("disabled");
			$('#cropX').removeAttr("disabled");
			$('#cropY').removeAttr("disabled");
			enableFlex();
			currentUserSettings.resizeByPerc = false;
			flexChanged(currentUserSettings.flexible);
			break;
	}
	settingsChanged();
}

function percChanged() {
	if(checkNumberField('percText', false)) {
		var value = document.getElementById('percText').value;
		currentUserSettings.resizePerc = value;
		settingsChanged();
	} else {
		alert('Please enter a number more than 0');
		document.getElementById('percText').value = currentUserSettings.resizePerc;
	}
}

function dimChanged() {
	if(checkNumberField('widthText', false)) {
		var value = document.getElementById('widthText').value;
		currentUserSettings.width = parseInt(value);
		settingsChanged();
	} else {
		alert('Please enter a number more than 0');
		document.getElementById('widthText').value = currentUserSettings.width;
	}
	if(checkNumberField('heightText', false)) {
		var value = document.getElementById('heightText').value;
		currentUserSettings.height = parseInt(value);
		settingsChanged();
	} else {
		alert('Please enter a number more than 0');
		document.getElementById('heightText').value = currentUserSettings.height;
	}
}

function qualityChanged() {
	if(checkNumberField('qualityText', false)) {
		var value = document.getElementById('qualityText').value;
		currentUserSettings.quality = value / 100;
		settingsChanged();
	} else {
		alert('Please enter a number more than 0');
		document.getElementById('qualityText').value = currentUserSettings.quality * 100;
	}
}

function borderWidthChanged() {
	if(checkNumberField('borderWidthText', true)) {
		var value = document.getElementById('borderWidthText').value;
		currentUserSettings.borderWidth = parseInt(value);
		settingsChanged();
	} else {
		alert('Please enter a number that is 0 or more');
		document.getElementById('borderWidthText').value = currentUserSettings.borderWidth;
	}
}

function checkNumberField(field, includeZero) {
	var value = document.getElementById(field).value;
	if(isNaN(value)) {
		document.getElementById(field).focus();
		document.getElementById(field).select();
		return false;
	} else {
		if(value > 0) {
			return true;
		} else if(value == 0 && includeZero) {
			return true;
		} else {
			return false;
		}
	}
}

function flexChanged(value) {
	dimChanged();
	currentUserSettings.flexible = value;
	switch(value) {
		case 'width':
			$('#heightText').removeAttr('disabled');
			$('#widthText').attr('disabled', true);
			$('#widthText').css({
				opacity : .5
			});
			$('#heightText').css({
				opacity : 1
			});
			$('#cropX').attr("disabled", true);
			$('#cropY').attr("disabled", true);
			$('#cropX').css({
				opacity : .5
			});
			$('#cropY').css({
				opacity : .5
			});
			currentUserSettings.fit = 'contain';
			break;
		case 'height':
			$('#widthText').removeAttr('disabled');
			$('#heightText').attr('disabled', true);
			$('#heightText').css({
				opacity : .5
			});
			$('#widthText').css({
				opacity : 1
			});
			$('#cropX').attr("disabled", true);
			$('#cropY').attr("disabled", true);
			$('#cropX').css({
				opacity : .5
			});
			$('#cropY').css({
				opacity : .5
			});
			currentUserSettings.fit = 'contain';
			break;
		case 'none':
			$('#widthText').removeAttr('disabled');
			$('#heightText').removeAttr('disabled');
			$('#widthText').css({
				opacity : 1
			});
			$('#heightText').css({
				opacity : 1
			});
			$('#cropX').removeAttr("disabled");
			$('#cropY').removeAttr("disabled");
			$('#cropX').css({
				opacity : 1
			});
			$('#cropY').css({
				opacity : 1
			});
			currentUserSettings.fit = 'crop';
			break;
	}
	settingsChanged();
}

function cropChanged() {
	var xValue = document.getElementById('cropAlignX').value;
	var yValue = document.getElementById('cropAlignY').value;
	currentUserSettings.xPriority = xValue;
	currentUserSettings.yPriority = yValue;
	settingsChanged();
}
