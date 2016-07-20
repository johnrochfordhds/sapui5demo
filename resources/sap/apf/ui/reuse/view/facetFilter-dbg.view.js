/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
/**
 * @class facetFilter
 * @name  facetFilter
 * @description Creates the facet filter
 * @memberOf sap.apf.ui.reuse.view
 * 
 */
(function() {
	'use strict';
	sap.ui.jsview("sap.apf.ui.reuse.view.facetFilter", {
		getControllerName : function() {
			return "sap.apf.ui.reuse.controller.facetFilter";
		},
		createContent : function(oController) {
			var oFacetFilterList;
			var oCoreApi = this.getViewData().oCoreApi;
			var aConfiguredFilters = this.getViewData().aConfiguredFilters;
			var aFacetFilterListControls = [];
			aConfiguredFilters.forEach(function(oConfiguredFilter) {
				oFacetFilterList = new sap.m.FacetFilterList({
					title : oCoreApi.getTextNotHtmlEncoded(oConfiguredFilter.getLabel()),
					multiSelect : oConfiguredFilter.isMultiSelection(),
					key : oConfiguredFilter.getPropertyName(),
					growing : false,
					listClose : oController.onListClose.bind(oController)
				});
				aFacetFilterListControls.push(oFacetFilterList);
			});
			aFacetFilterListControls.forEach(function(oFacetFilterListControl) {
				oFacetFilterListControl.bindItems("/", new sap.m.FacetFilterItem({
					key : '{key}',
					text : '{text}',
					selected : '{selected}'
				}));
				var oModel = new sap.ui.model.json.JSONModel([]);
				oFacetFilterListControl.setModel(oModel);
			});
			var oFacetFilter = new sap.m.FacetFilter(oController.createId("idAPFFacetFilter"), {
				type : "Simple",
				showReset : true,
				showPopoverOKButton : true,
				lists : aFacetFilterListControls,
				reset : oController.onResetPress.bind(oController)
			});
			if (sap.ui.Device.system.desktop) {
				oFacetFilter.addStyleClass("facetfilter");
			}
			return oFacetFilter;
		}
	});
}());