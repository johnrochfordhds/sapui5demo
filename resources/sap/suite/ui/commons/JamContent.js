/*!
 * 
 * 		SAP UI development toolkit for HTML5 (SAPUI5)
 * 		(c) Copyright 2009-2015 SAP SE. All rights reserved
 * 	
 */
jQuery.sap.declare("sap.suite.ui.commons.JamContent");jQuery.sap.require("sap.suite.ui.commons.library");jQuery.sap.require("sap.ui.core.Control");sap.ui.core.Control.extend("sap.suite.ui.commons.JamContent",{metadata:{deprecated:true,library:"sap.suite.ui.commons",properties:{"size":{type:"sap.suite.ui.commons.InfoTileSize",group:"Misc",defaultValue:sap.suite.ui.commons.InfoTileSize.Auto},"contentText":{type:"string",group:"Misc",defaultValue:null},"subheader":{type:"string",group:"Misc",defaultValue:null},"value":{type:"string",group:"Misc",defaultValue:null},"valueColor":{type:"sap.suite.ui.commons.InfoTileValueColor",group:"Misc",defaultValue:null},"truncateValueTo":{type:"int",group:"Misc",defaultValue:4}},aggregations:{"contentTextAgr":{type:"sap.m.Text",multiple:false,visibility:"hidden"}},events:{"press":{}}}});sap.suite.ui.commons.JamContent.M_EVENTS={'press':'press'};
/*!
 * ${copyright}
 */
jQuery.sap.require("sap.m.FeedContent");sap.m.FeedContent.extend("sap.suite.ui.commons.JamContent",{metadata:{library:"sap.suite.ui.commons"}});
