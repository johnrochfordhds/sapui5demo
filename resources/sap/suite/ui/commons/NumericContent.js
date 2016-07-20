/*!
 * 
 * 		SAP UI development toolkit for HTML5 (SAPUI5)
 * 		(c) Copyright 2009-2015 SAP SE. All rights reserved
 * 	
 */
jQuery.sap.declare("sap.suite.ui.commons.NumericContent");jQuery.sap.require("sap.suite.ui.commons.library");jQuery.sap.require("sap.ui.core.Control");sap.ui.core.Control.extend("sap.suite.ui.commons.NumericContent",{metadata:{deprecated:true,library:"sap.suite.ui.commons",properties:{"size":{type:"sap.suite.ui.commons.InfoTileSize",group:"Misc",defaultValue:sap.suite.ui.commons.InfoTileSize.Auto},"value":{type:"string",group:"Misc",defaultValue:null},"scale":{type:"string",group:"Misc",defaultValue:null},"valueColor":{type:"sap.suite.ui.commons.InfoTileValueColor",group:"Misc",defaultValue:sap.suite.ui.commons.InfoTileValueColor.Neutral},"indicator":{type:"sap.suite.ui.commons.DeviationIndicator",group:"Misc",defaultValue:sap.suite.ui.commons.DeviationIndicator.None},"state":{type:"sap.suite.ui.commons.LoadState",group:"Misc",defaultValue:sap.suite.ui.commons.LoadState.Loaded},"animateTextChange":{type:"boolean",group:"Misc",defaultValue:true},"formatterValue":{type:"boolean",group:"Misc",defaultValue:false},"truncateValueTo":{type:"int",group:"Misc",defaultValue:4},"icon":{type:"sap.ui.core.URI",group:"Misc",defaultValue:null},"nullifyValue":{type:"boolean",group:"Misc",defaultValue:true},"iconDescription":{type:"string",group:"Misc",defaultValue:null},"width":{type:"sap.ui.core.CSSSize",group:"Misc",defaultValue:null},"withMargin":{type:"boolean",group:"Appearance",defaultValue:true}},events:{"press":{}}}});sap.suite.ui.commons.NumericContent.M_EVENTS={'press':'press'};
/*!
 * ${copyright}
 */
jQuery.sap.require("sap.m.NumericContent");sap.m.NumericContent.extend("sap.suite.ui.commons.NumericContent",{metadata:{library:"sap.suite.ui.commons"}});
