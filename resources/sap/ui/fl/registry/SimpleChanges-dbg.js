/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2014-2016 SAP SE. All rights reserved
 */

sap.ui.define([
	"jquery.sap.global", "sap/ui/fl/changeHandler/HideControl", "sap/ui/fl/changeHandler/UnhideControl", "sap/ui/fl/changeHandler/MoveElements", "sap/ui/fl/changeHandler/PropertyChange"
], function(jQuery, HideControl, UnhideControl, MoveElements, PropertyChange) {
	"use strict";

	/**
	 * Object containing standard changes like labelChange. Structure is like this: <code> { "labelChange":{"changeType":"labelChange", "changeHandler":sap.ui.fl.changeHandler.LabelChange}} </code>
	 * @constructor	 	  
	 * @alias sap.ui.fl.registry.SimpleChanges
	 *
	 * @author SAP SE
	 * @version 1.36.12
	 * @experimental Since 1.27.0
	 *
	 */
	var SimpleChanges = {
		hideControl: {
			changeType: "hideControl",
			changeHandler: HideControl
		},
		unhideControl: {
			changeType: "unhideControl",
			changeHandler: UnhideControl
		},
		moveElements: {
			changeType: "moveElements",
			changeHandler: MoveElements
		},
		propertyChange : {
			changeType: "propertyChange",
			changeHandler: PropertyChange 
		}
	};

	return SimpleChanges;

}, true);
