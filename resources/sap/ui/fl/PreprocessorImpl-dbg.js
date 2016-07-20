/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2014-2016 SAP SE. All rights reserved
 */
/*global Promise */

// Provides object sap.ui.fl.ProcessorImpl
sap.ui.define([
	'jquery.sap.global', 'sap/ui/core/Component', 'sap/ui/fl/FlexControllerFactory', 'sap/ui/fl/Utils', 'sap/ui/fl/LrepConnector', 'sap/ui/fl/Cache'
], function(jQuery, Component, FlexControllerFactory, Utils, LrepConnector, Cache) {
	'use strict';

	/**
	 * The implementation of the <code>Preprocessor</code> for the SAPUI5 flexibility services that can be hooked in the <code>View</code> life cycle.
	 *
	 * @name sap.ui.fl.PreprocessorImpl
	 * @class
	 * @constructor
	 * @author SAP SE
	 * @version 1.36.12
	 * @experimental Since 1.27.0
	 */
	var FlexPreprocessorImpl = function(){
	};

	jQuery.sap.require("sap.ui.core.mvc.Controller");
	sap.ui.require("sap/ui/core/mvc/Controller").registerExtensionProvider("sap.ui.fl.PreprocessorImpl");

	/**
	 * Provides an array of extension providers. An extension provider is an object which were defined as controller extensions. These objects
	 * provides lifecycle and event handler functions of a specific controller.
	 *
	 * @param {string} sControllerName - name of the controller
	 * @param {string} sComponentId - unique id for the running controller - unique as well for manifest first
	 * @param {boolean} bAsync - flag whether <code>Promise</code> should be returned or not (async=true)
	 * @see sap.ui.controller for an overview of the available functions on controllers.
	 * @since 1.34.0
	 * @public
	 */
	FlexPreprocessorImpl.prototype.getControllerExtensions = function(sControllerName, sComponentId, bAsync) {
		//D050664: Commented out due to ticket 1670158697. It will be corrected with backlog item CPOUIFDALLAS-919.
		/*if (bAsync) {
			return Cache.getChangesFillingCache(LrepConnector.createConnector(), sComponentId, undefined).then(function(oFileContent) {

				var oChanges = oFileContent.changes;
				var aExtensionProviders = [];

				if (oChanges) {
					jQuery.each(oChanges, function (index, oChange) {
						if (oChange.changeType === "CodingExtension" && oChange.content && sControllerName === oChange.content.controllerName) {
							aExtensionProviders.push(FlexPreprocessorImpl.getExtensionProvider(oChange));
						}
					});
				}

				return aExtensionProviders;
			});
		}*/
	};

	FlexPreprocessorImpl.getExtensionProvider = function(oChange) {
		var sConvertedAsciiCodeContent = oChange.content.code;
		var sConvertedCodeContent = Utils.asciiToString(sConvertedAsciiCodeContent);
		var oExtensionProvider;

		/*eslint-disable */
		eval("oExtensionProvider = { " + sConvertedCodeContent + " } ");
		/*eslint-enable */

		return oExtensionProvider;
	};

	/**
	 * Asynchronous view processing method.
	 *
	 * @param {sap.ui.core.mvc.View} oView view to process
	 * @returns {jquery.sap.promise} result of the processing, promise if executed asynchronously
	 *
	 * @public
	 */
	 FlexPreprocessorImpl.process = function(oView){
		 return Promise.resolve().then(function(){
			 var sComponentName = Utils.getComponentClassName(oView);
			 if ( !sComponentName || sComponentName.length === 0 ){
				 var sError = "no component name found for " + oView.getId();
				 jQuery.sap.log.info(sError);
				 throw new Error(sError);
			 }else {
			     var oFlexController = FlexControllerFactory.create(sComponentName);
			     return oFlexController.processView(oView);
			 }
		 }).then(function() {
			 jQuery.sap.log.debug("flex processing view " + oView.getId() + " finished");
			 return oView;
		 })["catch"](function(error) {
			 var sError = "view " + oView.getId() + ": " + error;
			 jQuery.sap.log.info(sError); //to allow control usage in applications that do not work with UI flex and components
			 // throw new Error(sError); // throw again, wenn caller handles the promise
			 return oView;
		 });
	 };

	 return FlexPreprocessorImpl;

}, /* bExport= */true);
