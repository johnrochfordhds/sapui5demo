/*!
 * 
 * 		SAP UI development toolkit for HTML5 (SAPUI5)
 * 		(c) Copyright 2009-2015 SAP SE. All rights reserved
 * 	
 */
jQuery.sap.declare("sap.suite.ui.commons.ColumnMicroChart");jQuery.sap.require("sap.suite.ui.commons.library");jQuery.sap.require("sap.ui.core.Control");sap.ui.core.Control.extend("sap.suite.ui.commons.ColumnMicroChart",{metadata:{deprecated:true,library:"sap.suite.ui.commons",properties:{"size":{type:"sap.suite.ui.commons.InfoTileSize",group:"Misc",defaultValue:sap.suite.ui.commons.InfoTileSize.Auto},"width":{type:"sap.ui.core.CSSSize",group:"Misc",defaultValue:null},"height":{type:"sap.ui.core.CSSSize",group:"Misc",defaultValue:null}},aggregations:{"columns":{type:"sap.suite.ui.commons.ColumnData",multiple:true,singularName:"column"},"leftTopLabel":{type:"sap.suite.ui.commons.ColumnMicroChartLabel",multiple:false},"rightTopLabel":{type:"sap.suite.ui.commons.ColumnMicroChartLabel",multiple:false},"leftBottomLabel":{type:"sap.suite.ui.commons.ColumnMicroChartLabel",multiple:false},"rightBottomLabel":{type:"sap.suite.ui.commons.ColumnMicroChartLabel",multiple:false}},events:{"press":{}}}});sap.suite.ui.commons.ColumnMicroChart.M_EVENTS={'press':'press'};
/*!
 * ${copyright}
 */
jQuery.sap.require("sap.suite.ui.microchart.ColumnMicroChart");sap.suite.ui.microchart.ColumnMicroChart.extend("sap.suite.ui.commons.ColumnMicroChart",{metadata:{library:"sap.suite.ui.commons"}});
