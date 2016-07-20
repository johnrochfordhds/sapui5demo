/*!
 * 
 * 		SAP UI development toolkit for HTML5 (SAPUI5)
 * 		(c) Copyright 2009-2015 SAP SE. All rights reserved
 * 	
 */
jQuery.sap.declare("sap.suite.ui.commons.ComparisonData");jQuery.sap.require("sap.suite.ui.commons.library");jQuery.sap.require("sap.ui.core.Element");sap.ui.core.Element.extend("sap.suite.ui.commons.ComparisonData",{metadata:{deprecated:true,library:"sap.suite.ui.commons",properties:{"title":{type:"string",group:"Misc",defaultValue:null},"value":{type:"float",group:"Misc",defaultValue:0},"color":{type:"sap.suite.ui.commons.InfoTileValueColor",group:"Misc",defaultValue:sap.suite.ui.commons.InfoTileValueColor.Neutral},"displayValue":{type:"string",group:"Misc",defaultValue:null}},events:{"press":{}}}});sap.suite.ui.commons.ComparisonData.M_EVENTS={'press':'press'};
/*!
 * ${copyright}
 */
jQuery.sap.require("sap.suite.ui.microchart.ComparisonMicroChartData");sap.suite.ui.microchart.ComparisonMicroChartData.extend("sap.suite.ui.commons.ComparisonData",{metadata:{library:"sap.suite.ui.commons"}});
