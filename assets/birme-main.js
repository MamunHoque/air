var highestId = 0;
var loadIndex = -1;
var previewLoaderInterval;
var filesLeftToRead = 0;
var imageObjects = [];
var zip = new JSZip();
var prependName = "";
var appendName = "";
var currentUserSettings = {
	fit : 'crop',
	resizeByPerc : false,
	resizePerc : '100',
	width : 800,
	height : 600,
	xPriority : 'center',
	yPriority : 'center',
	flexible : 'none',
	quality : 0.8,
	borderStyle : '#000',
	borderWidth : 0
};

var thumbnailSize = 150;

$(document).ready(function(e) {
	init();
});
function init() {
	initDrag();
	initButtonRollovers();
	initBrowseBtn();
	initUserSettings();
	document.getElementById('clear').onclick = hClearAll;
	$("#downloadify").hide();
	$("#description").hide();
}

function initBrowseBtn() {
	document.getElementById('browse').addEventListener('change', fileAdded, false);
	document.getElementById('browse2').addEventListener('change', fileAdded, false);
	document.getElementById('browse3').addEventListener('change', fileAdded, false);
	document.getElementById('browse4').addEventListener('change', fileAdded, false);
}

function initDrag() {
	document.getElementById('preview').innerHTML = "";
	document.getElementById('preview').innerHTML = '<div id="dragOverlay2" style="height:100%; overflow:hidden; opacity:.3; letter-spacing:.3em;"><h2 style="position:relative; top:45%;">DRAG AND DROP FILES HERE</h2></div>'+
	'<div id="dragOverlay1" style="height:100%; background:#000; opacity:0; position:relative; top:-100%;"></div>'+
	'<div id="dragDropArea" style="height:100%; position:relative; top:-200%; overflow:auto;"></div>';
	var dragArea = document.getElementById('dragDropArea');
	dragArea.addEventListener('dragover', hDragover, false);
	dragArea.addEventListener('dragleave', hDragleave, false);
	dragArea.addEventListener('drop', hDrop, false);
}

function initButtonRollovers() {
	var buttons = document.getElementsByClassName('button-image');
	for(var i = 0; i < buttons.length; i++) {
		buttons[i].onmouseover = hBtnMouseover;
		buttons[i].onmouseout = hBtnMouseout;
	}
}

function hBtnMouseover(e) {
	switch(e.target.className) {
		case 'button-image':
		showRolloverEffect('#' + e.target.id);
		break;
		case '':
		showRolloverEffect('#downloadify');
		break;
		case 'browse-btn':
		showRolloverEffect('#browse-hit-area');
		break;
	}
}

function hBtnMouseout(e) {
	switch(e.target.className) {
		case 'button-image':
		showRolloutEffect('#' + e.target.id);
		break;
		case '':
		showRolloutEffect('#downloadify');
		break;
		case 'browse-btn':
		showRolloutEffect('#browse-hit-area');
		break;
	}
}

function showRolloverEffect(target) {
	$(target).css({
		opacity : .7
	});
}

function showRolloutEffect(target) {
	$(target).css({
		opacity : 1
	});
}

function hDragover(e) {
	noopHandler(e);
	$('#dragOverlay1').css({
		opacity : .5
	});
}

function hDragleave(e) {
	noopHandler(e);
	$('#dragOverlay1').css({
		opacity : 0
	});
}

function noopHandler(e) {
	e.stopPropagation();
	e.preventDefault();
}

function hDrop(e) {
	noopHandler(e);
	$('#dragOverlay1').css({
		opacity : 0
	});
	fileAdded(e);
}

function hClearAll() {
	imageObjects = [];
	initDrag();
	$('#downloadify').hide();
}

function fileAdded(e) {
	$('#dragOverlay2').css({
		visibility : "hidden"
	});
	var files = e.target.files || e.dataTransfer.files;
	filesLeftToRead = files.length;
	for(var i = 0; i < files.length; i++) {
		parseFile(files[i]);
	}
	$('#downloadify').show();
}

function parseFile(file) {
	var reader = new FileReader();
	reader.onload = function(e) {
		hFileLoaded(e, file.name);
	}
	reader.readAsDataURL(file);
}

function hFileLoaded(e, name) {
	var image = e.target.result;
	var drawnImage = new Image();
	drawnImage.onload = function(e) {
		var imageNamePieces = name.split(".");
		var extension = imageNamePieces[imageNamePieces.length - 1];
		var newImageObject = new BirmeImageObject(drawnImage, highestId, name, extension.toUpperCase());
		newImageObject.currentUserSettings = currentUserSettings;
		newImageObject.thumbnailSize = thumbnailSize;
		imageObjects.push(newImageObject);
		addThumbnail(imageObjects.length - 1);
		highestId++;
		filesLeftToRead--;
		if(filesLeftToRead < 1) {
			startLoadingPreviews();
		}
	}
	drawnImage.src = image;
}

function addThumbnail(imageNo) {
	var imageObject = imageObjects[imageNo];
	var image = imageObject.image;
	var id = imageObject.id;
	$('#dragDropArea').append(
		'<br><div height="' + thumbnailSize + '" id="thumb-' + id + '" class="thumbnail-pair">'+
		'<div style="display:inline-block;width:' + thumbnailSize + 'px;margin-right:5px"><img id="thumbimage-' + id + '"></div>'+
		'<div style="display:inline-block;width:' + thumbnailSize + 'px;margin-left:5px"><img width="' + thumbnailSize + '" height="' + thumbnailSize + '" id="previewimage-' + id + '"></div>'+
		'</div><br>');
	var thumbImage = document.getElementById('thumbimage-' + id);
	var thumbObject = imageObject.getOriginalThumb();
	thumbImage.src = thumbObject.src;
	var thumbWidth = thumbObject.width;
	var thumbHeight = thumbObject.height;
	$('#thumbimage-' + id).css({
		position : 'relative',
		left : (thumbnailSize - thumbWidth) / 2,
		top : (thumbnailSize - thumbHeight) / 2
	});
}

function showPreview(idStr) {
	var id = idStr.split('-')[1];
	var imageObject = getImageObjectById(id);
	var thumbImage = document.getElementById('previewimage-' + id);
	var previewThumb = imageObject.getPreviewThumb();
	if(previewThumb) {
		thumbImage.src = previewThumb.src;
		var previewThumbWidth = previewThumb.width;
		var previewThumbHeight = previewThumb.height;
		$(idStr).css({
			width : thumbnailSize,
			height : thumbnailSize,
			opacity : 1,
			position : "relative",
			top : (thumbnailSize - previewThumbHeight) / 2 - thumbnailSize,
			left : (thumbnailSize - previewThumbWidth) / 2
		});
	} else {
		thumbImage.src = "";
	}
}

function startLoadingPreviews() {
	clearAllPreviews();
	loadIndex = -1;
	loadNextPreview();
}

function clearAllPreviews() {
	for(var i = 0; i < imageObjects.length; i++) {
		var id = imageObjects[i].id;
		var previewThumb = document.getElementById('previewimage-' + id);
		previewThumb.src = 'images/loading-preview.jpg';
		$("#previewimage-" + id).css({
			position : 'relative',
			left : 0,
			top : 0
		});
	}
}

function loadNextPreview() {
	if(loadIndex < imageObjects.length - 1) {
		loadIndex++;
		imageObjects[loadIndex].createOutput();
		previewLoaderInterval = setTimeout(checkPreviewLoaded, 50);
	} else {
		previewLoaderInterval = null;
	}
}

function checkPreviewLoaded() {
	if(loadIndex > -1) {
		var imageObject = imageObjects[loadIndex];
		var previewThumb = imageObject.getPreviewThumb();
		var id = imageObject.id;
		var previewImage = document.getElementById('previewimage-' + id);
		if(previewThumb) {
			previewImage.src = previewThumb.src;
			var previewWidth = previewThumb.width;
			var previewHeight = previewThumb.height;
			$("#previewimage-" + id).css({
				position : 'relative',
				left : (thumbnailSize - previewWidth) / 2,
				top : (thumbnailSize - previewHeight) / 2
			});
			clearInterval(previewLoaderInterval);
			loadNextPreview();
		} else {
			previewLoaderInterval = setTimeout(checkPreviewLoaded, 50);
		}
	}
}

function settingsChanged() {
	for(var i = 0; i < imageObjects.length; i++) {
		imageObjects[i].clearOutput();
		imageObjects[i].currentUserSettings = currentUserSettings;
	}
	startLoadingPreviews();
}

//==================================================

function getImageObjectById(id) {
	for(var i = 0; i < imageObjects.length; i++) {
		if(imageObjects[i].id == id) {
			return imageObjects[i];
		}
	}
}

function createImagesData() {
	for(var i = 0; i < imageObjects.length; i++) {
		var imageObject = imageObjects[i];
		imageObject.createOutput();
	}
}

function generate() {
	zip = new JSZip();
	createImagesData();
	if(imageObjects.length > 0) {
		for(var i = 0; i < imageObjects.length; i++) {
			var imageName = imageObjects[i].name;
			zip.file(imageName, imageObjects[i].getSaveData(), {
				base64 : true
			});
		}
	}
    var content=zip.generate({type:"blob"});
    saveAs(content,'birme.zip');
	var stats='/';
	$('input[type=radio]').each(function(){
		if($(this).attr('checked')){
			stats+=$(this).attr('id')+"/";
		}
	});
	stats+=$('#widthText').val()+"/";
	stats+=$('#heightText').val()+"/";
	stats+=$('#borderWidthText').val()+"/";
	stats+=$('#qualityText').val()+"/";
	_gaq.push(['_trackPageview', stats])
}
