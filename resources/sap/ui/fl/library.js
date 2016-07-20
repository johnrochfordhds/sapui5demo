/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2014-2016 SAP SE. All rights reserved
 */
sap.ui.define(["sap/ui/core/Core","sap/ui/core/library","sap/ui/core/mvc/XMLView","sap/ui/core/mvc/View","sap/ui/fl/registry/ChangeRegistry","sap/ui/fl/registry/SimpleChanges"],function(C,c,X,V,a,S){"use strict";sap.ui.getCore().initLibrary({name:"sap.ui.fl",version:"1.36.12",dependencies:["sap.ui.core"],noLibraryCSS:true});if(X.registerPreprocessor){X.registerPreprocessor('controls',"sap.ui.fl.Preprocessor",true);}else{V._sContentPreprocessor="sap.ui.fl.PreprocessorImpl";}var r=function(){var o=a.getInstance();o.registerControlsForChanges({"sap.uxap.ObjectPageLayout":[S.moveElements,S.propertyChange],"sap.uxap.ObjectPageSection":[S.hideControl,S.unhideControl],"sap.uxap.ObjectPageHeader":[S.propertyChange],"sap.uxap.ObjectPageHeaderActionButton":[S.propertyChange],"sap.ui.table.Column":[S.propertyChange],"sap.ui.table.Table":[S.moveElements],"sap.ui.table.AnalyticalTable":[S.moveElements]});};r();return sap.ui.fl;},true);
