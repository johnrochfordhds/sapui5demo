/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2016 SAP SE. All rights reserved
	
 */

// This file defines behavior for the control.
sap.ui.define(['jquery.sap.global', './library', 'sap/ui/core/Control'],
	function(jQuery, library, Control) {
	"use strict";

	/**
	 * The configuration of the graphic element on the chart.
	 *
	 * @param {string} [sId] id for the new control, generated automatically if no id is given
	 * @param {object} [mSettings] initial settings for the new control
	 *
	 * @class
	 * Displays parts of a whole as highlighted sectors in a pie chart.
	 * @extends sap.ui.core.Control
	 *
	 * @author SAP SE
	 * @version 1.36.12
	 *
	 * @public
	 * @alias sap.suite.ui.microchart.HarveyBallMicroChart
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var HarveyBallMicroChart = Control.extend("sap.suite.ui.microchart.HarveyBallMicroChart", /** @lends sap.suite.ui.microchart.HarveyBallMicroChart.prototype */ {
		metadata : {
			library: "sap.suite.ui.microchart",
			properties: {

				/**
				 * The total value. This is taken as 360 degrees value on the chart.
				 */
				total: {group:"Misc", type:"float", defaultValue: null},

				/**
				 * The total label. If specified, it is displayed instead of the total value.
				 */
				totalLabel: {group:"Misc", type:"string"},

				/**
				The scaling factor that is displayed next to the total value.
				*/
				totalScale: {group:"Misc", type:"string"},

				/**
				If set to true, the totalLabel parameter is considered as the combination of the total value and its scaling factor. The default value is false. It means that the total value and the scaling factor are defined separately by the total and the totalScale properties accordingly.
				*/
				formattedLabel: {group:"Misc", type:"boolean", defaultValue:false},

				/**
				If it is set to true, the total value is displayed next to the chart. The default setting is true.
				*/
				showTotal: {group:"Misc", type:"boolean", defaultValue:true},

				/**
				If it is set to true, the fraction values are displayed next to the chart. The default setting is true.
				*/
				showFractions: {group:"Misc", type:"boolean", defaultValue:true},

				/**
				The size of the chart. If it is not set, the default size is applied based on the device type.
				*/
				size: {group:"Misc", type:"sap.m.Size", defaultValue:"Auto"},

				/**
				The color palette for the chart. If this property is set, semantic colors defined in HarveyBallMicroChart are ignored. Colors from the palette are assigned to each slice consequentially. When all the palette colors are used, assignment of the colors begins from the first palette color.
				*/
				colorPalette: {type: "string[]", group : "Appearance", defaultValue : [] },

				/**
				The width of the chart. If it is not set, the size of the control is defined by the size property.
				*/
				width: {group:"Misc", type:"sap.ui.core.CSSSize"}
			},
			events: {
				/**
				 * The event is fired when the user chooses the control.
				 */
				press: {}
			},
			aggregations: {

				/**
				 * The set of points for this graphic element.
				 */
				"items": { multiple: true, type: "sap.suite.ui.microchart.HarveyBallMicroChartItem" }
			}
		}
	});

	///**
	// * This file defines behavior for the control,
	// */


	HarveyBallMicroChart.prototype.getAltText = function() {
		var sAltText = "";
		var bIsFirst = true;

		var aItems = this.getItems();
		for (var i = 0; i < aItems.length; i++) {
			var oItem = aItems[i];
			var sColor = (this.getColorPalette().length === 0) ? this._rb.getText(("SEMANTIC_COLOR_" + oItem.getColor()).toUpperCase()) : "";
			var sLabel = oItem.getFractionLabel();
			var sScale = oItem.getFractionScale();
			if (!sLabel && sScale) {
				sLabel = oItem.getFormattedLabel() ? oItem.getFraction() : oItem.getFraction() + oItem.getFractionScale().substring(0,3);
			} else if (!oItem.getFormattedLabel() && oItem.getFractionLabel()) {
				sLabel += oItem.getFractionScale().substring(0,3);
			}

			sAltText += (bIsFirst ? "" : "\n") + sLabel + " " + sColor;
			bIsFirst = false;
		}

		if (this.getTotal()) {
			var sTLabel = this.getTotalLabel();
			if (!sTLabel) {
				sTLabel = this.getFormattedLabel() ? this.getTotal() : this.getTotal() + this.getTotalScale().substring(0,3);
			} else if (!this.getFormattedLabel()) {
				sTLabel += this.getTotalScale().substring(0,3);
			}

			sAltText += (bIsFirst ? "" : "\n") + this._rb.getText("HARVEYBALLMICROCHART_TOTAL_TOOLTIP") + " " + sTLabel;
		}
		return sAltText;
	};

	HarveyBallMicroChart.prototype.getTooltip_AsString = function() {
		var oTooltip = this.getTooltip();
		var sTooltip = this.getAltText();

		if (typeof oTooltip === "string" || oTooltip instanceof String) {
			sTooltip = oTooltip.split("{AltText}").join(sTooltip).split("((AltText))").join(sTooltip);
			return sTooltip;
		}
		return oTooltip ? oTooltip : "";
	};

	HarveyBallMicroChart.prototype.init = function() {
		this._rb = sap.ui.getCore().getLibraryResourceBundle("sap.suite.ui.microchart");
		this.setTooltip("{AltText}");
		sap.ui.Device.media.attachHandler(this.rerender, this, sap.ui.Device.media.RANGESETS.SAP_STANDARD);
	};

	HarveyBallMicroChart.prototype._calculatePath = function() {
		var oSize = this.getSize();

		var fTot = this.getTotal();
		var fFrac = 0;

		if (this.getItems().length) {
			fFrac = this.getItems()[0].getFraction();
		}

		var bIsPhone = false;

		if (oSize == "Auto") {
			bIsPhone = jQuery("html").hasClass("sapUiMedia-Std-Phone");
		}

		if (oSize == "S" || oSize == "XS") {
			bIsPhone = true;
		}

		var iMeadiaSize = bIsPhone ? 56 : 72;
		var iCenter = iMeadiaSize / 2;
		// var iBorder = bIsPhone? 3 : 4;
		var iBorder = 4;
		this._oPath = {
			initial : {
				x : iCenter,
				y : iCenter,
				x1 : iCenter,
				y1 : iCenter
			},
			lineTo : {
				x : iCenter,
				y : iBorder
			},
			arc : {
				x1 : iCenter - iBorder,
				y1 : iCenter - iBorder,
				xArc : 0,
				largeArc : 0,
				sweep : 1,
				x2 : "",
				y2 : ""
			},
			size : iMeadiaSize,
			border : iBorder,
			center : iCenter
		};

		var fAngle = fFrac / fTot * 360;
		if (fAngle < 10) {
			this._oPath.initial.x -= 1.5;
			this._oPath.initial.x1 += 1.5;
			this._oPath.arc.x2 = this._oPath.initial.x1;
			this._oPath.arc.y2 = this._oPath.lineTo.y;
		} else if (fAngle > 350 && fAngle < 360) {
			this._oPath.initial.x += 1.5;
			this._oPath.initial.x1 -= 1.5;
			this._oPath.arc.x2 = this._oPath.initial.x1;
			this._oPath.arc.y2 = this._oPath.lineTo.y;
		} else {
			var fRad = Math.PI / 180.0;
			var fRadius = this._oPath.center - this._oPath.border;

			var ix = fRadius * Math.cos((fAngle - 90) * fRad) + this._oPath.center;
			var iy = this._oPath.size - (fRadius * Math.sin((fAngle + 90) * fRad) + this._oPath.center);

			this._oPath.arc.x2 = ix.toFixed(2);
			this._oPath.arc.y2 = iy.toFixed(2);
		}

		var iLargeArc = fTot / fFrac < 2 ? 1 : 0;

		this._oPath.arc.largeArc = iLargeArc;
	};

	HarveyBallMicroChart.prototype.onBeforeRendering = function() {
		this._calculatePath();
	};

	HarveyBallMicroChart.prototype.serializePieChart = function() {
		var p = this._oPath;

		return ["M", p.initial.x, ",", p.initial.y, " L", p.initial.x, ",", p.lineTo.y, " A", p.arc.x1, ",", p.arc.y1,
				" ", p.arc.xArc, " ", p.arc.largeArc, ",", p.arc.sweep, " ", p.arc.x2, ",", p.arc.y2, " L", p.initial.x1,
				",", p.initial.y1, " z"].join("");
	};

	HarveyBallMicroChart.prototype._parseFormattedValue = function(
			sValue) {
		return {
			scale: sValue.replace(/.*?([^+-.,\d]*)$/g, "$1").trim(),
			value: sValue.replace(/(.*?)[^+-.,\d]*$/g, "$1").trim()
		};
	};

	HarveyBallMicroChart.prototype.ontap = function(oEvent) {
		if (sap.ui.Device.browser.internet_explorer) {
			this.$().focus();
		}
		this.firePress();
	};

	HarveyBallMicroChart.prototype.onkeydown = function(oEvent) {
		if (oEvent.which == jQuery.sap.KeyCodes.SPACE) {
			oEvent.preventDefault();
		}
	};

	HarveyBallMicroChart.prototype.onkeyup = function(oEvent) {
		if (oEvent.which == jQuery.sap.KeyCodes.ENTER
				|| oEvent.which == jQuery.sap.KeyCodes.SPACE) {
			this.firePress();
			oEvent.preventDefault();
		}
	};

	HarveyBallMicroChart.prototype.attachEvent = function(
			sEventId, oData, fnFunction, oListener) {
		sap.ui.core.Control.prototype.attachEvent.call(this, sEventId, oData,
				fnFunction, oListener);
		if (this.hasListeners("press")) {
			this.$().attr("tabindex", 0).addClass("sapSuiteUiMicroChartPointer");
		}
		return this;
	};

	HarveyBallMicroChart.prototype.detachEvent = function(
			sEventId, fnFunction, oListener) {
		sap.ui.core.Control.prototype.detachEvent.call(this, sEventId, fnFunction,
				oListener);
		if (!this.hasListeners("press")) {
			this.$().removeAttr("tabindex").removeClass("sapSuiteUiMicroChartPointer");
		}
		return this;
	};

	HarveyBallMicroChart.prototype.exit = function(oEvent) {
		sap.ui.Device.media.detachHandler(this.rerender, this, sap.ui.Device.media.RANGESETS.SAP_STANDARD);
	};

	return HarveyBallMicroChart;

});
