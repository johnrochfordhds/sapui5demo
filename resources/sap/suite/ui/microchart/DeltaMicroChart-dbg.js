/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2016 SAP SE. All rights reserved
	
 */

// Provides control sap.suite.ui.microchart.Example.
sap.ui.define(['jquery.sap.global', './library', 'sap/ui/core/Control'],
	function(jQuery, library, Control) {
	"use strict";

	/**
	 * Constructor for a new DeltaMicroChart control.
	 *
	 * @param {string} [sId] id for the new control, generated automatically if no id is given
	 * @param {object} [mSettings] initial settings for the new control
	 *
	 * @class
	 * Represents the delta of two values as a chart. This control replaces the deprecated sap.suite.ui.commons.DeltaMicroChart.
	 * @extends sap.ui.core.Control
	 *
	 * @author SAP SE
	 * @version 1.36.12
	 *
	 * @public
	 * @alias sap.suite.ui.microchart.DeltaMicroChart
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var DeltaMicroChart = Control.extend("sap.suite.ui.microchart.DeltaMicroChart", /** @lends sap.suite.ui.microchart.DeltaMicroChart.prototype */ { metadata: {

		library: "sap.suite.ui.microchart",
		properties: {

			/**
			 * The first value for delta calculation.
			 */
			value1: {type: "float", group: "Misc", defaultValue: null},

			/**
			 * The second value for delta calculation.
			 */
			value2: {type: "float", group: "Misc", defaultValue: null},

			/**
			 * The first value title.
			 */
			title1: {type: "string", group: "Misc", defaultValue: null},

			/**
			 * The second value title.
			 */
			title2: {type: "string", group: "Misc", defaultValue: null},

			/**
			 * If this property is set, it is rendered instead of value1.
			 */
			displayValue1: {type: "string", group: "Misc", defaultValue: null},

			/**
			 * If this property is set, it is rendered instead of value2.
			 */
			displayValue2: {type: "string", group: "Misc", defaultValue: null},

			/**
			 * If this property is set, it is rendered instead of a calculated delta.
			 */
			deltaDisplayValue: {type: "string", group: "Misc", defaultValue: null},

			/**
			 * The semantic color of the delta value.
			 */
			color: {type: "sap.m.ValueColor", group: "Misc", defaultValue: "Neutral"},

			/**
			 * The width of the chart.
			 */
			width: {type: "sap.ui.core.CSSSize", group: "Misc"},

			/**
			 * The size of the chart. If is not set, the default size is applied based on the device type.
			 */
			size: {type: "sap.m.Size", group: "Misc", defaultValue: "Auto"}
		},

		events: {

			/**
			 * The event is fired when the user chooses the delta micro chart.
			 */
			press: {}

		}

	}});

	DeltaMicroChart.prototype.init = function() {
		this._oRb = sap.ui.getCore().getLibraryResourceBundle("sap.suite.ui.microchart");
		this.setTooltip("{AltText}");
	};

	DeltaMicroChart.prototype._calcChartData = function() {
		var fVal1 = this.getValue1();
		var fVal2 = this.getValue2();

		var fMin = Math.min(fVal1, fVal2, 0);
		var fMax = Math.max(fVal1, fVal2, 0);
		var fTotal = fMax - fMin;

		function calcPercent(fVal) {
			return (fTotal === 0 ?  0 : Math.abs(fVal) / fTotal * 100).toFixed(2);
		}

		var oConf = {};
		var fDelta = fVal1 - fVal2;

		oConf.delta = {
			left: fMax === 0,
			width: calcPercent(fDelta),
			isFirstStripeUp: fVal1 < fVal2,
			isMax: (fVal1 < 0 && fVal2 >= 0) || (fVal1 >= 0 && fVal2 < 0),
			isZero: fVal1 === 0 && fVal2 === 0,
			isEqual: fDelta === 0
		};

		oConf.bar1 = {
			left: fVal2 >= 0,
			width: calcPercent(fVal1),
			isSmaller: Math.abs(fVal1) < Math.abs(fVal2)
		};

		oConf.bar2 = {
			left: fVal1 >= 0,
			width: calcPercent(fVal2),
			isSmaller: Math.abs(fVal2) < Math.abs(fVal1)
		};

		return oConf;
	};

	DeltaMicroChart.prototype._getLocalizedColorMeaning = function(sColor) {
		return this._oRb.getText(("SEMANTIC_COLOR_" + sColor).toUpperCase());
	};

	/**
	 * Calculates the number of digits after the decimal point.
	 *
	 * @param {float} fValue float value
	 * @returns {int} number of digits after the decimal point in fValue.
	 * @private
	 */
	DeltaMicroChart.prototype._digitsAfterDecimalPoint = function(fValue) {
		var sAfter = ("" + fValue).match(/[.,](\d+)/g);
		return (sAfter) ? ("" + sAfter).length - 1 : 0;
	};

	DeltaMicroChart.prototype.getAltText = function() {
	    var sDv1 = this.getDisplayValue1();
	    var sDv2 = this.getDisplayValue2();
	    var sDdv = this.getDeltaDisplayValue();
		var fVal1 = this.getValue1();
		var fVal2 = this.getValue2();
		var sAdv1ToShow = sDv1 ? sDv1 : "" + fVal1;
		var sAdv2ToShow = sDv2 ? sDv2 : "" + fVal2;
		var sAddvToShow = sDdv ? sDdv : "" + Math.abs(fVal1 - fVal2).toFixed(Math.max(this._digitsAfterDecimalPoint(fVal1), this._digitsAfterDecimalPoint(fVal2)));
		var sMeaning = this._getLocalizedColorMeaning(this.getColor());

		return this.getTitle1() + " " + sAdv1ToShow + "\n" + this.getTitle2() + " " + sAdv2ToShow + "\n" +  this._oRb.getText("DELTAMICROCHART_DELTA_TOOLTIP", [sAddvToShow, sMeaning]);
	};

	DeltaMicroChart.prototype.getTooltip_AsString  = function() {
		var oTooltip = this.getTooltip();
		var sTooltip = this.getAltText();

		if (typeof oTooltip === "string" || oTooltip instanceof String) {
			sTooltip = oTooltip.split("{AltText}").join(sTooltip).split("((AltText))").join(sTooltip);
			return sTooltip;
		}
		return oTooltip ? oTooltip : "";
	};

	DeltaMicroChart.prototype._isCalcSupported = function() {
		return jQuery.sap.byId(this.getId() + "-calc").css("max-width") == "11px";
	};

	DeltaMicroChart.prototype._isRoundingSupported = function() {
		return jQuery.sap.byId(this.getId() + "-calc1").width() == 4;
	};

	DeltaMicroChart.prototype.onBeforeRendering = function() {
		this._oChartData = this._calcChartData();
	};

	DeltaMicroChart.prototype.onAfterRendering = function() {
		this._bCalc = this._isCalcSupported();
		this._bRounding = this._isRoundingSupported();

		if (!this._bCalc || !this._bRounding) {
			if (this._sResizeHandlerId) {
				sap.ui.core.ResizeHandler.deregister(this._sResizeHandlerId);
			}

		    var oChart = jQuery.sap.domById(this.getId() + "-dmc-chart");
		    this._sResizeHandlerId = sap.ui.core.ResizeHandler.register(oChart,  jQuery.proxy(this._adjust, this));

		    if (!this._bCalc) {
				this._adjustCalc();
		    }

		    if (!this._bRounding) {
				this._adjustRound();
		    }
		}
	};

	DeltaMicroChart.prototype._adjust = function() {
	    if (!this._bCalc) {
			this._adjustCalc();
	    }

	    if (!this._bRounding) {
			this._adjustRound();
	    }
	};

	DeltaMicroChart.prototype._adjustRound = function() {
		var iChartWidth = jQuery.sap.byId(this.getId() + "-dmc-chart").width();
		var iDeltaWidth = Math.round(iChartWidth * this._oChartData.delta.width / 100);

		jQuery.sap.byId(this.getId() + "-dmc-bar-delta").width(iDeltaWidth);

		if (this._oChartData.bar1.isSmaller && !this._oChartData.delta.isMax) {
			jQuery.sap.byId(this.getId() + "-dmc-bar1").width(iChartWidth - iDeltaWidth);
		}

		if (this._oChartData.bar2.isSmaller && !this._oChartData.delta.isMax) {
			jQuery.sap.byId(this.getId() + "-dmc-bar2").width(iChartWidth - iDeltaWidth);
		}
	};

	DeltaMicroChart.prototype._adjustCalc = function() {
		var iChartWidth = jQuery.sap.byId(this.getId() + "-dmc-chart").width();

		function adjustBar(oBar) {
			oBar.css("max-width", iChartWidth - parseInt(oBar.css("max-width"), 10) + "px");
		}

		adjustBar(jQuery.sap.byId(this.getId() + "-dmc-bar1"));
		adjustBar(jQuery.sap.byId(this.getId() + "-dmc-bar2"));
		adjustBar(jQuery.sap.byId(this.getId() + "-dmc-bar-delta"));
	};

	DeltaMicroChart.prototype.attachEvent = function(sEventId, oData, fnFunction, oListener) {
		sap.ui.core.Control.prototype.attachEvent.call(this, sEventId, oData, fnFunction, oListener);
		if (this.hasListeners("press")) {
			this.$().attr("tabindex", 0).addClass("sapSuiteUiMicroChartPointer");
		}
		return this;
	};

	DeltaMicroChart.prototype.detachEvent = function(sEventId, fnFunction, oListener) {
		sap.ui.core.Control.prototype.detachEvent.call(this, sEventId, fnFunction, oListener);
		if (!this.hasListeners("press")) {
			this.$().removeAttr("tabindex").removeClass("sapSuiteUiMicroChartPointer");
		}
		return this;
	};

	DeltaMicroChart.prototype.ontap = function(oEvent) {
	     if (sap.ui.Device.browser.internet_explorer) {
	         this.$().focus();
	     }
	     this.firePress();
	};

	DeltaMicroChart.prototype.onkeydown = function(oEvent) {
	    if (oEvent.which == jQuery.sap.KeyCodes.SPACE) {
	        oEvent.preventDefault();
	    }
	};

	DeltaMicroChart.prototype.onkeyup = function(oEvent) {
	    if (oEvent.which == jQuery.sap.KeyCodes.ENTER || oEvent.which == jQuery.sap.KeyCodes.SPACE) {
	        this.firePress();
	        oEvent.preventDefault();
	    }
	};

	return DeltaMicroChart;
});
