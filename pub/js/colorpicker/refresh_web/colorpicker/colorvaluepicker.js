/*
Copyright (c) 2007 John Dyer (http://johndyer.name)
MIT style license
*/

if (!window.Refresh) Refresh = {};
if (!Refresh.Web) Refresh.Web = {};

Refresh.Web.ColorValuePicker = function(id){
	
	var th = this;
	
var prop = {
	initialize: function(id) {

		th.id = id;

		th.onValuesChanged = null;

		th._hueInput = $(th.id + '_Hue');
		th._valueInput = $(th.id + '_Brightness');
		th._saturationInput = $(th.id + '_Saturation');

		th._redInput = $(th.id + '_Red');
		th._greenInput = $(th.id + '_Green');
		th._blueInput = $(th.id + '_Blue');

		th._hexInput = $(th.id + '_Hex');
		
		// HSB
		th._hueInput.onkeyup = th._onHsvKeyUp;
		th._valueInput.onkeyup,th._onHsvKeyUp;
		th._saturationInput.onkeyup = th._onHsvKeyUp;
		th._hueInput.onblur = th._onHsvBlur;
		th._valueInput.onblur = th._onHsvBlur;
		th._saturationInput.onblur = th._onHsvBlur;

		// RGB
		th._redInput.onkeyup = th._onRgbKeyUp;
		th._greenInput.onkeyup = th._onRgbKeyUp;
		th._blueInput.onkeyup = th._onRgbKeyUp;
		th._redInput.onblur = th._onRgbBlur;
		th._greenInput.onblur = th._onRgbBlur;
		th._blueInput.onblur = th._onRgbBlur;

		// HEX
		th._hexInput.onkeyup = th._onHexKeyUp;
		
		th.color = new Refresh.Web.Color();
		
		// get an initial value
		if (th._hexInput.value != '')
			th.color.setHex(th._hexInput.value);
			
			
		// set the others based on initial value
		th._hexInput.value = th.color.hex;
		
		th._redInput.value = th.color.r;
		th._greenInput.value = th.color.g;
		th._blueInput.value = th.color.b;
		
		th._hueInput.value = th.color.h;
		th._saturationInput.value = th.color.s;
		th._valueInput.value = th.color.v;		

	},
	_onHsvKeyUp: function(e) {
		if (e.target.value == '') return;
		th.validateHsv(e);
		th.setValuesFromHsv();
		if (th.onValuesChanged) th.onValuesChanged(th);
	},
	_onRgbKeyUp: function(e) {
		if (e.target.value == '') return;
		th.validateRgb(e);
		th.setValuesFromRgb();
		if (th.onValuesChanged) th.onValuesChanged(th);
	},
	_onHexKeyUp: function(e) {
		if (e.target.value == '') return;
		th.validateHex(e);
		th.setValuesFromHex();
		if (th.onValuesChanged) th.onValuesChanged(th);
	},
	_onHsvBlur: function(e) {
		if (e.target.value == '')
			th.setValuesFromRgb();
	},
	_onRgbBlur: function(e) {
		if (e.target.value == '')
			th.setValuesFromHsv();
	},
	HexBlur: function(e) {
		if (e.target.value == '')
			th.setValuesFromHsv();
	},
	validateRgb: function(e) {
		if (!th._keyNeedsValidation(e)) return e;
		th._redInput.value = th._setValueInRange(th._redInput.value,0,255);
		th._greenInput.value = th._setValueInRange(th._greenInput.value,0,255);
		th._blueInput.value = th._setValueInRange(th._blueInput.value,0,255);
	},
	validateHsv: function(e) {
		if (!th._keyNeedsValidation(e)) return e;
		th._hueInput.value = th._setValueInRange(th._hueInput.value,0,359);
		th._saturationInput.value = th._setValueInRange(th._saturationInput.value,0,100);
		th._valueInput.value = th._setValueInRange(th._valueInput.value,0,100);
	},
	validateHex: function(e) {
		if (!th._keyNeedsValidation(e)) return e;
		var hex = new String(th._hexInput.value).toUpperCase();
		hex = hex.replace(/[^A-F0-9]/g, '0');
		if (hex.length > 6) hex = hex.substring(0, 6);
		th._hexInput.value = hex;
	},
	_keyNeedsValidation: function(e) {

		if (e.keyCode == 9  || // TAB
			e.keyCode == 16  || // Shift
			e.keyCode == 38 || // Up arrow
			e.keyCode == 29 || // Right arrow
			e.keyCode == 40 || // Down arrow
			e.keyCode == 37    // Left arrow
			||
			(e.ctrlKey && (e.keyCode == 'c'.charCodeAt() || e.keyCode == 'v'.charCodeAt()) )
		) return false;

		return true;
	},
	_setValueInRange: function(value,min,max) {
		if (value == '' || isNaN(value)) 		
			return min;
		
		value = parseInt(value);
		if (value > max) 
			return max;
		if (value < min) 
			return min;
		
		return value;
	},
	setValuesFromRgb: function() {
		th.color.setRgb(th._redInput.value, th._greenInput.value, th._blueInput.value);
		th._hexInput.value = th.color.hex;
		th._hueInput.value = th.color.h;
		th._saturationInput.value = th.color.s;
		th._valueInput.value = th.color.v;
	},
	setValuesFromHsv: function() {
		th.color.setHsv(th._hueInput.value, th._saturationInput.value, th._valueInput.value);		
		
		th._hexInput.value = th.color.hex;
		th._redInput.value = th.color.r;
		th._greenInput.value = th.color.g;
		th._blueInput.value = th.color.b;
	},
	setValuesFromHex: function() {
		th.color.setHex(th._hexInput.value);

		th._redInput.value = th.color.r;
		th._greenInput.value = th.color.g;
		th._blueInput.value = th.color.b;
		
		th._hueInput.value = th.color.h;
		th._saturationInput.value = th.color.s;
		th._valueInput.value = th.color.v;
	}
}
	
	for(var k in prop)
	{
		th[k] = prop[k];
	}
	
	th.initialize(id);
	
	return th;
};
