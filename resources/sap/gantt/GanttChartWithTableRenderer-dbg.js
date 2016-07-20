/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */

sap.ui.define(['sap/ui/core/theming/Parameters'], function (Parameters) {
	"use strict";

	/**
	 * Gantt Chart with table renderer.
	 *
	 * @namespace
	 */
	var GanttChartWithTable = {};

	GanttChartWithTable.render = function (oRenderManager, oGanttChartWithTable) {
		oRenderManager.write("<div");
		oRenderManager.writeControlData(oGanttChartWithTable);
		oRenderManager.addClass("sapUiTableHScr");  //force horizontal scroll bar to show
		oRenderManager.addClass("sapGanttChartWithTable");
		oRenderManager.writeClasses();
		oRenderManager.addStyle("width", oGanttChartWithTable.getWidth());
		oRenderManager.addStyle("height", oGanttChartWithTable.getHeight());
		oRenderManager.writeStyles();
		oRenderManager.write(">");

		if (oGanttChartWithTable._oToolbar.getAllToolbarItems().length == 0) {
			oGanttChartWithTable._oTT.addStyleClass("sapGanttChartColumnHeight");
		} else if (oGanttChartWithTable._oTT.hasStyleClass("sapGanttChartColumnHeight")){
			oGanttChartWithTable._oTT.removeStyleClass("sapGanttChartColumnHeight");
		}

		oRenderManager.renderControl(oGanttChartWithTable._oSplitter);

		oRenderManager.write("</div>");

	};

	return GanttChartWithTable;
}, /* bExport= */ true);
