/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */

sap.ui.define([], function () {
	"use strict";

	/**
	 * Cell renderer.
	 * @namespace
	 */
	var CellRenderer = {};
	
	CellRenderer.render = function(oRenderManager, oControl) {
		var oContentToRender = oControl.getContentToRender();
		if (oContentToRender){
			oRenderManager.renderControl(oContentToRender);
		}
	};

	return CellRenderer;
}, /* bExport= */ true);
