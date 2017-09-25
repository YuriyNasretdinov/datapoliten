/*
Copyright (c) 2007 John Dyer (http://johndyer.name)
MIT style license
*/

if (!window.Refresh) Refresh = {};
if (!Refresh.Web) Refresh.Web = {};

Refresh.Web.SlidersList = [];

Refresh.Web.DefaultSliderSettings = {
	xMinValue: 0,
	xMaxValue: 100,
	yMinValue: 0,
	yMaxValue: 100,
	arrowImage: 'refresh_web/colorpicker/images/rangearrows.gif'
}


Refresh.Web.Slider = function(id, settings){
	
	this._bar = null;
	this._arrow = null;
	
	var th = this;
	
var prop = {

	initialize: function(id, settings) {
	
		th.id = id.id;
		th.settings = Object.extend(Object.extend({},Refresh.Web.DefaultSliderSettings), settings || {});

		th.xValue = 0;
		th.yValue = 0;

		// hook up controls
		th._bar = id; //$(th.id);
		

		// build controls
		th._arrow = document.createElement('img');
		th._arrow.border = 0;
		th._arrow.src = th.settings.arrowImage;
		th._arrow.margin = 0;
		th._arrow.padding = 0;
		th._arrow.style.position = 'absolute';
		th._arrow.style.top = '0px';
		th._arrow.style.left = '0px';
		document.body.appendChild(th._arrow);

		// attach 'th' to html objects
		var slider = th;
		
		th.setPositioningVariables();

		th._bar.onmousedown = th._bar_mouseDown;
		th._arrow.onmousedown = th._arrow_mouseDown;

		// set initial position
		th.setArrowPositionFromValues();

		// fire events
		if(th.onValuesChanged)
			th.onValuesChanged(th);

		// final setup
		Refresh.Web.SlidersList.push(th);
	},
	
	
	setPositioningVariables: function() {
		// calculate sizes and ranges
		// BAR

		th._barWidth = th._bar.width;
		th._barHeight = th._bar.height;
		
		var pos = cumulativeOffset(th._bar);
		th._barLeft = pos[0];
		th._barTop = pos[1];
		
		th._barBottom = th._barTop + th._barHeight;
		th._barRight = th._barLeft + th._barWidth;

		// ARROW
		//th._arrow = $(th._arrow);
		th._arrowWidth = th._arrow.width;
		th._arrowHeight = th._arrow.height;

		// MIN & MAX
		th.MinX = th._barLeft;
		th.MinY = th._barTop;

		th.MaxX = th._barRight;
		th.MinY = th._barBottom;
	},
	
	setArrowPositionFromValues: function(e) {
		th.setPositioningVariables();
		
		// sets the arrow position from XValue and YValue properties

		var arrowOffsetX = 0;
		var arrowOffsetY = 0;
		
		// X Value/Position
		if (th.settings.xMinValue != th.settings.xMaxValue) {

			if (th.xValue == th.settings.xMinValue) {
				arrowOffsetX = 0;
			} else if (th.xValue == th.settings.xMaxValue) {
				arrowOffsetX = th._barWidth-1;
			} else {

				var xMax = th.settings.xMaxValue;
				if (th.settings.xMinValue < 1)  {
					xMax = xMax + Math.abs(th.settings.xMinValue) + 1;
				}
				var xValue = th.xValue;

				if (th.xValue < 1) xValue = xValue + 1;

				arrowOffsetX = xValue / xMax * th._barWidth;

				if (parseInt(arrowOffsetX) == (xMax-1)) 
					arrowOffsetX=xMax;
				else 
					arrowOffsetX=parseInt(arrowOffsetX);

				// shift back to normal values
				if (th.settings.xMinValue < 1)  {
					arrowOffsetX = arrowOffsetX - Math.abs(th.settings.xMinValue) - 1;
				}
			}
		}
		
		// X Value/Position
		if (th.settings.yMinValue != th.settings.yMaxValue) {	
			
			if (th.yValue == th.settings.yMinValue) {
				arrowOffsetY = 0;
			} else if (th.yValue == th.settings.yMaxValue) {
				arrowOffsetY = th._barHeight-1;
			} else {
			
				var yMax = th.settings.yMaxValue;
				if (th.settings.yMinValue < 1)  {
					yMax = yMax + Math.abs(th.settings.yMinValue) + 1;
				}

				var yValue = th.yValue;

				if (th.yValue < 1) yValue = yValue + 1;

				var arrowOffsetY = yValue / yMax * th._barHeight;

				if (parseInt(arrowOffsetY) == (yMax-1)) 
					arrowOffsetY=yMax;
				else
					arrowOffsetY=parseInt(arrowOffsetY);

				if (th.settings.yMinValue < 1)  {
					arrowOffsetY = arrowOffsetY - Math.abs(th.settings.yMinValue) - 1;
				}
			}
		}

		th._setArrowPosition(arrowOffsetX, arrowOffsetY);

	},
	_setArrowPosition: function(offsetX, offsetY) {
		
		
		// validate
		if (offsetX < 0) offsetX = 0
		if (offsetX > th._barWidth) offsetX = th._barWidth;
		if (offsetY < 0) offsetY = 0
		if (offsetY > th._barHeight) offsetY = th._barHeight;	

		var posX = th._barLeft + offsetX;
		var posY = th._barTop + offsetY;

		// check if the arrow is bigger than the bar area
		if (th._arrowWidth > th._barWidth) {
			posX = posX - (th._arrowWidth/2 - th._barWidth/2);
		} else {
			posX = posX - parseInt(th._arrowWidth/2);
		}
		if (th._arrowHeight > th._barHeight) {
			posY = posY - (th._arrowHeight/2 - th._barHeight/2);
		} else {
			posY = posY - parseInt(th._arrowHeight/2);
		}
		th._arrow.style.left = posX + 'px';
		th._arrow.style.top = posY + 'px';	
	},
	_bar_mouseDown: function(e) {
		th._mouseDown(e);
	},
	
	_arrow_mouseDown: function(e) {
		th._mouseDown(e);
	},
	
	estop: function(e)
	{
		var e = e || event;
		if(e.preventDefault) e.preventDefault();
		if(e.stopPropagation) e.stopPropagation();
		e.returnValue = false;
	},
	
	_mouseDown: function(e) {
		Refresh.Web.ActiveSlider = th;
		
		th.setValuesFromMousePosition(e);
		
		document.onmousemove = th._docMouseMove;
		document.onmouseup = th._docMouseUp;		

		th.estop(e);
	},
	
	_docMouseMove: function(e) {

		th.setValuesFromMousePosition(e);
		
		th.estop(e);
	},
	
	_docMouseUp: function(e) {
		document.onmouseup = null;
		document.onmousemove = null;
		th.estop(e);
	},	
	
	setValuesFromMousePosition: function(e) {
		//th.setPositioningVariables();
		
	
		var mouse = pointer(e);
		
		var relativeX = 0;
		var relativeY = 0;

		// mouse relative to object's top left
		if (mouse.x < th._barLeft)
			relativeX = 0;
		else if (mouse.x > th._barRight)
			relativeX = th._barWidth;
		else
			relativeX = mouse.x - th._barLeft + 1;

		if (mouse.y < th._barTop)
			relativeY = 0;
		else if (mouse.y > th._barBottom)
			relativeY = th._barHeight;
		else
			relativeY = mouse.y - th._barTop + 1;
			

		var newXValue = parseInt(relativeX / th._barWidth * th.settings.xMaxValue);
		var newYValue = parseInt(relativeY / th._barHeight * th.settings.yMaxValue);
		
		// set values
		th.xValue = newXValue;
		th.yValue = newYValue;	

		// position arrow
		if (th.settings.xMaxValue == th.settings.xMinValue)
			relativeX = 0;
		if (th.settings.yMaxValue == th.settings.yMinValue)
			relativeY = 0;		
		th._setArrowPosition(relativeX, relativeY);

		// fire events
		if(th.onValuesChanged)
			th.onValuesChanged(th);
	}	

}

	for(var k in prop)
	{
		th[k] = prop[k];
	}
	
	th.initialize(id, settings);
	
	return th;

}
