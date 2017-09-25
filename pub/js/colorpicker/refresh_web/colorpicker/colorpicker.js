/*
Copyright (c) 2007 John Dyer (http://johndyer.name)
MIT style license
*/

if (!window.Refresh) Refresh = {};
if (!Refresh.Web) Refresh.Web = {};

Refresh.Web.DefaultColorPickerSettings = {
	startMode:'h',
	startHex:'ff0000',
	clientFilesPath: 'refresh_web/colorpicker/images/'
};

Refresh.Web.ColorPicker = function(id, settings){
	
	var th = this;
	
	var prop = {

	initialize: function(id, settings) {
		th.id = id;
		th.settings = Object.extend(Object.extend({},Refresh.Web.DefaultColorPickerSettings), settings || {});

		// attach radio & check boxes
		th._hueRadio = $(th.id + '_HueRadio');
		th._saturationRadio = $(th.id + '_SaturationRadio');
		th._valueRadio = $(th.id + '_BrightnessRadio');
		
		th._redRadio = $(th.id + '_RedRadio');
		th._greenRadio = $(th.id + '_GreenRadio');
		th._blueRadio = $(th.id + '_BlueRadio');
		//th._webSafeCheck = $(th.id + '_WebSafeCheck');

		th._hueRadio.value = 'h';
		th._saturationRadio.value = 's';
		th._valueRadio.value = 'v';
		
		th._redRadio.value = 'r';
		th._greenRadio.value = 'g';
		th._blueRadio.value = 'b';

		// attach events to radio & checks

		th._hueRadio.onclick = th._onRadioClicked;
		th._saturationRadio.onclick = th._onRadioClicked;
		th._valueRadio,'click', th._onRadioClicked;
		
		th._redRadio.onclick = th._onRadioClicked;
		th._greenRadio.onclick = th._onRadioClicked;
		th._blueRadio.onclick = th._onRadioClicked;

		//th._event_webSafeClicked = th._onWebSafeClicked.bindAsEventListener(th);
		//Event.observe( th._webSafeCheck, 'click', th._event_webSafeClicked);


		// attach simple properties
		th._preview = $(th.id + '_Preview');
		
		
		// MAP
		th._mapBase = $(th.id + '_ColorMap');
		th._mapBase.style.width = '256px';
		th._mapBase.style.height = '256px';
		th._mapBase.style.padding = 0;
		th._mapBase.style.margin = 0;
		th._mapBase.style.border = 'solid 1px #000';
		
		th._mapL1 = new Element('img',{src:th.settings.clientFilesPath + 'blank.gif', width:256, height:256,  id: th.id + '_mapL1'} ); //'blank.gif'});
		th._mapL1.style.margin = '0px';
		th._mapBase.appendChild(th._mapL1);				
	
		th._mapL2 = new Element('img',{src:th.settings.clientFilesPath + 'blank.gif', width:256, height:256,  id: th.id + '_mapL2'} ); //'blank.gif'});
		th._mapBase.appendChild(th._mapL2);
		th._mapL2.style.clear = 'both';
		th._mapL2.style.margin = '-256px 0px 0px 0px';
		setOpacity(th._mapL2, .5);
		
		
		// BAR
		th._bar = $(th.id + '_ColorBar');
		
		th._bar.style.width = '20px';
		th._bar.style.height = '256px';
		th._bar.style.padding = 0;
		th._bar.style.margin = '0px 10px';
		th._bar.style.border = 'solid 1px #000';		
		
		th._barL1 = new Element('img',{src:th.settings.clientFilesPath + 'blank.gif', width:20, height:256,  id: th.id + '_barL1'});
		th._barL1.style.margin = '0px';
		th._bar.appendChild(th._barL1);			

		th._barL2 = new Element('img',{src:th.settings.clientFilesPath + 'blank.gif', width:20, height:256,  id: th.id + '_barL2'} );
		th._barL2.style.margin = '-256px 0px 0px 0px';
		th._bar.appendChild(th._barL2);
		
		th._barL3 = new Element('img',{src:th.settings.clientFilesPath + 'blank.gif', width:20, height:256, id: th.id + '_barL3'} );
		th._barL3.style.margin = '-256px 0px 0px 0px';
		th._barL3.style.backgroundColor = '#ff0000';
		th._bar.appendChild(th._barL3);
		
		th._barL4 = new Element('img',{src:th.settings.clientFilesPath + 'bar-brightness.png', width:20, height:256, id: th.id + '_barL4'} );
		th._barL4.style.margin = '-256px 0px 0px 0px';
		th._bar.appendChild(th._barL4);				
		
		// attach map slider
		th._map = new Refresh.Web.Slider(th._mapL2, {xMaxValue: 255, yMinValue: 255, arrowImage: th.settings.clientFilesPath + 'mappoint.gif'});

		// attach color slider
		th._slider = new Refresh.Web.Slider(th._barL4, {xMinValue: 1,xMaxValue: 1, yMinValue: 255, arrowImage: th.settings.clientFilesPath + 'rangearrows.gif'});;

		// attach color values
		th._cvp = new Refresh.Web.ColorValuePicker(th.id);

		// link up events
		var cp = th;
		
		th._slider.onValuesChanged = function() { cp.sliderValueChanged() };
		th._map.onValuesChanged = function() { cp.mapValueChanged(); }
		th._cvp.onValuesChanged = function() { cp.textValuesChanged(); }

		// browser!
		th.isLessThanIE7 = false;
		var version = parseFloat(navigator.appVersion.split("MSIE")[1]);
		if ((version < 7) && (document.body.filters))
			th.isLessThanIE7 = true;
		

		// initialize values
		th.setColorMode(th.settings.startMode);
		if (th.settings.startHex)
			th._cvp._hexInput.value = th.settings.startHex;
		th._cvp.setValuesFromHex();
		th.positionMapAndSliderArrows();
		th.updateVisuals();
		
		th.color = null;
	},
	show: function() {
		th._map.Arrow.style.display = '';
		th._slider.Arrow.style.display = '';
		th._map.setPositioningVariables();
		th._slider.setPositioningVariables();
		th.positionMapAndSliderArrows();
	},
	hide: function() {
		th._map.Arrow.style.display = 'none';
		th._slider.Arrow.style.display = 'none';
	},
	_onRadioClicked: function(e) {
		var e = e || event;
		th.setColorMode((e.target || e.srcElement).value);
	},
	_onWebSafeClicked: function(e) {
		// reset
		th.setColorMode(th.ColorMode);
	},
	textValuesChanged: function() {
		th.positionMapAndSliderArrows();
		th.updateVisuals();
	},
	setColorMode: function(colorMode) {

		th.color = th._cvp.color;
		
		// reset all images		
		function resetImage(cp, img) {
			cp.setAlpha(img, 100);	
			img.style.backgroundColor = '';
			img.src = cp.settings.clientFilesPath + 'blank.gif';
			img.style.filter = '';
		}
		resetImage(th, th._mapL1);
		resetImage(th, th._mapL2);
		resetImage(th, th._barL1);
		resetImage(th, th._barL2);
		resetImage(th, th._barL3);
		resetImage(th, th._barL4);

		th._hueRadio.checked = false;
		th._saturationRadio.checked = false;
		th._valueRadio.checked = false;
		th._redRadio.checked = false;
		th._greenRadio.checked = false;
		th._blueRadio.checked = false;
	

		switch (colorMode) {
			case 'h':
				th._hueRadio.checked = true;

				// MAP
				// put a color layer on the bottom
				th._mapL1.style.backgroundColor = '#' + th.color.hex;				

				// add a hue map on the top
				th._mapL2.style.backgroundColor = 'transparent';
				th.setImg(th._mapL2, th.settings.clientFilesPath + 'map-hue.png');
				th.setAlpha(th._mapL2, 100);

				// SLIDER
				// simple hue map
				th.setImg(th._barL4,th.settings.clientFilesPath + 'bar-hue.png');

				th._map.settings.xMaxValue = 100;
				th._map.settings.yMaxValue = 100;
				th._slider.settings.yMaxValue = 359;

				break;
				
			case 's':
				th._saturationRadio.checked = true;			

				// MAP
				// bottom has saturation map
				th.setImg(th._mapL1, th.settings.clientFilesPath + 'map-saturation.png');

				// top has overlay
				th.setImg(th._mapL2, th.settings.clientFilesPath + 'map-saturation-overlay.png');
				th.setAlpha(th._mapL2,0);

				// SLIDER
				// bottom: color
				th.setBG(th._barL3, th.color.hex);
				
				// top: graduated overlay
				th.setImg(th._barL4, th.settings.clientFilesPath + 'bar-saturation.png');
				

				th._map.settings.xMaxValue = 359;
				th._map.settings.yMaxValue = 100;
				th._slider.settings.yMaxValue = 100;

				break;
				
			case 'v':
				th._valueRadio.checked = true;			

				// MAP
				// bottom: nothing
				
				// top
				th.setBG(th._mapL1,'000');
				th.setImg(th._mapL2, th.settings.clientFilesPath + 'map-brightness.png');				
				
				// SLIDER
				// bottom
				th._barL3.style.backgroundColor = '#' + th.color.hex;
				
				// top				
				th.setImg(th._barL4, th.settings.clientFilesPath + 'bar-brightness.png');
				

				th._map.settings.xMaxValue = 359;
				th._map.settings.yMaxValue = 100;
				th._slider.settings.yMaxValue = 100;
				break;
				
			case 'r':
				th._redRadio.checked = true;
				th.setImg(th._mapL2, th.settings.clientFilesPath + 'map-red-max.png');
				th.setImg(th._mapL1, th.settings.clientFilesPath + 'map-red-min.png');
				
				th.setImg(th._barL4, th.settings.clientFilesPath + 'bar-red-tl.png');
				th.setImg(th._barL3, th.settings.clientFilesPath + 'bar-red-tr.png');
				th.setImg(th._barL2, th.settings.clientFilesPath + 'bar-red-br.png');
				th.setImg(th._barL1, th.settings.clientFilesPath + 'bar-red-bl.png');				
				
				break;

			case 'g':
				th._greenRadio.checked = true;
				th.setImg(th._mapL2, th.settings.clientFilesPath + 'map-green-max.png');
				th.setImg(th._mapL1, th.settings.clientFilesPath + 'map-green-min.png');
				
				th.setImg(th._barL4, th.settings.clientFilesPath + 'bar-green-tl.png');
				th.setImg(th._barL3, th.settings.clientFilesPath + 'bar-green-tr.png');
				th.setImg(th._barL2, th.settings.clientFilesPath + 'bar-green-br.png');
				th.setImg(th._barL1, th.settings.clientFilesPath + 'bar-green-bl.png');				
				
				break;
				
			case 'b':
				th._blueRadio.checked = true;
				th.setImg(th._mapL2, th.settings.clientFilesPath + 'map-blue-max.png');
				th.setImg(th._mapL1, th.settings.clientFilesPath + 'map-blue-min.png');
				
				th.setImg(th._barL4, th.settings.clientFilesPath + 'bar-blue-tl.png');
				th.setImg(th._barL3, th.settings.clientFilesPath + 'bar-blue-tr.png');
				th.setImg(th._barL2, th.settings.clientFilesPath + 'bar-blue-br.png');
				th.setImg(th._barL1, th.settings.clientFilesPath + 'bar-blue-bl.png');
				
				//th.setImg(th._barL4, th.settings.clientFilesPath + 'bar-hue.png');			
				
				break;
				
			default:
				alert('invalid mode');
				break;
		}
		
		switch (colorMode) {
			case 'h':
			case 's':
			case 'v':
			
				th._map.settings.xMinValue = 1;
				th._map.settings.yMinValue = 1;				
				th._slider.settings.yMinValue = 1;
				break;
				
			case 'r':
			case 'g':
			case 'b':
			
				th._map.settings.xMinValue = 0;
				th._map.settings.yMinValue = 0;				
				th._slider.settings.yMinValue = 0;					
				
				th._map.settings.xMaxValue = 255;
				th._map.settings.yMaxValue = 255;				
				th._slider.settings.yMaxValue = 255;	
				break;
		}
				
		th.ColorMode = colorMode;

		th.positionMapAndSliderArrows();
		
		th.updateMapVisuals();
		th.updateSliderVisuals();
	},
	mapValueChanged: function() {
		// update values

		switch(th.ColorMode) {
			case 'h':
				th._cvp._saturationInput.value = th._map.xValue;
				th._cvp._valueInput.value = 100 - th._map.yValue;
				break;
				
			case 's':
				th._cvp._hueInput.value = th._map.xValue;
				th._cvp._valueInput.value = 100 - th._map.yValue;
				break;
				
			case 'v':
				th._cvp._hueInput.value = th._map.xValue;
				th._cvp._saturationInput.value = 100 - th._map.yValue;
				break;
								
			case 'r':
				th._cvp._blueInput.value = th._map.xValue;
				th._cvp._greenInput.value = 256 - th._map.yValue;
				break;
				
			case 'g':
				th._cvp._blueInput.value = th._map.xValue;
				th._cvp._redInput.value = 256 - th._map.yValue;
				break;
				
			case 'b':
				th._cvp._redInput.value = th._map.xValue;
				th._cvp._greenInput.value = 256 - th._map.yValue;
				break;				
		}
		
		switch(th.ColorMode) {
			case 'h':
			case 's':
			case 'v':
				th._cvp.setValuesFromHsv();
				break;
				
			case 'r':
			case 'g':
			case 'b':
				th._cvp.setValuesFromRgb();
				break;				
		}		

		
		th.updateVisuals();
	},
	sliderValueChanged: function() {
		
		switch(th.ColorMode) {
			case 'h':
				th._cvp._hueInput.value = 360 - th._slider.yValue;
				break;
			case 's':
				th._cvp._saturationInput.value = 100 - th._slider.yValue;
				break;
			case 'v':
				th._cvp._valueInput.value = 100 - th._slider.yValue;
				break;
				
			case 'r':
				th._cvp._redInput.value = 255 - th._slider.yValue;
				break;
			case 'g':
				th._cvp._greenInput.value = 255 - th._slider.yValue;
				break;
			case 'b':
				th._cvp._blueInput.value = 255 - th._slider.yValue;
				break;				
		}
		
		switch(th.ColorMode) {
			case 'h':
			case 's':
			case 'v':
				th._cvp.setValuesFromHsv();
				break;
				
			case 'r':
			case 'g':
			case 'b':
				th._cvp.setValuesFromRgb();
				break;				
		}		

		th.updateVisuals();
	},
	positionMapAndSliderArrows: function() {
		th.color = th._cvp.color;
		
		// Slider
		var sliderValue = 0;
		switch(th.ColorMode) {
			case 'h':
				sliderValue = 360 - th.color.h;
				break;
			
			case 's':
				sliderValue = 100 - th.color.s;
				break;
				
			case 'v':
				sliderValue = 100 - th.color.v;
				break;
				
			case 'r':
				sliderValue = 255- th.color.r;
				break;
			
			case 'g':
				sliderValue = 255- th.color.g;
				break;
				
			case 'b':
				sliderValue = 255- th.color.b;
				break;				
		}	
		
		th._slider.yValue = sliderValue;
		th._slider.setArrowPositionFromValues();

		// color map
		var mapXValue = 0;
		var mapYValue = 0;
		switch(th.ColorMode) {
			case 'h':
				mapXValue = th.color.s;
				mapYValue = 100 - th.color.v;
				break;
				
			case 's':
				mapXValue = th.color.h;
				mapYValue = 100 - th.color.v;
				break;
				
			case 'v':
				mapXValue = th.color.h;
				mapYValue = 100 - th.color.s;
				break;
				
			case 'r':
				mapXValue = th.color.b;
				mapYValue = 256 - th.color.g;
				break;
				
			case 'g':
				mapXValue = th.color.b;
				mapYValue = 256 - th.color.r;
				break;
				
			case 'b':
				mapXValue = th.color.r;
				mapYValue = 256 - th.color.g;
				break;				
		}
		th._map.xValue = mapXValue;
		th._map.yValue = mapYValue;
		th._map.setArrowPositionFromValues();
	},
	updateVisuals: function() {
		th.updatePreview();
		th.updateMapVisuals();
		th.updateSliderVisuals();
	},
	updatePreview: function() {
		try {
			th._preview.style.backgroundColor = '#' + th._cvp.color.hex;
			
			/* youROCK modif */
			
			var el = window.opener.document.getElementById('color');
			el.value = ('#' + th._cvp.color.hex).toLowerCase();
			el.onkeyup();
			
			/* /youROCK modif */
		} catch (e) {}
	},
	updateMapVisuals: function() {
		
		th.color = th._cvp.color;
		
		switch(th.ColorMode) {
			case 'h':
				// fake color with only hue
				var color = new Refresh.Web.Color({h:th.color.h, s:100, v:100});					
				th.setBG(th._mapL1, color.hex);
				break;
				
			case 's':
				th.setAlpha(th._mapL2, 100 - th.color.s);
				break;
				
			case 'v':
				th.setAlpha(th._mapL2, th.color.v);
				break;
				
			case 'r':								
				th.setAlpha(th._mapL2, th.color.r/256*100);
				break;
				
			case 'g':
				th.setAlpha(th._mapL2, th.color.g/256*100);
				break;
				
			case 'b':
				th.setAlpha(th._mapL2, th.color.b/256*100);
				break;				
		}
	},
	updateSliderVisuals: function() {
	
		th.color = th._cvp.color;
		
		switch(th.ColorMode) {
			case 'h':
				break;
				
			case 's':
				var saturatedColor = new Refresh.Web.Color({h:th.color.h, s:100, v:th.color.v});
				th.setBG(th._barL3, saturatedColor.hex);
				break;
				
			case 'v':
				var valueColor = new Refresh.Web.Color({h:th.color.h, s:th.color.s, v:100});
				th.setBG(th._barL3, valueColor.hex);
				break;
			case 'r':
			case 'g':				
			case 'b':
			
				var hValue = 0;
				var vValue = 0;
				
				if (th.ColorMode == 'r') {
					hValue = th._cvp._blueInput.value;
					vValue = th._cvp._greenInput.value;
				} else if (th.ColorMode == 'g') {
					hValue = th._cvp._blueInput.value;
					vValue = th._cvp._redInput.value;
				} else if (th.ColorMode == 'b') {
					hValue = th._cvp._redInput.value;
					vValue = th._cvp._greenInput.value;
				}
			
				var horzPer = (hValue /256)*100;
				var vertPer = ( vValue/256)*100;
				
				var horzPerRev = ( (256-hValue)/256)*100;
				var vertPerRev = ( (256-vValue)/256)*100;
										
				th.setAlpha(th._barL4, (vertPer>horzPerRev) ? horzPerRev : vertPer);
				th.setAlpha(th._barL3, (vertPer>horzPer) ? horzPer : vertPer); 
				th.setAlpha(th._barL2, (vertPerRev>horzPer) ? horzPer : vertPerRev);
				th.setAlpha(th._barL1, (vertPerRev>horzPerRev) ? horzPerRev : vertPerRev);
			
				break;
							
			
		}
	},
	setBG: function(el, c) {
		try {
			el.style.backgroundColor = '#' + c;
		} catch (e) {}
	},
	setImg: function(img, src) {
	
		/*if (src.indexOf('png') && th.isLessThanIE7) {
			img.pngSrc = src;
			img.src = th.settings.clientFilesPath + 'blank.gif';
			img.style.filter = 'progid:DXImageTransform.Microsoft.AlphaImageLoader(src=\'' + src + '\');';	
		
		} else {
		*/
		
			img.src = src;
		//}
	},
	setAlpha: function(obj, alpha) {
		/*if (th.isLessThanIE7 && src.indexOf('map-hue') != -1) {			
			var src = obj.pngSrc;
			// exception for the hue map
			if (src != null && src.indexOf('map-hue') == -1)
				obj.style.filter = 'progid:DXImageTransform.Microsoft.AlphaImageLoader(src=\'' + src + '\') progid:DXImageTransform.Microsoft.Alpha(opacity=' + alpha + ')';	
		} else {
		*/
		
			setOpacity(obj, alpha/100);		
		//}
	}
	
}

	for(var k in prop)
	{
		th[k] = prop[k];
	}
	
	th.initialize(id, settings);
	
	return th;
};
