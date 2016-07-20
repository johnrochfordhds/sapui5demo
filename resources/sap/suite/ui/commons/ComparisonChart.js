/*!
 * 
 * 		SAP UI development toolkit for HTML5 (SAPUI5)
 * 		(c) Copyright 2009-2015 SAP SE. All rights reserved
 * 	
 */
jQuery.sap.declare("sap.suite.ui.commons.ComparisonChart");jQuery.sap.require("sap.suite.ui.commons.library");jQuery.sap.require("sap.ui.core.Control");sap.ui.core.Control.extend("sap.suite.ui.commons.ComparisonChart",{metadata:{deprecated:true,library:"sap.suite.ui.commons",properties:{"scale":{type:"string",group:"Misc",defaultValue:null},"size":{type:"sap.suite.ui.commons.InfoTileSize",group:"Misc",defaultValue:sap.suite.ui.commons.InfoTileSize.Auto},"view":{type:"sap.suite.ui.commons.ComparisonChartView",group:"Appearance",defaultValue:sap.suite.ui.commons.ComparisonChartView.Normal},"width":{type:"sap.ui.core.CSSSize",group:"Misc",defaultValue:null},"colorPalette":{type:"string[]",group:"Misc",defaultValue:[]},"shrinkable":{type:"boolean",group:"Misc",defaultValue:false},"height":{type:"sap.ui.core.CSSSize",group:"Appearance",defaultValue:null}},aggregations:{"data":{type:"sap.suite.ui.commons.ComparisonData",multiple:true,singularName:"data"}},events:{"press":{}}}});sap.suite.ui.commons.ComparisonChart.M_EVENTS={'press':'press'};
/*!
 * ${copyright}
 */
jQuery.sap.require("sap.suite.ui.microchart.ComparisonMicroChart");sap.suite.ui.microchart.ComparisonMicroChart.extend("sap.suite.ui.commons.ComparisonChart",{metadata:{library:"sap.suite.ui.commons"}});
