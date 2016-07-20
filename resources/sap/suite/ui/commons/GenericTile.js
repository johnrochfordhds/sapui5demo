/*!
 * 
 * 		SAP UI development toolkit for HTML5 (SAPUI5)
 * 		(c) Copyright 2009-2015 SAP SE. All rights reserved
 * 	
 */
jQuery.sap.declare("sap.suite.ui.commons.GenericTile");jQuery.sap.require("sap.suite.ui.commons.library");jQuery.sap.require("sap.ui.core.Control");sap.ui.core.Control.extend("sap.suite.ui.commons.GenericTile",{metadata:{deprecated:true,library:"sap.suite.ui.commons",properties:{"header":{type:"string",group:"Appearance",defaultValue:null},"subheader":{type:"string",group:"Appearance",defaultValue:null},"failedText":{type:"string",group:"Appearance",defaultValue:null},"size":{type:"sap.suite.ui.commons.InfoTileSize",group:"Misc",defaultValue:sap.suite.ui.commons.InfoTileSize.Auto},"frameType":{type:"sap.suite.ui.commons.FrameType",group:"Misc",defaultValue:sap.suite.ui.commons.FrameType.OneByOne},"backgroundImage":{type:"sap.ui.core.URI",group:"Misc",defaultValue:null},"headerImage":{type:"sap.ui.core.URI",group:"Misc",defaultValue:null},"state":{type:"sap.suite.ui.commons.LoadState",group:"Misc",defaultValue:sap.suite.ui.commons.LoadState.Loaded},"imageDescription":{type:"string",group:"Misc",defaultValue:null}},aggregations:{"tileContent":{type:"sap.suite.ui.commons.TileContent",multiple:true,singularName:"tileContent"},"icon":{type:"sap.ui.core.Control",multiple:false},"titleText":{type:"sap.m.Text",multiple:false,visibility:"hidden"},"failedMessageText":{type:"sap.m.Text",multiple:false,visibility:"hidden"}},events:{"press":{}}}});sap.suite.ui.commons.GenericTile.M_EVENTS={'press':'press'};
/*!
 * ${copyright}
 */
jQuery.sap.require("sap.m.GenericTile");sap.m.GenericTile.extend("sap.suite.ui.commons.GenericTile",{metadata:{library:"sap.suite.ui.commons"}});
