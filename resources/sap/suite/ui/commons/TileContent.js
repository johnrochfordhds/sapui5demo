/*!
 * 
 * 		SAP UI development toolkit for HTML5 (SAPUI5)
 * 		(c) Copyright 2009-2015 SAP SE. All rights reserved
 * 	
 */
jQuery.sap.declare("sap.suite.ui.commons.TileContent");jQuery.sap.require("sap.suite.ui.commons.library");jQuery.sap.require("sap.ui.core.Control");sap.ui.core.Control.extend("sap.suite.ui.commons.TileContent",{metadata:{deprecated:true,library:"sap.suite.ui.commons",properties:{"footer":{type:"string",group:"Appearance",defaultValue:null},"size":{type:"sap.suite.ui.commons.InfoTileSize",group:"Misc",defaultValue:"Auto"},"unit":{type:"string",group:"Misc",defaultValue:null},"disabled":{type:"boolean",group:"Misc",defaultValue:false},"frameType":{type:"sap.suite.ui.commons.FrameType",group:"Appearance",defaultValue:sap.suite.ui.commons.FrameType.Auto}},aggregations:{"content":{type:"sap.ui.core.Control",multiple:false}}}});
/*!
 * ${copyright}
 */
jQuery.sap.require("sap.m.TileContent");sap.m.TileContent.extend("sap.suite.ui.commons.TileContent",{metadata:{library:"sap.suite.ui.commons"}});
