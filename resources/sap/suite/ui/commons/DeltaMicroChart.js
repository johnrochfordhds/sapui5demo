/*!
 * 
 * 		SAP UI development toolkit for HTML5 (SAPUI5)
 * 		(c) Copyright 2009-2015 SAP SE. All rights reserved
 * 	
 */
jQuery.sap.declare("sap.suite.ui.commons.DeltaMicroChart");jQuery.sap.require("sap.suite.ui.commons.library");jQuery.sap.require("sap.ui.core.Control");sap.ui.core.Control.extend("sap.suite.ui.commons.DeltaMicroChart",{metadata:{deprecated:true,library:"sap.suite.ui.commons",properties:{"value1":{type:"float",group:"Misc",defaultValue:null},"value2":{type:"float",group:"Misc",defaultValue:null},"title1":{type:"string",group:"Misc",defaultValue:null},"title2":{type:"string",group:"Misc",defaultValue:null},"displayValue1":{type:"string",group:"Misc",defaultValue:null},"displayValue2":{type:"string",group:"Misc",defaultValue:null},"deltaDisplayValue":{type:"string",group:"Misc",defaultValue:null},"color":{type:"sap.suite.ui.commons.InfoTileValueColor",group:"Misc",defaultValue:sap.suite.ui.commons.InfoTileValueColor.Neutral},"width":{type:"sap.ui.core.CSSSize",group:"Misc",defaultValue:null},"size":{type:"sap.suite.ui.commons.InfoTileSize",group:"Misc",defaultValue:sap.suite.ui.commons.InfoTileSize.Auto}},events:{"press":{}}}});sap.suite.ui.commons.DeltaMicroChart.M_EVENTS={'press':'press'};
/*!
 * ${copyright}
 */
jQuery.sap.require("sap.suite.ui.microchart.DeltaMicroChart");sap.suite.ui.microchart.DeltaMicroChart.extend("sap.suite.ui.commons.DeltaMicroChart",{metadata:{library:"sap.suite.ui.commons"}});
