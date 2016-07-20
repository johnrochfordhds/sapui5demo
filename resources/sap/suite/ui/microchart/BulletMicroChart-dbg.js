/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2016 SAP SE. All rights reserved
	
 */

// Provides control sap.suite.ui.microchart.BulletMicroChart.
sap.ui.define(['jquery.sap.global', './library', 'sap/ui/core/Control'],
	function(jQuery, library, Control) {
	"use strict";

	/**
	 * Constructor for a new BulletMicroChart control.
	 *
	 * @param {string} [sId] id for the new control, generated automatically if no id is given
	 * @param {object} [mSettings] initial settings for the new control
	 *
	 * @class
	 * Displays a colored horizontal bar representing a current value on top of a background bar representing the compared value. The vertical bars can represent the numeric values, the scaling factors, the thresholds, and the target values.  This control replaces the deprecated sap.suite.ui.commons.BulletChart.
	 * @extends sap.ui.core.Control
	 *
	 * @version 1.36.12
	 *
	 * @public
	 * @alias sap.suite.ui.microchart.BulletMicroChart
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var BulletMicroChart = Control.extend("sap.suite.ui.microchart.BulletMicroChart", /** @lends sap.suite.ui.microchart.BulletMicroChart.prototype */ { metadata : {

		library: "sap.suite.ui.microchart",
		properties: {
			/**
			 * The size of the microchart. If not set, the default size is applied based on the size of the device tile.
			 */
			size: {type: "sap.m.Size", group: "Misc", defaultValue: "Auto"},

			/**
			 * The mode of displaying the actual value itself or the delta between the actual value and the target value. If not set, the actual value is displayed.
			 */
			mode: {type: "sap.suite.ui.microchart.BulletMicroChartModeType", group: "Misc", defaultValue: "Actual"},

			/**
			 * The scaling suffix that is added to the actual and target values.
			 */
			scale: {type: "string", group: "Misc", defaultValue: ""},

			/**
			 * The forecast value that is displayed in Actual  mode only. If set, the forecast value bar appears in the background of the actual value bar.
			 */
			forecastValue: {type: "float", group: "Misc", defaultValue: null},

			/**
			 * The target value that is displayed as a black vertical bar.
			 */
			targetValue: {type: "float", group: "Misc", defaultValue: null},

			/**
			 * The minimum scale value for the bar chart used for defining a fixed size of the scale in different instances of this control.
			 */
			minValue: {type: "float", group: "Misc", defaultValue: null},

			/**
			 * The maximum scale value for the bar chart used for defining a fixed size of the scale in different instances of this control.
			 */
			maxValue: {type: "float", group: "Misc", defaultValue: null},

			/**
			 * If set to true, shows the numeric actual value. This property works in Actual mode only.
			 */
			showActualValue: {type: "boolean", group: "Misc", defaultValue: "true"},

			/**
			 * If set to true, shows the calculated delta value instead of the numeric actual value regardless of the showActualValue setting. This property works in Delta mode only.
			 */
			showDeltaValue: {type: "boolean", group: "Misc", defaultValue: "true"},

			/**
			 * If set to true, shows the numeric target value.
			 */
			showTargetValue: {type: "boolean", group: "Misc", defaultValue: "true"},

			/**
			 * If set to true, shows the value marker.
			 */
			showValueMarker: {type: "boolean", group: "Misc", defaultValue: "false"},

			/**
			 * If set, displays a specified label instead of the numeric actual value.
			 */
			actualValueLabel: {type: "string", group: "Misc", defaultValue: ""},

			/**
			 * If set, displays a specified label instead of the calculated numeric delta value.
			 */
			deltaValueLabel: {type: "string", group: "Misc", defaultValue: ""},

			/**
			 * If set, displays a specified label instead of the numeric target value.
			 */
			targetValueLabel: {type: "string", group: "Misc", defaultValue: ""},

			/**
			 * The width of the chart. If it is not set, the size of the control is defined by the size property.
			 */
			width: {type: "sap.ui.core.CSSSize", group: "Misc"},

			/**
			 * The background color of the scale.
			 */
			scaleColor: {type: "sap.suite.ui.microchart.CommonBackgroundType", group: "Misc", defaultValue: "MediumLight"}
		},
		aggregations: {
			/**
			 * The bullet chart actual data.
			 */
			actual: {type: "sap.suite.ui.microchart.BulletMicroChartData", multiple: false},

			/**
			 * The bullet chart thresholds data.
			 */
			thresholds: {type: "sap.suite.ui.microchart.BulletMicroChartData", multiple: true, singularName: "threshold"}
		},
		events: {
			/**
			 * The event is fired when the user chooses the bullet microchart.
			 */
			press : {}
		}
	}});

	BulletMicroChart.prototype.init = function() {
		this._oRb = sap.ui.getCore().getLibraryResourceBundle("sap.suite.ui.microchart");
		this.setTooltip("{AltText}");
	};

	/**
	 * Calculates the width in percents of chart elements in accordance with provided chart values.
	 *
	 * @returns {Object} object that contains calculated values for actual value, target value, thresholds and their colors.
	 * @private
	 */
	BulletMicroChart.prototype._calculateChartData = function() {
		var fScaleWidthPct = 98;
		var aData = this.getThresholds();
		var aThresholds = [];
		var fTarget = this.getTargetValue();
		var fForecast = this.getForecastValue();
		var fActual = this.getActual() && this.getActual().getValue() ? this.getActual().getValue() : 0;
		var aValues = [];
		var fLowestValue = 0;
		var fHighestValue = 0;

		if (this.getActual() && this.getActual()._isValueSet) {
			aValues.push(fActual);
		}

		if (this._isForecastValueSet) {
			aValues.push(fForecast);
		}

		if (this._isTargetValueSet) {
			aValues.push(fTarget);
		}

		if (this._isMinValueSet) {
			aValues.push(this.getMinValue());
		}

		if (this._isMaxValueSet) {
			aValues.push(this.getMaxValue());
		}

		for (var iData = 0; iData < aData.length; iData++) {
			aValues.push(aData[iData].getValue());
		}

		var fTotal = 0;

		if (aValues.length > 0) {
			fLowestValue = fHighestValue = aValues[0];
			for (var j = 0; j < aValues.length; j++){
				if (aValues[j] < fLowestValue) {
					fLowestValue = aValues[j];
				}
				if (aValues[j] > fHighestValue) {
					fHighestValue = aValues[j];
				}
			}

			fHighestValue = (fHighestValue < 0 && fHighestValue < 3 * (fLowestValue - fHighestValue)) ? 0 : fHighestValue;
			fLowestValue = (fLowestValue > 0 && fLowestValue > 3 * (fHighestValue - fLowestValue)) ? 0 : fLowestValue;

			fTotal = fHighestValue - fLowestValue;

			for (var iThr = 0; iThr < aData.length; iThr++) {
				aThresholds[iThr] = {color: aData[iThr].getColor(), valuePct: (!aData[iThr]._isValueSet || fTotal == 0) ? 0 : ((aData[iThr].getValue() - fLowestValue) * fScaleWidthPct / fTotal).toFixed(2)};
			}
		}

		return {
			actualValuePct: (!this.getActual() || !this.getActual()._isValueSet || fTotal == 0) ? 0 : (0.05 + (fActual - fLowestValue) * fScaleWidthPct / fTotal).toFixed(2),
			targetValuePct: (!this._isTargetValueSet || fTotal == 0) ? 0 : ((fTarget - fLowestValue) * fScaleWidthPct / fTotal).toFixed(2),
			forecastValuePct: (!this._isForecastValueSet || fTotal == 0) ? 0 : ((fForecast - fLowestValue) * fScaleWidthPct / fTotal).toFixed(2),
			thresholdsPct: aThresholds,
			fScaleWidthPct: fScaleWidthPct
		};
	};

	/**
	 * Calculates the number of digits after the decimal point.
	 *
	 * @param {float} fValue float value
	 * @returns {int} number of digits after the decimal point in fValue.
	 * @private
	 */
	BulletMicroChart.prototype._digitsAfterDecimalPoint = function(fValue) {
		var sAfter = ("" + fValue).match(/[.,](\d+)/g);
		return (sAfter) ? ("" + sAfter).length - 1 : 0;
	};

	/**
	 * Calculates the delta between actual value and threshold.
	 *
	 * @returns {float} value of delta between actual value and threshold.
	 * @private
	 */
	BulletMicroChart.prototype._calculateDeltaValue = function() {
		if (!this.getActual()._isValueSet || !this._isTargetValueSet) {
			return 0;
		} else {
			var fActual = this.getActual().getValue();
			var fTarget = this.getTargetValue();
			return Math.abs(fActual - fTarget).toFixed(Math.max(this._digitsAfterDecimalPoint(fActual), this._digitsAfterDecimalPoint(fTarget)));
		}
	};


	BulletMicroChart.prototype.setMinValue = function(fMinValue, bSuppressInvalidate) {
		this._isMinValueSet = this._fnIsNumber(fMinValue);
		return this.setProperty("minValue", this._isMinValueSet ? fMinValue : NaN, bSuppressInvalidate);
	};


	BulletMicroChart.prototype.setMaxValue = function(fMaxValue, bSuppressInvalidate) {
		this._isMaxValueSet = this._fnIsNumber(fMaxValue);
		return this.setProperty("maxValue", this._isMaxValueSet ? fMaxValue : NaN, bSuppressInvalidate);
	};


	BulletMicroChart.prototype.setTargetValue = function(fTargetValue, bSuppressInvalidate) {
		this._isTargetValueSet = this._fnIsNumber(fTargetValue);
		return this.setProperty("targetValue", this._isTargetValueSet ? fTargetValue : NaN, bSuppressInvalidate);
	};


	BulletMicroChart.prototype.setForecastValue = function(fForecastValue, bSuppressInvalidate) {
		this._isForecastValueSet = this._fnIsNumber(fForecastValue);
		return this.setProperty("forecastValue", this._isForecastValueSet ? fForecastValue : NaN, bSuppressInvalidate);
	};

	BulletMicroChart.prototype.ontap = function(oEvent) {
		if (sap.ui.Device.browser.internet_explorer) {
			this.$().focus();
		}
		this.firePress();
	};

	BulletMicroChart.prototype.onkeydown = function(oEvent) {
		if (oEvent.which == jQuery.sap.KeyCodes.SPACE) {
			oEvent.preventDefault();
		}
	};

	BulletMicroChart.prototype.onkeyup = function(oEvent) {
		if (oEvent.which == jQuery.sap.KeyCodes.ENTER || oEvent.which == jQuery.sap.KeyCodes.SPACE) {
			this.firePress();
			oEvent.preventDefault();
		}
	};

	BulletMicroChart.prototype._fnIsNumber = function(n) {
		return typeof n == 'number' && !isNaN(n) && isFinite(n);
	};

	BulletMicroChart.prototype.attachEvent = function(sEventId, oData, fnFunction, oListener) {
		sap.ui.core.Control.prototype.attachEvent.call(this, sEventId, oData, fnFunction, oListener);
		if (this.hasListeners("press")) {
			this.$().attr("tabindex", 0).addClass("sapSuiteUiMicroChartPointer");
		}
		return this;
	};

	BulletMicroChart.prototype.detachEvent = function(sEventId, fnFunction, oListener) {
		sap.ui.core.Control.prototype.detachEvent.call(this, sEventId, fnFunction, oListener);
		if (!this.hasListeners("press")) {
			this.$().removeAttr("tabindex").removeClass("sapSuiteUiMicroChartPointer");
		}
		return this;
	};

	BulletMicroChart.prototype.onAfterRendering = function() {
		if (this._sBarResizeHandlerId) {
			sap.ui.core.ResizeHandler.deregister(this._sBarResizeHandlerId);
		}

		var oHeader = jQuery.sap.domById(this.getId() + "-chart-bar");
		this._sBarResizeHandlerId = sap.ui.core.ResizeHandler.register(oHeader,  jQuery.proxy(this._adjustLabelsPos, this));
		this._adjustLabelsPos();
		if (this.getShowValueMarker()) {
			this._adjustValueToMarker();
		}
	};

	BulletMicroChart.prototype.exit = function() {
		sap.ui.core.ResizeHandler.deregister(this._sBarResizeHandlerId);
	};

	BulletMicroChart.prototype._adjustLabelsPos = function() {
		var bRtl = sap.ui.getCore().getConfiguration().getRTL();
		var oTBarVal = jQuery.sap.byId(this.getId() + "-bc-target-bar-value");
		var oChartBar = jQuery.sap.byId(this.getId() + "-chart-bar");
		var fFullWidth = oChartBar.width();

		if (fFullWidth) {
			var fTValWidth = 0;
			if (oTBarVal && oTBarVal.offset()) {
				fTValWidth = oTBarVal.offset().left - oChartBar.offset().left;
				if (bRtl) {
					fTValWidth = fFullWidth - fTValWidth;
				}
				this._adjustLabelPos(jQuery.sap.byId(this.getId() + "-bc-target-value"), fFullWidth, fTValWidth, bRtl);
			}

			var oValMarker = jQuery.sap.byId(this.getId() + "-bc-bar-value-marker");
			if (oValMarker && oValMarker.offset()) {
				var fAValWidth = oValMarker.offset().left - oChartBar.offset().left;
				if (bRtl) {
					fAValWidth = fFullWidth - fAValWidth;
				}

				if ((sap.suite.ui.microchart.BulletMicroChartModeType.Delta == this.getMode())) {
					fAValWidth = (fAValWidth + fTValWidth) / 2;
				}

				this._adjustLabelPos(jQuery.sap.byId(this.getId() + "-bc-item-value"), fFullWidth, fAValWidth, bRtl);
			}
		}
	};

	BulletMicroChart.prototype._adjustLabelPos = function(oLabel, fFullWidth, fOffset, bRtl) {
		var sOrientation = bRtl ? "right" : "left";
		var fLabelWidth = oLabel.width();
		if (fLabelWidth > fFullWidth) {
			oLabel.css("width", "" + fFullWidth + "px");
			oLabel.css(sOrientation, "0");
		} else {
			var fLabelLeft = fOffset - 0.5 * fLabelWidth;
			if (fLabelLeft < 0) {
				fLabelLeft = 0;
			}

			if (fLabelLeft + fLabelWidth > fFullWidth) {
				fLabelLeft = fFullWidth - fLabelWidth;
			}
			oLabel.css(sOrientation, fLabelLeft);
			oLabel.css("width", "" + (parseInt(fLabelWidth, 10) + 1) + "px");
		}
	};

	BulletMicroChart.prototype._adjustValueToMarker = function() {
		var oValue = jQuery.sap.byId(this.getId() + "-bc-bar-value");
		var oMarker = jQuery.sap.byId(this.getId() + "-bc-bar-value-marker");
		if (oValue.offset() && oMarker.offset()) {
			var fValueWidth = oValue.width();
			var fValueLeft = oValue.offset().left;
			var fMarkerWidth = oMarker.width();
			var fMarkerLeft = oMarker.offset().left;

			if (sap.ui.getCore().getConfiguration().getRTL()) {
				if (fMarkerLeft < fValueLeft) { // browser's subpixel problem fix
					oMarker.css("right", "");
					oMarker.offset({left: fValueLeft});
				}
				if (fMarkerLeft + fMarkerWidth > fValueLeft + fValueWidth) { // bar value is less than marker min-width
					oMarker.css("right", "");
					oMarker.offset({left: fValueLeft + fValueWidth - fMarkerWidth});
				}
			} else {
				if (fMarkerLeft < fValueLeft) { // bar value is less than marker min-width
					oMarker.offset({left: fValueLeft});
				}
				if (fMarkerLeft + fMarkerWidth > fValueLeft + fValueWidth) { // browser's subpixel problem fix
					oValue.width(fMarkerLeft + fMarkerWidth - fValueLeft);
				}
			}
		}
	};

	BulletMicroChart.prototype._getLocalizedColorMeaning = function(sColor) {
		return this._oRb.getText(("SEMANTIC_COLOR_" + sColor).toUpperCase());
	};

	BulletMicroChart.prototype.getAltText = function() {
		var bIsActualSet = this.getActual() && this.getActual()._isValueSet;
		var sScale = this.getScale();
		var sTargetValueLabel = this.getTargetValueLabel();
		var sMeaning = !this.getActual() || !this.getActual().getColor() ? "" : this._getLocalizedColorMeaning(this.getActual().getColor());

		var sAltText = "";

		if (bIsActualSet) {
			var sActualValueLabel = this.getActualValueLabel();
			var sAValToShow = (sActualValueLabel) ? sActualValueLabel : "" + this.getActual().getValue();
			sAltText += this._oRb.getText("BULLETMICROCHART_ACTUAL_TOOLTIP", [sAValToShow + sScale, sMeaning]);
		}
		if (this.getMode() == "Delta") {
			if (this._isTargetValueSet && bIsActualSet) {
				var sDeltaValueLabel = this.getDeltaValueLabel();
				var sDValToShow = (sDeltaValueLabel) ? sDeltaValueLabel : "" + this._calculateDeltaValue();
				sAltText += "\n" + this._oRb.getText("BULLETMICROCHART_DELTA_TOOLTIP", [sDValToShow + sScale, sMeaning]);
			}
		} else {
			if (this._isForecastValueSet) {
				sAltText += (this._isForecastValueSet) ? "\n" + this._oRb.getText("BULLETMICROCHART_FORECAST_TOOLTIP", [this.getForecastValue() + sScale, sMeaning]) : "";
			}
		}

		if (this._isTargetValueSet) {
			var sTValToShow = (sTargetValueLabel) ? sTargetValueLabel : "" + this.getTargetValue();
			sAltText += "\n" + this._oRb.getText("BULLETMICROCHART_TARGET_TOOLTIP", [sTValToShow + sScale]);
		}

		var aThresholds = this.getThresholds().sort(function(oFirst, oSecond) { return oFirst.getValue() - oSecond.getValue(); });

		for (var i = 0; i < aThresholds.length; i++) {
			var oThreshold = aThresholds[i];
			sAltText += "\n" + this._oRb.getText("BULLETMICROCHART_THRESHOLD_TOOLTIP", [oThreshold.getValue() + this.getScale(), this._getLocalizedColorMeaning(oThreshold.getColor())]);
		}

		return sAltText;
	};

	BulletMicroChart.prototype.getTooltip_AsString = function() {
		var oTooltip = this.getTooltip();
		var sTooltip = this.getAltText();

		if (typeof oTooltip === "string" || oTooltip instanceof String) {
			sTooltip = oTooltip.split("{AltText}").join(sTooltip).split("((AltText))").join(sTooltip);
			return sTooltip;
		}
		return oTooltip ? oTooltip : "";
	};

	BulletMicroChart.prototype.clone = function(sIdSuffix, aLocalIds, oOptions) {
		var oClone = sap.ui.core.Control.prototype.clone.apply(this, arguments);
		oClone._isMinValueSet = this._isMinValueSet;
		oClone._isMaxValueSet = this._isMaxValueSet;
		oClone._isForecastValueSet = this._isForecastValueSet;
		oClone._isTargetValueSet = this._isTargetValueSet;
		return oClone;
	};

	return BulletMicroChart;
});
