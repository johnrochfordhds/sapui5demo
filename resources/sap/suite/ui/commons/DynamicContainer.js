/*!
 * 
 * 		SAP UI development toolkit for HTML5 (SAPUI5)
 * 		(c) Copyright 2009-2015 SAP SE. All rights reserved
 * 	
 */
jQuery.sap.declare("sap.suite.ui.commons.DynamicContainer");jQuery.sap.require("sap.suite.ui.commons.library");jQuery.sap.require("sap.ui.core.Control");sap.ui.core.Control.extend("sap.suite.ui.commons.DynamicContainer",{metadata:{deprecated:true,library:"sap.suite.ui.commons",properties:{"displayTime":{type:"int",group:"Appearance",defaultValue:5000},"transitionTime":{type:"int",group:"Appearance",defaultValue:500}},aggregations:{"tiles":{type:"sap.suite.ui.commons.GenericTile",multiple:true,singularName:"tile"}}}});
/*!
 * ${copyright}
 */
jQuery.sap.require("sap.m.SlideTile");sap.m.SlideTile.extend("sap.suite.ui.commons.DynamicContainer",{metadata:{library:"sap.suite.ui.commons"}});
