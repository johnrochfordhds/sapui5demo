/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define(['sap/ui/core/theming/Parameters'],function(P){"use strict";var G={};G.render=function(r,g){r.write("<div");r.writeControlData(g);r.addClass("sapUiTableHScr");r.addClass("sapGanttChartWithTable");r.writeClasses();r.addStyle("width",g.getWidth());r.addStyle("height",g.getHeight());r.writeStyles();r.write(">");if(g._oToolbar.getAllToolbarItems().length==0){g._oTT.addStyleClass("sapGanttChartColumnHeight");}else if(g._oTT.hasStyleClass("sapGanttChartColumnHeight")){g._oTT.removeStyleClass("sapGanttChartColumnHeight");}r.renderControl(g._oSplitter);r.write("</div>");};return G;},true);
