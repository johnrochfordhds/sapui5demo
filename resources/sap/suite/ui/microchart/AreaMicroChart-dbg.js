/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2016 SAP SE. All rights reserved
	
 */

sap.ui.define(['jquery.sap.global', './library', 'sap/ui/core/Control'],
	function(jQuery, library, Control) {
	"use strict";

	/**
	 * Constructor for a new AreaMicroChart control.
	 *
	 * @param {string} [sId] id for the new control, generated automatically if no id is given
	 * @param {object} [mSettings] initial settings for the new control
	 *
	 * @class
	 * Chart that displays the history of values and target values as segmented lines and shows thresholds as colored background. This control replaces the deprecated sap.suite.ui.commons.MicroAreaChart.
	 * @extends sap.ui.core.Control
	 *
	 * @author SAP SE
	 * @version 1.36.12
	 *
	 * @public
	 * @alias sap.suite.ui.microchart.AreaMicroChart
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var AreaMicroChart = Control.extend("sap.suite.ui.microchart.AreaMicroChart", /** @lends sap.suite.ui.microchart.AreaMicroChart.prototype */ {
			metadata: {
				library: "sap.suite.ui.microchart",
				properties: {
					/**
					 * The width of the chart.
					 */
					width: {type: "sap.ui.core.CSSSize", group : "Misc", defaultValue : null},

					/**
					 * The height of the chart.
					 */
					height: {type: "sap.ui.core.CSSSize", group : "Misc", defaultValue : null},

					/**
					 * If this property is set it indicates the value X axis ends with.
					 */
					maxXValue: {type: "float", group : "Misc", defaultValue : null},

					/**
					 * If this property is set it indicates the value X axis ends with.
					 */
					minXValue: {type : "float", group : "Misc", defaultValue : null},

					/**
					 * If this property is set it indicates the value X axis ends with.
					 */
					maxYValue: {type: "float", group : "Misc", defaultValue : null},

					/**
					 * If this property is set it indicates the value X axis ends with.
					 */
					minYValue: {type: "float", group : "Misc", defaultValue : null},

					/**
					 * The view of the chart.
					 */
					view: {type: "sap.suite.ui.microchart.AreaMicroChartViewType", group : "Appearance", defaultValue : "Normal"},

					/**
					 * The color palette for the chart. If this property is set,
					 * semantic colors defined in AreaMicroChartItem are ignored.
					 * Colors from the palette are assigned to each line consequentially.
					 * When all the palette colors are used, assignment of the colors begins
					 * from the first palette color.
					 */
					colorPalette: {type: "string[]", group : "Appearance", defaultValue : [] }
				},
				events : {

					/**
					 * The event is fired when the user chooses the micro area chart.
					 */
					press: {}

				},
				aggregations: {
					/**
					 * The configuration of the actual values line.
					 * The color property defines the color of the line.
					 * Points are rendered in the same sequence as in this aggregation.
					 */
					chart: { multiple: false, type: "sap.suite.ui.microchart.AreaMicroChartItem" },

					/**
					 * The configuration of the max threshold area. The color property defines the color of the area above the max threshold line. Points are rendered in the same sequence as in this aggregation.
					 */
					maxThreshold: { multiple: false, type: "sap.suite.ui.microchart.AreaMicroChartItem" },

					/**
					 * The configuration of the upper line of the inner threshold area. The color property defines the color of the area between inner thresholds. For rendering of the inner threshold area, both innerMaxThreshold and innerMinThreshold aggregations must be defined. Points are rendered in the same sequence as in this aggregation.
					 */
					innerMaxThreshold: { multiple: false, type: "sap.suite.ui.microchart.AreaMicroChartItem" },

					/**
					 * The configuration of the bottom line of the inner threshold area. The color property is ignored. For rendering of the inner threshold area, both innerMaxThreshold and innerMinThreshold aggregations must be defined. Points are rendered in the same sequence as in this aggregation.
					 */
					innerMinThreshold: { multiple: false, type: "sap.suite.ui.microchart.AreaMicroChartItem" },

					/**
					 * The configuration of the min threshold area. The color property defines the color of the area below the min threshold line. Points are rendered in the same sequence as in this aggregation.
					 */
					minThreshold: { multiple: false, type: "sap.suite.ui.microchart.AreaMicroChartItem" },

					/**
					 * The configuration of the target values line. The color property defines the color of the line. Points are rendered in the same sequence as in this aggregation.
					 */
					target: { multiple: false, type: "sap.suite.ui.microchart.AreaMicroChartItem" },

					/**
					 * The label on X axis for the first point of the chart.
					 */
					firstXLabel: { multiple: false, type: "sap.suite.ui.microchart.AreaMicroChartLabel" },

					/**
					 * The label on Y axis for the first point of the chart.
					 */
					firstYLabel: { multiple: false, type: "sap.suite.ui.microchart.AreaMicroChartLabel" },

					/**
					 * The label on X axis for the last point of the chart.
					 */
					lastXLabel: { multiple: false, type: "sap.suite.ui.microchart.AreaMicroChartLabel" },

					/**
					 * The label on Y axis for the last point of the chart.
					 */
					lastYLabel: { multiple: false, type: "sap.suite.ui.microchart.AreaMicroChartLabel" },

					/**
					 * The label for the maximum point of the chart.
					 */
					maxLabel: { multiple: false, type: "sap.suite.ui.microchart.AreaMicroChartLabel" },

					/**
					 * The label for the minimum point of the chart.
					 */
					minLabel: { multiple: false, type: "sap.suite.ui.microchart.AreaMicroChartLabel" },

					/**
					 * The set of lines.
					 */
					lines: { multiple: true, type: "sap.suite.ui.microchart.AreaMicroChartItem" }
				}

		}
	});

	AreaMicroChart.prototype.init = function(){
		this._oRb = sap.ui.getCore().getLibraryResourceBundle("sap.suite.ui.microchart");
		this.setTooltip("{AltText}");
	};

	AreaMicroChart.prototype._getCssValues = function() {
		this._cssHelper.className = Array.prototype.slice.call(arguments).join(" ");
		var oCsses = window.getComputedStyle(this._cssHelper);

		if (oCsses.backgroundColor == undefined) {
			oCsses.backgroundColor = oCsses["background-color"];
		}

		if (oCsses.outlineStyle == undefined) {
			oCsses.outlineStyle = oCsses["outline-style"];
		}

		if (oCsses.outlineWidth == undefined) {
			oCsses.outlineWidth = oCsses["outline-width"];
		}
		return oCsses;
	};

	AreaMicroChart.prototype.__fillThresholdArea = function(c, aPoints1, aPoints2, color) {
		c.beginPath();
		c.moveTo(aPoints1[0].x, aPoints1[0].y);

		for (var i = 1, length = aPoints1.length; i < length; i++) {
			c.lineTo(aPoints1[i].x, aPoints1[i].y);
		}

		for (var j = aPoints2.length - 1; j >= 0 ; j--) {
			c.lineTo(aPoints2[j].x, aPoints2[j].y);
		}

		c.closePath();

		c.fillStyle = "white";
		c.fill();

		c.fillStyle = color;
		c.fill();

		c.lineWidth = 1;
		c.strokeStyle = "white";
		c.stroke();

		c.strokeStyle = color;
		c.stroke();
	};

	AreaMicroChart.prototype._renderDashedLine = function(c, aPoints, d, aDashes) {
		if (c.setLineDash) {
			c.setLineDash(aDashes);
			this._renderLine(c, aPoints, d);
			c.setLineDash([]);
		} else {
			c.beginPath();
			for (var i = 0, length = aPoints.length - 1; i < length; i++) {
				c._dashedLine(aPoints[i].x, aPoints[i].y, aPoints[i + 1].x, aPoints[i + 1].y, aDashes);
			}
			c.stroke();
		}
	};

	AreaMicroChart.prototype._renderLine = function(c, aPoints, d) {
		c.beginPath();
		c.moveTo(aPoints[0].x, aPoints[0].y);

		for (var i = 1, length = aPoints.length; i < length; i++) {
			c.lineTo(aPoints[i].x, aPoints[i].y);
		}

		c.stroke();
	};

	AreaMicroChart.prototype._renderTarget = function(c, d) {
		if (d.target.length > 1) {
			var oCsses = this._getCssValues("sapSuiteAmcTarget", this.getTarget().getColor());
			c.strokeStyle = oCsses.color;
			c.lineWidth = parseFloat(oCsses.width);

			if (oCsses.outlineStyle == "dotted") {
				this._renderDashedLine(c, d.target, d, [parseFloat(oCsses.outlineWidth), 3]);
			} else {
				this._renderLine(c, d.target, d);
			}
		} else if (d.target.length == 1) {
			jQuery.sap.log.warning("Target is not rendered because only 1 point was given");
		}
	};

	AreaMicroChart.prototype._renderThresholdLine = function(c, aPoints, d) {
		if (aPoints && aPoints.length) {
			var oCsses = this._getCssValues("sapSuiteAmcThreshold");

			c.strokeStyle = oCsses.color;
			c.lineWidth = oCsses.width;
			this._renderLine(c, aPoints, d);
		}
	};

	AreaMicroChart.prototype._fillMaxThreshold = function(c, d) {
		if (d.maxThreshold.length > 1) {
			var oCsses = this._getCssValues("sapSuiteAmcThreshold", this.getMaxThreshold().getColor());
			this.__fillThresholdArea(c, d.maxThreshold, [
				{x: d.maxThreshold[0].x, y: d.minY},
				{x: d.maxThreshold[d.maxThreshold.length - 1].x, y: d.minY}
			], oCsses.backgroundColor);
			this._renderThresholdLine(c, d.maxThreshold, d);
		} else if (d.maxThreshold.length == 1) {
			jQuery.sap.log.warning("Max Threshold is not rendered because only 1 point was given");
		}
	};

	AreaMicroChart.prototype._fillMinThreshold = function(c, d) {
		if (d.minThreshold.length > 1) {
			var oCsses = this._getCssValues("sapSuiteAmcThreshold", this.getMinThreshold().getColor());
			this.__fillThresholdArea(c, d.minThreshold, [
				{x: d.minThreshold[0].x, y: d.maxY},
				{x: d.minThreshold[d.minThreshold.length - 1].x, y: d.maxY}
			], oCsses.backgroundColor);
		} else if (d.minThreshold.length == 1) {
			jQuery.sap.log.warning("Min Threshold is not rendered because only 1 point was given");
		}
	};

	AreaMicroChart.prototype._fillThresholdArea = function(c, d) {
		if (d.minThreshold.length > 1 && d.maxThreshold.length > 1) {
			var oCsses = this._getCssValues("sapSuiteAmcThreshold", "Critical");

			this.__fillThresholdArea(c, d.maxThreshold, d.minThreshold, oCsses.backgroundColor);
		}
	};

	AreaMicroChart.prototype._fillInnerThresholdArea = function(c, d) {
		if (d.innerMinThreshold.length > 1 && d.innerMaxThreshold.length > 1) {
			var oCsses = this._getCssValues("sapSuiteAmcThreshold", this.getInnerMaxThreshold().getColor());

			this.__fillThresholdArea(c, d.innerMaxThreshold, d.innerMinThreshold, oCsses.backgroundColor);
		} else if (d.innerMinThreshold.length || d.innerMaxThreshold.length) {
			jQuery.sap.log.warning("Inner threshold area is not rendered because inner min and max threshold were not correctly set");
		}
	};

	AreaMicroChart.prototype._renderChart = function(c, d) {
		if (d.chart.length > 1) {
			var oCsses = this._getCssValues("sapSuiteAmcChart", this.getChart().getColor());
			c.strokeStyle = oCsses.color;
			c.lineWidth = parseFloat(oCsses.width);

			this._renderLine(c, d.chart, d);
		} else if (d.chart.length == 1) {
			jQuery.sap.log.warning("Actual values are not rendered because only 1 point was given");
		}
	};

	AreaMicroChart.prototype._renderLines = function(c, d) {
		var iCpLength = this.getColorPalette().length;
		var iCpIndex = 0;
		var that = this;

		var fnNextColor = function() {
			if (iCpLength) {
				if (iCpIndex == iCpLength) {
					iCpIndex = 0;
				}
				return that.getColorPalette()[iCpIndex++];
			}
		};

		var oCsses = this._getCssValues("sapSuiteAmcLine");
		c.lineWidth = parseFloat(oCsses.width);

		var iLength = d.lines.length;
		for (var i = 0; i < iLength; i++) {
			if (d.lines[i].length > 1) {
				if (iCpLength) {
					c.strokeStyle = fnNextColor();
				} else {
					oCsses = this._getCssValues("sapSuiteAmcLine", this.getLines()[i].getColor());
					c.strokeStyle = oCsses.color;
				}
				this._renderLine(c, d.lines[i], d);
			}
		}
	};

	AreaMicroChart.prototype._renderCanvas = function() {
		this._cssHelper = document.getElementById(this.getId() + "-css-helper");

		var sLabelsWidth = this.$().find(".sapSuiteAmcSideLabels").css("width");
		this.$().find(".sapSuiteAmcCanvas, .sapSuiteAmcLabels").css("right", sLabelsWidth).css("left", sLabelsWidth);

		var canvas = document.getElementById(this.getId() + "-canvas");
		var canvasSettings = window.getComputedStyle(canvas);

		var fWidth = parseFloat(canvasSettings.width);
		canvas.setAttribute("width", fWidth ? fWidth : 360);

		var fHeight = parseFloat(canvasSettings.height);
		canvas.setAttribute("height", fHeight ? fHeight : 242);

		var c = canvas.getContext("2d");

		c.lineJoin = "round";

		c._dashedLine = function(x, y, x2, y2, dashArray) {
			var dashCount = dashArray.length;
			this.moveTo(x, y);
			var dx = (x2 - x), dy = (y2 - y);
			var slope = dx ? dy / dx : 1e15;
			var distRemaining = Math.sqrt(dx * dx + dy * dy);
			var dashIndex = 0, draw = true;
			while (distRemaining >= 0.1) {
				var dashLength = dashArray[dashIndex++ % dashCount];
				if (dashLength > distRemaining) {
					dashLength = distRemaining;
				}
				var xStep = Math.sqrt(dashLength * dashLength / (1 + slope * slope));
				if (dx < 0) {
					xStep = -xStep;
				}
				x += xStep;
				y += slope * xStep;
				this[draw ? 'lineTo' : 'moveTo'](x, y);
				distRemaining -= dashLength;
				draw = !draw;
			}
		};
		var d = this._calculateDimensions(canvas.width, canvas.height);

		this._fillMaxThreshold(c, d);
		this._fillMinThreshold(c, d);
		this._fillThresholdArea(c, d);
		this._renderThresholdLine(c, d.minThreshold, d);
		this._renderThresholdLine(c, d.maxThreshold, d);
		this._fillInnerThresholdArea(c, d);
		this._renderThresholdLine(c, d.innerMinThreshold, d);
		this._renderThresholdLine(c, d.innerMaxThreshold, d);
		this._renderTarget(c, d);
		this._renderChart(c, d);
		this._renderLines(c, d);
	};

	/**
	 *
	 *
	 * @param fWidth
	 * @param fHeight
	 * @returns {object}
	 */
	AreaMicroChart.prototype._calculateDimensions = function(fWidth, fHeight) {
		var maxX, maxY, minX, minY;
		maxX = maxY = minX = minY = undefined;
		var that = this;

		function calculateExtremums() {
			if (!that._isMinXValue || !that._isMaxXValue || !that._isMinYValue || !that._isMaxYValue) {
				var lines = that.getLines();
				if (that.getMaxThreshold()) {
					lines.push(that.getMaxThreshold());
				}

				if (that.getMinThreshold()) {
					lines.push(that.getMinThreshold());
				}

				if (that.getChart()) {
					lines.push(that.getChart());
				}

				if (that.getTarget()) {
					lines.push(that.getTarget());
				}

				if (that.getInnerMaxThreshold()) {
					lines.push(that.getInnerMaxThreshold());
				}

				if (that.getInnerMinThreshold()) {
					lines.push(that.getInnerMinThreshold());
				}

				for (var i = 0, numOfLines = lines.length; i < numOfLines; i++) {
					var aPoints = lines[i].getPoints();

					for (var counter = 0, a = aPoints.length; counter < a; counter++) {
						var tmpVal = aPoints[counter].getXValue();
						if (tmpVal > maxX || maxX === undefined) {
							maxX = tmpVal;
						}
						if (tmpVal < minX || minX === undefined) {
							minX = tmpVal;
						}

						tmpVal = aPoints[counter].getYValue();
						if (tmpVal > maxY || maxY === undefined) {
							maxY = tmpVal;
						}
						if (tmpVal < minY || minY === undefined) {
							minY = tmpVal;
						}
					}
				}
			}
			if (that._isMinXValue) {
				minX = that.getMinXValue();
			}

			if (that._isMaxXValue) {
				maxX = that.getMaxXValue();
			}

			if (that._isMinYValue) {
				minY = that.getMinYValue();
			}

			if (that._isMaxYValue) {
				maxY = that.getMaxYValue();
			}
		}

		calculateExtremums();

		var oResult = {
			minY: 0,
			minX: 0,
			maxY: fHeight,
			maxX: fWidth,
			lines: []
		};

		var kx;
		var fDeltaX = maxX - minX;

		if (fDeltaX > 0) {
			kx = fWidth / fDeltaX;
		} else if (fDeltaX == 0) {
			kx = 0;
			oResult.maxX /= 2;
		} else {
			jQuery.sap.log.warning("Min X is more than max X");
		}

		var ky;
		var fDeltaY = maxY - minY;

		if (fDeltaY > 0) {
			ky = fHeight / (maxY - minY);
		} else if (fDeltaY == 0) {
			ky = 0;
			oResult.maxY /= 2;
		} else {
			jQuery.sap.log.warning("Min Y is more than max Y");
		}

		function calculateCoordinates(line) {
			var bRtl = sap.ui.getCore().getConfiguration().getRTL();

			var fnCalcX = function(fValue) {
				var x = kx * (fValue - minX);

				if (bRtl) {
					x = oResult.maxX - x;
				}
				return x;
			};

			var fnCalcY = function(fValue) {
				return oResult.maxY - ky * (fValue - minY);
			};

			var aResult = [];
			if (line && kx != undefined && ky != undefined) {
				var aPoints = line.getPoints();
				var iLength = aPoints.length;
				var xi, yi, tmpXValue, tmpYValue;

				if (iLength == 1) {
					tmpXValue = aPoints[0].getXValue();
					tmpYValue = aPoints[0].getYValue();

					if (tmpXValue == undefined ^ tmpYValue == undefined) {
						var xn, yn;
						if (tmpXValue == undefined) {
							yn = yi = fnCalcY(tmpYValue);
							xi = oResult.minX;
							xn = oResult.maxX;
						} else {
							xn = xi = fnCalcX(tmpXValue);
							yi = oResult.minY;
							yn = oResult.maxY;
						}

						aResult.push({x: xi, y: yi}, {x: xn, y: yn});
					} else {
						jQuery.sap.log.warning("Point with coordinates [" + tmpXValue + " " + tmpYValue + "] ignored");
					}
				} else {
					for (var i = 0; i < iLength; i++) {
						tmpXValue = aPoints[i].getXValue();
						tmpYValue = aPoints[i].getYValue();

						if (tmpXValue != undefined && tmpYValue != undefined) {
							xi = fnCalcX(tmpXValue);
							yi = fnCalcY(tmpYValue);

							aResult.push({x: xi, y: yi});
						} else {
							jQuery.sap.log.warning("Point with coordinates [" + tmpXValue + " " + tmpYValue + "] ignored");
						}
					}
				}
			}
			return aResult;
		}

		oResult.maxThreshold = calculateCoordinates(that.getMaxThreshold());
		oResult.minThreshold = calculateCoordinates(that.getMinThreshold());
		oResult.chart = calculateCoordinates(that.getChart());
		oResult.target = calculateCoordinates(that.getTarget());
		oResult.innerMaxThreshold = calculateCoordinates(that.getInnerMaxThreshold());
		oResult.innerMinThreshold = calculateCoordinates(that.getInnerMinThreshold());

		var iLength = that.getLines().length;
		for (var i = 0; i < iLength; i++) {
			oResult.lines.push(calculateCoordinates(that.getLines()[i]));
		}
		return oResult;
	};

	/**
	 * Property setter for the Min X value
	 *
	 * @param {int} value - new value Min X
	 * @param {boolean} bSuppressInvalidate - Suppress in validate
	 * @returns {void}
	 * @public
	 */
	AreaMicroChart.prototype.setMinXValue = function(value, bSuppressInvalidate) {
		this._isMinXValue = this._isNumber(value);

		return this.setProperty("minXValue", this._isMinXValue ? value : NaN, bSuppressInvalidate);
	};

	/**
	 * Property setter for the Max X value
	 *
	 * @param {int} value - new value Max X
	 * @param {boolean} bSuppressInvalidate - Suppress in validate
	 * @returns {void}
	 * @public
	 */
	AreaMicroChart.prototype.setMaxXValue = function(value, bSuppressInvalidate) {
		this._isMaxXValue = this._isNumber(value);

		return this.setProperty("maxXValue", this._isMaxXValue ? value : NaN, bSuppressInvalidate);
	};

	/**
	 * Property setter for the Min Y value
	 *
	 * @param {value} value - new value Min Y
	 * @param {boolean} bSuppressInvalidate - Suppress in validate
	 * @returns {void}
	 * @public
	 */
	AreaMicroChart.prototype.setMinYValue = function(value, bSuppressInvalidate) {
		this._isMinYValue = this._isNumber(value);

		return this.setProperty("minYValue", this._isMinYValue ? value : NaN, bSuppressInvalidate);
	};

	/**
	 * Property setter for the Max Y valye
	 *
	 * @param {string} value - new value Max Y
	 * @param {boolean} bSuppressInvalidate - Suppress in validate
	 * @returns {void}
	 * @public
	 */
	AreaMicroChart.prototype.setMaxYValue = function(value, bSuppressInvalidate) {
		this._isMaxYValue = this._isNumber(value);

		return this.setProperty("maxYValue", this._isMaxYValue ? value : NaN, bSuppressInvalidate);
	};

	AreaMicroChart.prototype._isNumber = function(n) {
		return typeof n === 'number' && !isNaN(n) && isFinite(n);
	};

	AreaMicroChart.prototype.onAfterRendering = function() {
		this._renderCanvas();
	};

	AreaMicroChart.prototype.ontap = function(oEvent) {
		if (sap.ui.Device.browser.internet_explorer) {
			this.$().focus();
		}
		this.firePress();
	};

	AreaMicroChart.prototype.onkeydown = function(oEvent) {
		if (oEvent.which == jQuery.sap.KeyCodes.SPACE) {
			oEvent.preventDefault();
		}
	};

	AreaMicroChart.prototype.onkeyup = function(oEvent) {
		if (oEvent.which == jQuery.sap.KeyCodes.ENTER || oEvent.which == jQuery.sap.KeyCodes.SPACE) {
			this.firePress();
			oEvent.preventDefault();
		}
	};

	AreaMicroChart.prototype.attachEvent = function(sEventId, oData, fnFunction, oListener) {
		sap.ui.core.Control.prototype.attachEvent.call(this, sEventId, oData, fnFunction, oListener);

		if (this.hasListeners("press")) {
			this.$().attr("tabindex", 0).addClass("sapSuiteUiMicroChartPointer");
		}

		return this;
	};

	AreaMicroChart.prototype.detachEvent = function(sEventId, fnFunction, oListener) {
		sap.ui.core.Control.prototype.detachEvent.call(this, sEventId, fnFunction, oListener);

		if (!this.hasListeners("press")) {
			this.$().removeAttr("tabindex").removeClass("sapSuiteUiMicroChartPointer");
		}
		return this;
	};

	AreaMicroChart.prototype._getLocalizedColorMeaning = function(sColor) {
		return this._oRb.getText(("SEMANTIC_COLOR_" + sColor).toUpperCase());
	};

	AreaMicroChart.prototype.getAltText = function() {
		var sAltText = "";
		var oFirstXLabel = this.getFirstXLabel();
		var oFirstYLabel = this.getFirstYLabel();
		var oLastXLabel = this.getLastXLabel();
		var oLastYLabel = this.getLastYLabel();
		var oMinLabel = this.getMinLabel();
		var oMaxLabel = this.getMaxLabel();
		var oActual = this.getChart();
		var oTarget = this.getTarget();
		var bIsFirst = true;
		if (oFirstXLabel && oFirstXLabel.getLabel() || oFirstYLabel && oFirstYLabel.getLabel()) {
			sAltText += (bIsFirst ? "" : "\n") + this._oRb.getText(("AREAMICROCHART_START")) + ": " + (oFirstXLabel ? oFirstXLabel.getLabel() : "") + " " + (oFirstYLabel ? oFirstYLabel.getLabel()  + " " + this._getLocalizedColorMeaning(oFirstYLabel.getColor()) : "");
			bIsFirst = false;
		}
		if (oLastXLabel && oLastXLabel.getLabel() || oLastYLabel && oLastYLabel.getLabel()) {
			sAltText += (bIsFirst ? "" : "\n") + this._oRb.getText(("AREAMICROCHART_END")) + ": " + (oLastXLabel ? oLastXLabel.getLabel() : "") + " " + (oLastYLabel ? oLastYLabel.getLabel()  + " " + this._getLocalizedColorMeaning(oLastYLabel.getColor()) : "");
			bIsFirst = false;
		}
		if (oMinLabel && oMinLabel.getLabel()) {
			sAltText += (bIsFirst ? "" : "\n") + this._oRb.getText(("AREAMICROCHART_MINIMAL_VALUE")) + ": " + oMinLabel.getLabel() + " " + this._getLocalizedColorMeaning(oMinLabel.getColor());
			bIsFirst = false;
		}
		if (oMaxLabel && oMaxLabel.getLabel()) {
			sAltText += (bIsFirst ? "" : "\n") + this._oRb.getText(("AREAMICROCHART_MAXIMAL_VALUE")) + ": " + oMaxLabel.getLabel() + " " + this._getLocalizedColorMeaning(oMaxLabel.getColor());
			bIsFirst = false;
		}
		if (oActual && oActual.getPoints() && oActual.getPoints().length > 0) {
			sAltText += (bIsFirst ? "" : "\n") + this._oRb.getText(("AREAMICROCHART_ACTUAL_VALUES")) + ":";
			bIsFirst = false;
			var aActual = oActual.getPoints();
			for (var i = 0; i < aActual.length; i++) {
				sAltText += " " + aActual[i].getY();
			}
		}
		if (oTarget && oTarget.getPoints() && oTarget.getPoints().length > 0) {
			sAltText += (bIsFirst ? "" : "\n") + this._oRb.getText(("AREAMICROCHART_TARGET_VALUES")) + ":";
			var aTarget = oTarget.getPoints();
			for (var j = 0; j < aTarget.length; j++) {
				sAltText += " " + aTarget[j].getY();
			}
		}

		for (var k = 0; k < this.getLines().length; k++) {
			var oLine = this.getLines()[k];
			if (oLine.getPoints() && oLine.getPoints().length > 0) {
				sAltText += (bIsFirst ? "" : "\n") + oLine.getTitle() + ":";
				var aLine = oLine.getPoints();
				for (var y = 0; y < aLine.length; y++) {
					sAltText += " " + aLine[y].getY();
				}

				if (this.getColorPalette().length == 0) {
					sAltText += " " + this._getLocalizedColorMeaning(oLine.getColor());
				}
			}
		}
		return sAltText;
	};



	AreaMicroChart.prototype.getTooltip_AsString = function() {
		var oTooltip = this.getTooltip();
		var sTooltip = this.getAltText();

		if (typeof oTooltip === "string" || oTooltip instanceof String) {
			sTooltip = oTooltip.split("{AltText}").join(sTooltip).split("((AltText))").join(sTooltip);
			return sTooltip;
		}
		return oTooltip ? oTooltip : "";
	};

	AreaMicroChart.prototype.clone = function(sIdSuffix, aLocalIds, oOptions) {
		var oClone = sap.ui.core.Control.prototype.clone.apply(this, arguments);
		oClone._isMinXValue = this._isMinXValue;
		oClone._isMaxXValue = this._isMaxXValue;
		oClone._isMinYValue = this._isMinYValue;
		oClone._isMaxYValue = this._isMaxYValue;
		return oClone;
	};
	return AreaMicroChart;

});