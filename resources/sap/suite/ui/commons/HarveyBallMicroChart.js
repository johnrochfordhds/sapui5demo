/*!
 * 
 * 		SAP UI development toolkit for HTML5 (SAPUI5)
 * 		(c) Copyright 2009-2015 SAP SE. All rights reserved
 * 	
 */
jQuery.sap.declare("sap.suite.ui.commons.HarveyBallMicroChart");jQuery.sap.require("sap.suite.ui.commons.library");jQuery.sap.require("sap.ui.core.Control");sap.ui.core.Control.extend("sap.suite.ui.commons.HarveyBallMicroChart",{metadata:{deprecated:true,library:"sap.suite.ui.commons",properties:{"total":{type:"float",group:"Misc",defaultValue:0},"totalLabel":{type:"string",group:"Misc",defaultValue:null},"totalScale":{type:"string",group:"Misc",defaultValue:null},"formattedLabel":{type:"boolean",group:"Misc",defaultValue:false},"showTotal":{type:"boolean",group:"Misc",defaultValue:true},"showFractions":{type:"boolean",group:"Misc",defaultValue:true},"size":{type:"sap.suite.ui.commons.InfoTileSize",group:"Misc",defaultValue:sap.suite.ui.commons.InfoTileSize.Auto},"colorPalette":{type:"string[]",group:"Misc",defaultValue:[]},"width":{type:"sap.ui.core.CSSSize",group:"Misc",defaultValue:null}},aggregations:{"items":{type:"sap.suite.ui.commons.HarveyBallMicroChartItem",multiple:true,singularName:"item"}},events:{"press":{}}}});sap.suite.ui.commons.HarveyBallMicroChart.M_EVENTS={'press':'press'};
/*!
 * ${copyright}
 */
jQuery.sap.require("sap.suite.ui.microchart.HarveyBallMicroChart");sap.suite.ui.microchart.HarveyBallMicroChart.extend("sap.suite.ui.commons.HarveyBallMicroChart",{metadata:{library:"sap.suite.ui.commons"}});
