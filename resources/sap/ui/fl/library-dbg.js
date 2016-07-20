/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2014-2016 SAP SE. All rights reserved
 */

sap.ui.define([
		"sap/ui/core/Core",
		"sap/ui/core/library",
		"sap/ui/core/mvc/XMLView",
		"sap/ui/core/mvc/View",
		"sap/ui/fl/registry/ChangeRegistry",
		"sap/ui/fl/registry/SimpleChanges"
	],
	function(Core, corelibrary, XMLView, View, ChangeRegistry, SimpleChanges) {
	"use strict";

	sap.ui.getCore().initLibrary({
		name:"sap.ui.fl",
		version:"1.36.12",
		dependencies:["sap.ui.core"],
		noLibraryCSS: true
	});

    if ( XMLView.registerPreprocessor ){
        // Register preprocessor for TINAF changes
        XMLView.registerPreprocessor('controls', "sap.ui.fl.Preprocessor", true);
    }else {
        //workaround solution until registerPreprocessor is available
        //PreprocessorImpl because in the workaround case there is no preprocessor base object
        View._sContentPreprocessor = "sap.ui.fl.PreprocessorImpl";
    }


    var registerChangeHandlerForOpenUI5Controls = function () {
      //Flex Change Handler registration
      var oChangeRegistry = ChangeRegistry.getInstance();
      oChangeRegistry.registerControlsForChanges({
             "sap.uxap.ObjectPageLayout": [
                    SimpleChanges.moveElements,
                    SimpleChanges.propertyChange
             ],
             "sap.uxap.ObjectPageSection": [
                    SimpleChanges.hideControl,
                    SimpleChanges.unhideControl
             ],
             "sap.uxap.ObjectPageHeader": [
                    SimpleChanges.propertyChange
             ],
             "sap.uxap.ObjectPageHeaderActionButton": [
                    SimpleChanges.propertyChange
             ],
             "sap.ui.table.Column": [
                    SimpleChanges.propertyChange
             ],
             "sap.ui.table.Table" : [
                    SimpleChanges.moveElements
             ],
             "sap.ui.table.AnalyticalTable" : [
                    SimpleChanges.moveElements
             ]
      });
    };

    registerChangeHandlerForOpenUI5Controls();

	return sap.ui.fl;

}, /* bExport= */ true);
