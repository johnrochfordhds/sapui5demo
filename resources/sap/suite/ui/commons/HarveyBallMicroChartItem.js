/*!
 * 
 * 		SAP UI development toolkit for HTML5 (SAPUI5)
 * 		(c) Copyright 2009-2015 SAP SE. All rights reserved
 * 	
 */
jQuery.sap.declare("sap.suite.ui.commons.HarveyBallMicroChartItem");jQuery.sap.require("sap.suite.ui.commons.library");jQuery.sap.require("sap.ui.core.Element");sap.ui.core.Element.extend("sap.suite.ui.commons.HarveyBallMicroChartItem",{metadata:{deprecated:true,library:"sap.suite.ui.commons",properties:{"color":{type:"sap.suite.ui.commons.InfoTileValueColor",group:"Misc",defaultValue:sap.suite.ui.commons.InfoTileValueColor.Neutral},"fraction":{type:"float",group:"Misc",defaultValue:0},"fractionLabel":{type:"string",group:"Misc",defaultValue:null},"fractionScale":{type:"string",group:"Misc",defaultValue:null},"formattedLabel":{type:"boolean",group:"Misc",defaultValue:false}}}});
/*!
 * ${copyright}
 */
jQuery.sap.require("sap.suite.ui.microchart.HarveyBallMicroChartItem");sap.suite.ui.microchart.HarveyBallMicroChartItem.extend("sap.suite.ui.commons.HarveyBallMicroChartItem",{metadata:{library:"sap.suite.ui.commons"}});
