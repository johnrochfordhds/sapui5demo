/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP SE. All rights reserved
 */
/*global jQuery, sap */
(function() {
	'use strict';
	jQuery.sap.declare("sap.apf.modeler.Component");
	jQuery.sap.require("sap.ui.core.UIComponent");
	jQuery.sap.require("sap.apf.modeler.core.instance");
	jQuery.sap.require("sap.m.routing.RouteMatchedHandler");
	jQuery.sap.require('sap.apf.modeler.ui.utils.APFRouter');
	jQuery.sap.require('sap.apf.modeler.ui.utils.constants');
	jQuery.sap.require('sap.apf.modeler.ui.utils.APFTree');
	jQuery.sap.require('sap.apf.core.layeredRepositoryProxy');
	/**
	 * @private
	 * @class Base Component for APF Modeler.
	 * @name sap.apf.modeler.Component
	 * @extends sap.ui.core.UIComponent
	 */
	sap.ui.core.UIComponent.extend("sap.apf.modeler.Component", {
		oCoreApi : null,
		metadata : {
			manifest : "json"
		},
		/**
		 * @private
		 * @description Initialize the Component instance after creation. The component, that extends this component should call this method.
		 * @function
		 * @name sap.apf.modeler.Component.prototype.init
		 */
		init : function() {
			//check datasource from manifest, whether there are other settings
			//for backward compability 1.28 fiori v1.0
			var persistenceServiceRoot, catalogServiceRoot;
			var bUseLayeredRepositoryForAnalyticalConfiguration = false;
			var targetForNavigation;
			if (this.initHasAlreadyBeenCalled) {
				return;
			}
			this.initHasAlreadyBeenCalled = true;
			var manifest = jQuery.extend({}, true, this.getMetadata().getManifest());
			var baseManifest = sap.apf.modeler.Component.prototype.getMetadata().getManifest();
			//persistence service root can be defined via manifest
			if (manifest["sap.apf"] && manifest["sap.apf"].activateLrep) {
				bUseLayeredRepositoryForAnalyticalConfiguration = manifest["sap.apf"].activateLrep;
			}
			if (manifest["crossNavigation"] && manifest["crossNavigation"].outbounds && manifest["crossNavigation"].outbounds.navigateToGenericRuntime){
				targetForNavigation = manifest["crossNavigation"].outbounds.navigateToGenericRuntime;
			}
			if (manifest["sap.app"].dataSources && manifest["sap.app"].dataSources.AnalyticalConfigurationServiceRoot) {
				persistenceServiceRoot = manifest["sap.app"].dataSources.AnalyticalConfigurationServiceRoot.uri;
			} else {
				persistenceServiceRoot = sap.apf.core.constants.modelerPersistenceServiceRoot;
			}
			var persistenceConfiguration = {
				serviceRoot : persistenceServiceRoot
			};
			var inject = {
				instances : {
					component : this
				}
			};
			if (bUseLayeredRepositoryForAnalyticalConfiguration) {
				inject.constructor = {
					persistenceProxy : sap.apf.core.LayeredRepositoryProxy
				};
			}
			if (targetForNavigation){
				inject.functions = {
						getNavigationTargetForGenericRuntime : function() {
							return targetForNavigation;
						}
				};
			} else {
				inject.functions = {
						getNavigationTargetForGenericRuntime : function() {
							if (manifest['sap.app'] && manifest['sap.app'].id === 'fnd.apf.dts1'){
								return { semanticObject : "FioriApplication", action : 'executeAPFConfigurationS4HANA' };
							} else {
								return { semanticObject : "FioriApplication", action : 'executeAPFConfiguration' };
							}
						}
				};
			}

			if (manifest["sap.app"].dataSources && manifest["sap.app"].dataSources.GatewayCatalogService) {
				catalogServiceRoot = manifest["sap.app"].dataSources.GatewayCatalogService.uri;
			} else if (baseManifest["sap.app"].dataSources && baseManifest["sap.app"].dataSources.GatewayCatalogService) {
				catalogServiceRoot = baseManifest["sap.app"].dataSources.GatewayCatalogService.uri;
			}

			inject.functions.getCatalogServiceUri = function() {
				return catalogServiceRoot;
			}
			this.oCoreApi = new sap.apf.modeler.core.Instance(persistenceConfiguration, inject);
			var apfLocation = this.oCoreApi.getUriGenerator().getApfLocation();
			jQuery.sap.includeStyleSheet(apfLocation + "modeler/resources/css/configModeler.css", "configModelerCss");
			sap.ui.core.UIComponent.prototype.init.apply(this, arguments);
			//initialize the router
			var oRouter = this.getRouter();
			this.oRouteHandler = new sap.m.routing.RouteMatchedHandler(oRouter);
			oRouter.initialize();
		},
		/**
		 * @private
		 * @description Creates the content of the component. A component, that extends this component should call this method.
		 * @function
		 * @name sap.apf.modeler.Component.prototype.createContent
		 * @returns {sap.ui.core.Control} the content
		 */
		createContent : function() {

			var applicationListView = sap.ui.view({
				viewName : "sap.apf.modeler.ui.view.applicationList",
				type : "XML",
				viewData : this.oCoreApi
			});

			this.oCoreApi.getUriGenerator().getApfLocation();
			return applicationListView;
		}
	});
}());
