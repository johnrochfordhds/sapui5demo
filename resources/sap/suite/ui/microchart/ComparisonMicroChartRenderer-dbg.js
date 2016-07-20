/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2016 SAP SE. All rights reserved
	
 */

sap.ui.define(['jquery.sap.global'],
	function() {
	"use strict";

	/**
	 * ComparisonMicroChart renderer.
	 * @namespace
	 */
	var ComparisonMicroChartRenderer = {};

	/**
	 * Renders the HTML for the given control, using the provided
	 * {@link sap.ui.core.RenderManager}.
	 *
	 * @param {sap.ui.core.RenderManager} oRm
	 *			the RenderManager that can be used for writing to
	 *			the Render-Output-Buffer
	 * @param {sap.ui.core.Control} oControl
	 *			the control to be rendered
	 */
	ComparisonMicroChartRenderer.render = function (oRm, oControl) {
		var sTooltip = oControl.getTooltip_AsString();
		if (typeof sTooltip !== "string") {
			sTooltip = "";
		}

		oRm.write("<div");
		oRm.writeControlData(oControl);
		oRm.addClass("sapSuiteCmpChartContent");
		oRm.addClass(oControl.getSize());
		if (oControl.hasListeners("press")) {
			oRm.writeAttribute("tabindex", "0");
			oRm.addClass("sapSuiteUiMicroChartPointer");
		}
		oRm.writeClasses();

		oRm.writeAttribute("role", "presentation");
		oRm.writeAttributeEscaped("aria-label", oControl.getAltText().replace(/\s/g, " ") + (sap.ui.Device.browser.firefox ? "" : " " + sTooltip ));

		if (oControl.getShrinkable()) {
			oRm.addStyle("min-height", "0px");
		}
		if (oControl.getWidth()) {
			oRm.addStyle("width", oControl.getWidth());
		}
		if (oControl.getHeight()) {
			oRm.addStyle("height", oControl.getHeight());
		}
		oRm.writeStyles();
		oRm.writeAttributeEscaped("title", sTooltip);
		oRm.write(">");
		this._renderInnerContent(oRm, oControl);
			oRm.write("<div");
			oRm.writeAttribute("id", oControl.getId() + "-info");
			oRm.writeAttribute("aria-hidden", "true");
			oRm.addStyle("display", "none");
			oRm.writeStyles();
			oRm.write(">");
				oRm.writeEscaped(sTooltip);
			oRm.write("</div>");

			oRm.write("<div");
			oRm.writeAttribute("id", oControl.getId() + "-hidden");
			oRm.writeAttribute("aria-hidden", "true");
			oRm.writeAttribute("tabindex", "-1");
			oRm.writeStyles();
			oRm.write(">");
			oRm.write("</div>");
		oRm.write("</div>");
	};

	ComparisonMicroChartRenderer._renderInnerContent = function(oRm, oControl) {
		var iCPLength = oControl.getColorPalette().length;
		var iCPIndex = 0;

		var fnNextColor = function() {
			if (iCPLength) {
				if (iCPIndex == iCPLength) {
					iCPIndex = 0;
				}
				return oControl.getColorPalette()[iCPIndex++];
			}
		};

		var aChartData = oControl._calculateChartData();
		for (var i = 0; i < aChartData.length; i++) {
			this._renderChartItem(oRm,  oControl, aChartData[i], i, fnNextColor());
		}
	};

	ComparisonMicroChartRenderer._renderChartItem = function(oRm, oControl, oChartData, iIndex, sColor) {
		oRm.write("<div");
		oRm.writeAttribute("id", oControl.getId() + "-chart-item-" + iIndex);
		oRm.addClass("sapSuiteCmpChartItem");
		oRm.addClass(oControl.getView());
		oRm.addClass(oControl.getSize());
		oRm.writeClasses();
		oRm.write(">");
			this._renderChartHeader(oRm, oControl, iIndex, sColor);
			this._renderChartBar(oRm, oControl, oChartData, iIndex, sColor);
		oRm.write("</div>");
	};

	ComparisonMicroChartRenderer._renderChartBar = function(oRm, oControl, oChartData, iIndex, sColor) {
		var oData = oControl.getData()[iIndex];

		oRm.write("<div");
		oRm.writeAttribute("id", oControl.getId() + "-chart-item-bar-" + iIndex);
		oRm.addClass("sapSuiteCmpChartBar");
		oRm.addClass(oControl.getView());
		oRm.addClass(oControl.getSize());
		if (oControl.getData()[iIndex].hasListeners("press")) {
			oRm.writeAttribute("tabindex", "0");
			oRm.writeAttribute("role", "presentation");
			oRm.writeAttributeEscaped("title", oControl._getBarAltText(iIndex));
			oRm.writeAttributeEscaped("aria-label", oControl._getBarAltText(iIndex));
			oRm.writeAttribute("data-bar-index", iIndex);
			oRm.addClass("sapSuiteUiMicroChartPointer");
		}
		oRm.writeClasses();
		oRm.write(">");

		if (oChartData.negativeNoValue > 0) {
			oRm.write("<div");
			oRm.writeAttribute("data-bar-index", iIndex);
			oRm.addClass("sapSuiteCmpChartBarNegNoValue");
			oRm.writeClasses();
			oRm.addStyle("width", oChartData.negativeNoValue + "%");
			oRm.writeStyles();
			oRm.write("></div>");
		}

		if (oChartData.value > 0) {
			oRm.write("<div");
			oRm.writeAttribute("data-bar-index", iIndex);
			oRm.addClass("sapSuiteCmpChartBarValue");
			oRm.addClass(oData.getColor());
			oRm.writeClasses();
			oRm.addStyle("background-color", sColor);
			oRm.addStyle("width", oChartData.value + "%");
			oRm.writeStyles();
			oRm.write("></div>");
		}

		if (oChartData.positiveNoValue > 0) {
			oRm.write("<div");
			oRm.writeAttribute("data-bar-index", iIndex);
			oRm.addClass("sapSuiteCmpChartBarNoValue");
			oRm.writeClasses();
			oRm.addStyle("width", oChartData.positiveNoValue + "%");
			oRm.writeStyles();
			oRm.write("></div>");
		}

		oRm.write("</div>");
	};

	ComparisonMicroChartRenderer._renderChartHeader = function(oRm, oControl, iIndex, sColor) {
		var oData = oControl.getData()[iIndex];
		var sScale = oControl.getScale();
		var sDisplayValue = oData.getDisplayValue();
		var sAValToShow = sDisplayValue ? sDisplayValue : "" + oData.getValue();
		var sValScale = sAValToShow + sScale;

		oRm.write("<div");
		oRm.writeAttribute("id", oControl.getId() + "-chart-item-" + iIndex + "-header");
		oRm.addClass("sapSuiteCmpChartItemHeader");
		oRm.addClass(oControl.getView());
		oRm.addClass(oControl.getSize());
		oRm.writeClasses();
		oRm.write(">");
			oRm.write("<div");
				oRm.writeAttribute("id", oControl.getId() + "-chart-item-" + iIndex + "-value");
				oRm.addClass("sapSuiteCmpChartItemValue");
				oRm.addClass(oControl.getSize());
				oRm.addClass(oControl.getView());
				if (!sColor) {
					oRm.addClass(oData.getColor());
				}

				if (oData.getTitle()) {
					oRm.addClass("T");
				}
				oRm.writeClasses();
				oRm.write(">");
				if (!isNaN(oData.getValue())) {
					oRm.writeEscaped(sValScale);
				}
			oRm.write("</div>");

			oRm.write("<div");
			oRm.writeAttribute("id", oControl.getId() + "-chart-item-" + iIndex + "-title");
			oRm.addClass("sapSuiteCmpChartItemTitle");
			oRm.writeClasses();
			oRm.write(">");
				oRm.writeEscaped(oData.getTitle());
			oRm.write("</div>");
		oRm.write("</div>");
	};

	return ComparisonMicroChartRenderer;

}, /* bExport= */ true);