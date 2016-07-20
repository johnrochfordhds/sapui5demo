/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2016 SAP SE. All rights reserved
	
 */

sap.ui.define(['jquery.sap.global'],
	function() {
	"use strict";

	/**
	 * BulletMicroChart renderer.
	 * @namespace
	 */
	var BulletMicroChartRenderer = {};

	/**
	 * Renders the HTML for the given control, using the provided
	 * {@link sap.ui.core.RenderManager}.
	 *
	 * @param {sap.ui.core.RenderManager} oRm
	 *            the RenderManager that can be used for writing to
	 *            the Render-Output-Buffer
	 * @param {sap.ui.core.Control} oControl
	 *            the control to be rendered
	 */
	BulletMicroChartRenderer.render = function(oRm, oControl) {
		var oChartData = oControl._calculateChartData();
		var fForecastValuePct = +oChartData.forecastValuePct;
		var sSize = oControl.getSize();
		var sScale = oControl.getScale();
		var bRtl = sap.ui.getCore().getConfiguration().getRTL();
		var sOrientation = bRtl ? "right" : "left";
		var sMode = oControl.getMode();
		var sDeltaValue = (sap.suite.ui.microchart.BulletMicroChartModeType.Delta == sMode) ? oControl._calculateDeltaValue() : 0;
		var bIsActualSet = oControl.getActual() && oControl.getActual()._isValueSet;
		var bShowActualValue = oControl.getShowActualValue() && (sap.m.Size.XS != sSize) && sap.suite.ui.microchart.BulletMicroChartModeType.Actual == sMode;
		var bShowDeltaValue = oControl.getShowDeltaValue() && (sap.m.Size.XS != sSize) && sap.suite.ui.microchart.BulletMicroChartModeType.Delta == sMode;
		var bShowTargetValue = oControl.getShowTargetValue() && (sap.m.Size.XS != sSize);
		var sActualValueLabel = oControl.getActualValueLabel();
		var sDeltaValueLabel = oControl.getDeltaValueLabel();
		var sTargetValueLabel = oControl.getTargetValueLabel();
		var aData = oControl.getThresholds();
		var sTooltip = oControl.getTooltip_AsString();
		if (typeof sTooltip !== "string") {
			sTooltip = "";
		}

		oRm.write("<div");
		oRm.writeControlData(oControl);
		oRm.addClass("sapSuiteBMCContent");
		oRm.addClass(sSize);
		if (oControl.hasListeners("press")) {
			oRm.addClass("sapSuiteUiMicroChartPointer");
			oRm.writeAttribute("tabindex", "0");
		}
		oRm.writeAttribute("role", "presentation");
		oRm.writeAttributeEscaped("aria-label", oControl.getAltText().replace(/\s/g, " ") + (sap.ui.Device.browser.firefox ? "" : " " + sTooltip ));

		oRm.writeClasses();

		if (oControl.getWidth()) {
			oRm.addStyle("width", oControl.getWidth());
			oRm.writeStyles();
		}
		oRm.writeAttribute("id", oControl.getId() + "-bc-content");
		oRm.writeAttributeEscaped("title", sTooltip);
		oRm.write(">");

		oRm.write("<div");
		oRm.addClass("sapSuiteBMCChart");
		oRm.addClass(sSize);
		oRm.writeClasses();
		oRm.writeAttribute("id", oControl.getId() + "-bc-chart");
		oRm.write(">");
		var sValScale = "";
		if (bIsActualSet && bShowActualValue) {
			var sAValToShow = (sActualValueLabel) ? sActualValueLabel : "" + oControl.getActual().getValue();
			sValScale = sAValToShow + sScale;
			oRm.write("<div");
			oRm.addClass("sapSuiteBMCItemValue");
			oRm.addClass(oControl.getActual().getColor());
			oRm.addClass(sSize);
			oRm.writeClasses();
			oRm.writeStyles();
			oRm.writeAttribute("id", oControl.getId() + "-bc-item-value");
			oRm.write(">");
			oRm.writeEscaped(sValScale);
			oRm.write("</div>");
		} else if (bIsActualSet && oControl._isTargetValueSet && bShowDeltaValue) {
			var sDValToShow = (sDeltaValueLabel) ? sDeltaValueLabel : "" + sDeltaValue;
			sValScale = sDValToShow + sScale;
			oRm.write("<div");
			oRm.addClass("sapSuiteBMCItemValue");
			oRm.addClass(oControl.getActual().getColor());
			oRm.addClass(sSize);
			oRm.writeClasses();
			oRm.writeStyles();
			oRm.writeAttribute("id", oControl.getId() + "-bc-item-value");
			oRm.write(">");
			oRm.write("&Delta;");
			oRm.writeEscaped(sValScale);
			oRm.write("</div>");
		}

		for (var i = 0; i < oChartData.thresholdsPct.length; i++) {
			if (aData[i]._isValueSet) {
				this.renderThreshold(oRm,  oControl, oChartData.thresholdsPct[i]);
			}
		}

		oRm.write("<div");
		oRm.writeAttribute("id", oControl.getId() + "-chart-bar");
		oRm.addClass("sapSuiteBMCBar");
		oRm.addClass(sSize);
		oRm.addClass(oControl.getScaleColor());
		oRm.writeClasses();
		oRm.write(">");
		oRm.write("</div>");

		if (oControl._isForecastValueSet && sMode == "Actual") {
			oRm.write("<div");
			oRm.addClass("sapSuiteBMCForecastBarValue");
			oRm.addClass(oControl.getActual().getColor());
			oRm.addClass(sSize);
			oRm.writeClasses();
			oRm.addStyle("width", fForecastValuePct + "%");
			oRm.writeStyles();
			oRm.writeAttribute("id", oControl.getId() + "-forecast-bar-value");
			oRm.write("></div>");
		}

		if (bIsActualSet) {
			oRm.write("<div");
			oRm.addClass("sapSuiteBMCBarValueMarker");
			oRm.addClass(sMode);
			if (!oControl.getShowValueMarker()) {
				oRm.addClass("sapSuiteBMCBarValueMarkerHidden");
			}
			oRm.addClass(oControl.getActual().getColor());
			oRm.addClass(sSize);
			oRm.writeClasses();
			oRm.addStyle(sOrientation, parseFloat(oChartData.actualValuePct) + parseFloat(1) + "%");
			if (sMode == "Delta" && oChartData.actualValuePct <= oChartData.targetValuePct) {
				oRm.addStyle("margin", "0");
			}
			oRm.writeStyles();
			oRm.writeAttribute("id", oControl.getId() + "-bc-bar-value-marker");
			oRm.write("></div>");

			if (sMode == "Actual") {
				oRm.write("<div");
				oRm.addClass("sapSuiteBMCBarValue");
				oRm.addClass(oControl.getActual().getColor());
				oRm.addClass(sSize);
				if (oControl._isForecastValueSet) {
					oRm.addClass("sapSuiteBMCForecast");
				}
				oRm.writeClasses();
				oRm.addStyle("width", oChartData.actualValuePct + "%");
				oRm.writeStyles();
				oRm.writeAttribute("id", oControl.getId() + "-bc-bar-value");
				oRm.write("></div>");
			} else if (oControl._isTargetValueSet && sMode == "Delta") {
				oRm.write("<div");
				oRm.addClass("sapSuiteBMCBarValue");
				oRm.addClass(oControl.getActual().getColor());
				oRm.addClass(sSize);
				oRm.writeClasses();
				oRm.addStyle("width", Math.abs(oChartData.actualValuePct - oChartData.targetValuePct) + "%");
				oRm.addStyle(sOrientation, 1 + Math.min(oChartData.actualValuePct, oChartData.targetValuePct) + "%");
				oRm.writeStyles();
				oRm.writeAttribute("id", oControl.getId() + "-bc-bar-value");
				oRm.write("></div>");
			}
		}

		if (oControl._isTargetValueSet) {
			oRm.write("<div");
			oRm.addClass("sapSuiteBMCTargetBarValue");
			oRm.addClass(sSize);
			oRm.writeClasses();
			oRm.addStyle(sOrientation, parseFloat(oChartData.targetValuePct).toFixed(2) + "%");
			oRm.writeStyles();
			oRm.writeAttribute("id", oControl.getId() + "-bc-target-bar-value");
			oRm.write("></div>");

			if (bShowTargetValue) {
				var sTValToShow = (sTargetValueLabel) ? sTargetValueLabel : "" + oControl.getTargetValue();
				var sTValScale = sTValToShow + sScale;
				oRm.write("<div");
				oRm.addClass("sapSuiteBMCTargetValue");
				oRm.addClass(sSize);
				oRm.writeClasses();
				oRm.writeStyles();
				oRm.writeAttribute("id", oControl.getId() + "-bc-target-value");
				oRm.write(">");
				oRm.writeEscaped(sTValScale);
				oRm.write("</div>");
			}
		}
		oRm.write("</div>");

		oRm.write("<div");
		oRm.writeAttribute("id", oControl.getId() + "-info");
		oRm.writeAttribute("aria-hidden", "true");
		oRm.addStyle("display", "none");
		oRm.writeStyles();
		oRm.write(">");
		oRm.writeEscaped(sTooltip);
		oRm.write("</div>");
		oRm.write("</div>");
	};

	/**
	 * Renders the HTML for the thresholds, using the provided {@link sap.ui.core.RenderManager}.
	 *
	 * @param {sap.ui.core.RenderManager} oRm the RenderManager that can be used for writing to the render output buffer
	 * @param {sap.ui.core.Control} oControl an object representation of the control whose thresholds should be rendered
	 * @param {sap.ui.core.Control} oThreshold an object containing threshold values and colors
	 */
	BulletMicroChartRenderer.renderThreshold = function(oRm, oControl, oThreshold) {
		var sOrientation = sap.ui.getCore().getConfiguration().getRTL() ? "right" : "left";
		var fValuePct = 0.98 * oThreshold.valuePct + 1;
		var sColor = oThreshold.color;
		var sSize = oControl.getSize();

		if (sap.m.ValueColor.Error == oThreshold.color) {
			oRm.write("<div");
			oRm.addClass("sapSuiteBMCDiamond");
			oRm.addClass(sSize);
			oRm.addClass(sColor);
			oRm.writeClasses();
			oRm.addStyle(sOrientation, fValuePct + "%");
			oRm.writeStyles();
			oRm.write("></div>");
		}
		oRm.write("<div");
		oRm.addClass("sapSuiteBMCThreshold");
		oRm.addClass(sSize);
		oRm.addClass(sColor);
		oRm.writeClasses();
		oRm.addStyle(sOrientation, fValuePct + "%");
		oRm.writeStyles();
		oRm.write("></div>");
	};

	return BulletMicroChartRenderer;

}, /* bExport= */ true);