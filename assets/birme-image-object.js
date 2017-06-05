function BirmeImageObject(image, id, name, type) {
	this.image = image;
	// image element
	this.id = id;
	this.name = name;
	this.type = type;
	this.thumbnailSize
	this.currentUserSettings
	this.output// dataURL
	this.outputImage// image element
	this.originalThumb// BirmeThumbObject
	this.previewThumb// BirmeThumbObject
}

BirmeImageObject.prototype.createOutput = function() {
	if(!this.output) {
		var image = this.image;
		var id = this.id;
		var canvas;
		var scale;
		var canvasW;
		var canvasH;
		var srcW = image.width;
		var srcH = image.height;
		var cropPos;
		var centralisedContextX = 0;
		var centralisedContextY = 0;
		var bgFill = currentUserSettings.bg;
		var widthAfterBorder = currentUserSettings.width - currentUserSettings.borderWidth * 2;
		var heightAfterBorder = currentUserSettings.height - currentUserSettings.borderWidth * 2;
		if(currentUserSettings.resizeByPerc) {
			scale = currentUserSettings.resizePerc / 100;
			canvasW = image.width * scale + currentUserSettings.borderWidth * 2;
			canvasH = image.height * scale + currentUserSettings.borderWidth * 2;
			cropPos = {
				x : 0,
				y : 0
			};
		} else {
			if(currentUserSettings.flexible != "none") {
				switch(currentUserSettings.flexible) {
					case 'width':
						scale = heightAfterBorder / image.height;
						canvasH = currentUserSettings.height;
						canvasW = image.width * scale + parseFloat(currentUserSettings.borderWidth) * 2;
						break;
					case 'height':
						scale = widthAfterBorder / image.width;
						canvasW = currentUserSettings.width;
						canvasH = image.height * scale + parseFloat(currentUserSettings.borderWidth) * 2;
						break;
				}
				cropPos = {
					x : 0,
					y : 0
				};
			} else {
				scale = BirmeUtils.getFitScale(image.width, image.height, widthAfterBorder, heightAfterBorder, 'crop');
				var cropAlign = {
					x : currentUserSettings.xPriority,
					y : currentUserSettings.yPriority
				};
				var inverseScale = 1 / scale;
				cropPos = BirmeUtils.getCropStart(image.width * scale, image.height * scale, widthAfterBorder, heightAfterBorder, cropAlign);
				canvasW = currentUserSettings.width;
				canvasH = currentUserSettings.height;
				cropPos = {
					x : cropPos.x * inverseScale,
					y : cropPos.y * inverseScale
				};
				srcW = widthAfterBorder / scale;
				srcH = heightAfterBorder / scale;
			}
		}
		canvas = document.createElement('canvas');
		canvas.width = canvasW;
		canvas.height = canvasH;
		var context = canvas.getContext('2d');
		var srcX = cropPos.x;
		var srcY = cropPos.y;
		//border code
		if(currentUserSettings.borderWidth > 0) {
			context.strokeStyle = currentUserSettings.borderStyle;
			context.lineWidth = currentUserSettings.borderWidth;
			var borderW = currentUserSettings.borderWidth / 2;
			context.fillStyle = bgFill;
			context.beginPath();
			context.moveTo(borderW, borderW);
			context.lineTo(canvasW - borderW, borderW);
			context.lineTo(canvasW - borderW, canvasH - borderW);
			context.lineTo(borderW, canvasH - borderW);
			context.lineTo(borderW, borderW);
			context.closePath();
			context.stroke();
		}
		context.translate(currentUserSettings.borderWidth, currentUserSettings.borderWidth);
		context.scale(scale, scale);
		srcX=Math.floor(srcX);
		srcY=Math.floor(srcY);
		srcW=Math.floor(srcW);
		srcH=Math.floor(srcH);
		
		try {
			context.drawImage(image, srcX, srcY, srcW, srcH, centralisedContextX, centralisedContextY, srcW, srcH);

		} catch(e) {
			console.log(e);
		}
		var dataURL;
		if(this.type != "PNG") {
			dataURL = canvas.toDataURL("image/jpeg", currentUserSettings.quality);
		} else {
			dataURL = canvas.toDataURL("image/png", currentUserSettings.quality);
		}
		this.output = dataURL;
		this.outputImage = new Image();
		this.outputImage.src = this.output;
	}
}

BirmeImageObject.prototype.getThumbnailScale = function(image) {
	var scale = BirmeUtils.getFitScale(image.width, image.height, this.thumbnailSize, this.thumbnailSize, "contain");
	return scale;
}

BirmeImageObject.prototype.clearOutput = function() {
	this.output = null;
	this.outputImage = null;
	this.previewThumb = null;
}

BirmeImageObject.prototype.getSaveData = function() {
	return this.output.split(",")[1];
}

BirmeImageObject.prototype.getOriginalThumb = function() {
	if(!this.originalThumb) {
		var canvas = document.createElement('canvas');
		canvas.width = this.thumbnailSize;
		canvas.height = this.thumbnailSize;
		var context = canvas.getContext('2d');
		var thumbScale = this.getThumbnailScale(this.image);
		context.scale(thumbScale, thumbScale);
		context.drawImage(this.image, 0, 0);
		this.originalThumb = new BirmeThumbObject(canvas.toDataURL());
		this.originalThumb.width = this.image.width * thumbScale;
		this.originalThumb.height = this.image.height * thumbScale;
	}
	return this.originalThumb;
}

BirmeImageObject.prototype.getPreviewThumb = function() {
	if(!this.previewThumb) {
		this.createOutput();
		if(this.outputImage.width == 0) {
			return
		}
		var thumbScale = this.getThumbnailScale(this.outputImage);
		var canvas = document.createElement('canvas');
		canvas.width = this.thumbnailSize;
		canvas.height = this.thumbnailSize;
		var context = canvas.getContext('2d');
		context.scale(thumbScale, thumbScale);
		context.drawImage(this.outputImage, 0, 0);
		this.previewThumb = new BirmeThumbObject(canvas.toDataURL());
		this.previewThumb.width = this.outputImage.width * thumbScale;
		this.previewThumb.height = this.outputImage.height * thumbScale;
	}
	return this.previewThumb;
}
BirmeThumbObject = function(dataURL) {
	this.src = dataURL;
	this.height = 0;
	this.width = 0;
}