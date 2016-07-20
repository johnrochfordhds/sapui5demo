/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */

sap.ui.define([], function () {
	"use strict";

	/**
	 * List Legend renderer.
	 *
	 * @namespace
	 */
	var ListLegendRenderer = {};

	ListLegendRenderer.render = function (oRenderManager, oLegend) {
		jQuery.sap.measure.start("ListLegendRenderer render","GanttPerf:ListLegendRenderer render function");
		oRenderManager.write("<div");
		oRenderManager.writeControlData(oLegend);
		oRenderManager.addStyle("width", "100%");
		oRenderManager.addStyle("height", "100%");
		oRenderManager.addStyle("position", "relative");
		oRenderManager.writeStyles();
		oRenderManager.addClass("sapGanttListLegend");
		oRenderManager.writeClasses();
		oRenderManager.write(">");

		
		var aShapes = oLegend._aShapeInstance,
			sLegendWidth = oLegend._getScaledLegendWidth() + "px",
			sLegendHeight = oLegend._getScaledLegendHeight() + "px";
		
		for (var i = 0; i < aShapes.length; i++) {
			var sLegend = aShapes[i].mShapeConfig.getProperty("legend");
				
			oRenderManager.write("<div");
			oRenderManager.writeAttributeEscaped("title", sLegend);
			oRenderManager.addClass("sapGanttLLItem");
			oRenderManager.writeClasses();
			oRenderManager.addStyle("height", sLegendHeight);
			oRenderManager.addStyle("line-height", sLegendHeight);
			oRenderManager.writeStyles();
			oRenderManager.write(">");
				oRenderManager.write("<svg");
				oRenderManager.writeAttribute("id", oLegend.getId() + "-svg-" + i);
				oRenderManager.addStyle("width", sLegendWidth);
				oRenderManager.writeStyles();
				oRenderManager.addClass("sapGanttLLItemSvg");
				oRenderManager.writeClasses();
				oRenderManager.write("></svg>");
				
				oRenderManager.write("<div");
				oRenderManager.writeAttribute("id", oLegend.getId() + "-txt-" + i);
				oRenderManager.addClass("sapGanttLLItemTxt");
				oRenderManager.writeClasses();
				oRenderManager.addStyle(sap.ui.getCore().getConfiguration().getRTL() ? "right" : "left", sLegendWidth);
				oRenderManager.addStyle("font-size", oLegend.getFontSize() + "px");
				oRenderManager.writeStyles();
				oRenderManager.write(">");
					if (sLegend) {
						oRenderManager.writeEscaped(sLegend);
					}
				oRenderManager.write("</div>");
			oRenderManager.write("</div>");
		}
		
		jQuery.sap.measure.start("ListLegendRenderer renderPaintServer","GanttPerf:ListLegendRenderer renderPaintServer part");
		this.renderSvgDefs(oRenderManager, oLegend);
		jQuery.sap.measure.end("ListLegendRenderer renderPaintServer");

		jQuery.sap.measure.start("ListLegendRenderer renderSvgDiv","GanttPerf:GanttChartRenderer renderPaintServer part");
		jQuery.sap.measure.end("ListLegendRenderer renderSvgDiv");
		
		oRenderManager.write("</div>");
		jQuery.sap.measure.end("ListLegendRenderer render");
	};

	ListLegendRenderer.renderSvgDefs = function (oRenderManager, oLegend) {
		var oSvgDefs = oLegend.getSvgDefs();
		if (oSvgDefs) {
			oRenderManager.write("<svg id='" + oLegend.getId() + "-svg-psdef'");
			oRenderManager.addStyle("float", "left");
			oRenderManager.addStyle("width", "0px");
			oRenderManager.addStyle("height", "0px");
			oRenderManager.writeStyles();
			oRenderManager.write(">");
			oRenderManager.write(oSvgDefs.getDefString());
			oRenderManager.write("</svg>");
		}
	};

	ListLegendRenderer.renderSvgDiv = function (oRenderManager, oLegend) {
		oRenderManager.write("<div id='" + oLegend.getId() + "-svg-ctn'");
		oRenderManager.addClass("sapGanttListLegendSvgCtn");
		oRenderManager.writeClasses();
		oRenderManager.write(">");

		oRenderManager.write("<svg id='" + oLegend.getId() + "-svg'");
		oRenderManager.addClass("sapGanttListLegendSvg");
		oRenderManager.writeClasses();
		oRenderManager.addStyle("height", "100%");
		oRenderManager.addStyle("width", "100%");
		oRenderManager.writeStyles();
		oRenderManager.write(">");
		oRenderManager.write("</svg>");
		oRenderManager.write("</div>");
	};

	return ListLegendRenderer;
}, true);
