 /*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2016 SAP SE. All rights reserved
	
 */

sap.ui.define(['jquery.sap.global'],
	function() {
	"use strict";

	/**
	 * AreaMicroChartRenderer renderer.
	 * @namespace
	 */
	var AreaMicroChartRenderer = {};

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
	AreaMicroChartRenderer.render = function(oRm, oControl) {

		function fnWriteLbl(oLabel, sId, sClass, sType) {
			var sLabel = oLabel ? oLabel.getLabel() : "";
			oRm.write("<div");
			oRm.writeAttribute("id", oControl.getId() + sId);

			if (oLabel) {
				oRm.addClass(oLabel.getColor());
			}

			oRm.addClass("sapSuiteAmcLbl");
			oRm.addClass(sClass);
			oRm.addClass(sType);
			oRm.writeClasses();
			oRm.write(">");
				oRm.writeEscaped(sLabel);
			oRm.write("</div>");
		}

		var sTooltip = oControl.getTooltip_AsString();
		if (typeof sTooltip !== "string") {
			sTooltip = "";
		}

		var sTopLblType = ((oControl.getView() == "Normal" && oControl.getFirstYLabel() && oControl.getFirstYLabel().getLabel()) ? "L" : "")
			+ ((oControl.getMaxLabel() && oControl.getMaxLabel().getLabel()) ? "C" : "")
			+ ((oControl.getView() == "Normal" && oControl.getLastYLabel() && oControl.getLastYLabel().getLabel()) ? "R" : "");

		var sBtmLblType = ((oControl.getView() == "Normal" && oControl.getFirstXLabel() && oControl.getFirstXLabel().getLabel()) ? "L" : "")
			+ ((oControl.getMinLabel() && oControl.getMinLabel().getLabel()) ? "C" : "")
			+ ((oControl.getView() == "Normal" && oControl.getLastXLabel() && oControl.getLastXLabel().getLabel()) ? "R" : "");

		var bLeftLbls, bRightLbls;
		bRightLbls = bLeftLbls = oControl.getView() == "Wide";

		oRm.write("<div");
			oRm.writeControlData(oControl);
			if (sTooltip) {
				oRm.writeAttributeEscaped("title", sTooltip);
			}
			oRm.addStyle("width", oControl.getWidth());
			oRm.addStyle("height", oControl.getHeight());
			oRm.writeStyles();
			oRm.writeAttribute("role", "presentation");
			oRm.writeAttributeEscaped("aria-label", oControl.getAltText().replace(/\s/g, " ") + (sap.ui.Device.browser.firefox ? "" : " " + sTooltip ));
			oRm.addClass("sapSuiteAmc");
			if (oControl.hasListeners("press")) {
				oRm.addClass("sapSuiteUiMicroChartPointer");
				oRm.writeAttribute("tabindex", "0");
			}

			if (sTopLblType) {
				oRm.addClass("topLbls");
			}
			if (sBtmLblType) {
				oRm.addClass("btmLbls");
			}

			oRm.writeClasses();
			oRm.write(">");
				if (sTopLblType) {
					oRm.write("<div");
					oRm.writeAttribute("id", oControl.getId() + "-top-labels");
					oRm.addClass("sapSuiteAmcLabels");
					oRm.addClass("Top");
					oRm.writeClasses();
					oRm.write(">");
						fnWriteLbl(oControl.getFirstYLabel(), "-top-left-lbl", "Left", sTopLblType);
						fnWriteLbl(oControl.getMaxLabel(), "-top-center-lbl", "Center", sTopLblType);
						fnWriteLbl(oControl.getLastYLabel(), "-top-right-lbl", "Right", sTopLblType);
					oRm.write("</div>");
				}

				if (bLeftLbls) {
					oRm.write("<div");
					oRm.writeAttribute("id", oControl.getId() + "-left-labels");
					oRm.addClass("sapSuiteAmcSideLabels");
					oRm.addClass("Left");
					oRm.writeClasses();
					oRm.write(">");
						fnWriteLbl(oControl.getFirstYLabel(), "-top-left-lbl", "Top", "Left");
						fnWriteLbl(oControl.getFirstXLabel(), "-btm-left-lbl", "Btm", "Left");
					oRm.write("</div>");
				}

				oRm.write("<div");
				oRm.writeAttribute("id", oControl.getId() + "-canvas-cont");
				oRm.addClass("sapSuiteAmcCanvas");
				oRm.writeClasses();
				oRm.write(">");
					oRm.write("<canvas");
					oRm.writeAttribute("id", oControl.getId() + "-canvas");
					oRm.addStyle("width", "100%");
					oRm.addStyle("height", "100%");
					oRm.writeStyles();
					oRm.write("></canvas>");
				oRm.write("</div>");

				if (bRightLbls) {
					oRm.write("<div");
					oRm.writeAttribute("id", oControl.getId() + "-right-labels");
					oRm.addClass("sapSuiteAmcSideLabels");
					oRm.addClass("Right");
					oRm.writeClasses();
					oRm.write(">");
						fnWriteLbl(oControl.getLastYLabel(), "-top-right-lbl", "Top", "Right");
						fnWriteLbl(oControl.getLastXLabel(), "-btm-right-lbl", "Btm", "Right");
					oRm.write("</div>");
				}

				if (sBtmLblType) {
					oRm.write("<div");
					oRm.writeAttribute("id", oControl.getId() + "-bottom-labels");
					oRm.addClass("sapSuiteAmcLabels");
					oRm.addClass("Btm");
					oRm.writeClasses();
					oRm.write(">");
						fnWriteLbl(oControl.getFirstXLabel(), "-btm-left-lbl", "Left", sBtmLblType);
						fnWriteLbl(oControl.getMinLabel(), "-btm-center-lbl", "Center", sBtmLblType);
						fnWriteLbl(oControl.getLastXLabel(), "-btm-right-lbl", "Right", sBtmLblType);
					oRm.write("</div>");
				}

				oRm.write("<div");
				oRm.writeAttribute("id", oControl.getId() + "-css-helper");
				oRm.addStyle("display", "none");
				oRm.writeStyles();
				oRm.write("></div>");

		oRm.write("</div>");
	};

	return AreaMicroChartRenderer;

}, /* bExport= */ true);