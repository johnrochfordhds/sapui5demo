/*!
 * 
 * 		SAP UI development toolkit for HTML5 (SAPUI5)
 * 		(c) Copyright 2009-2015 SAP SE. All rights reserved
 * 	
 */
jQuery.sap.declare("sap.suite.ui.commons.ColumnData");jQuery.sap.require("sap.suite.ui.commons.library");jQuery.sap.require("sap.ui.core.Element");sap.ui.core.Element.extend("sap.suite.ui.commons.ColumnData",{metadata:{deprecated:true,library:"sap.suite.ui.commons",properties:{"label":{type:"string",group:"Misc",defaultValue:null},"value":{type:"float",group:"Misc",defaultValue:null},"color":{type:"sap.suite.ui.commons.InfoTileValueColor",group:"Misc",defaultValue:sap.suite.ui.commons.InfoTileValueColor.Neutral}},events:{"press":{}}}});sap.suite.ui.commons.ColumnData.M_EVENTS={'press':'press'};
/*!
 * ${copyright}
 */
jQuery.sap.require("sap.suite.ui.microchart.ColumnMicroChartData");sap.suite.ui.microchart.ColumnMicroChartData.extend("sap.suite.ui.commons.ColumnData",{metadata:{library:"sap.suite.ui.commons"}});
