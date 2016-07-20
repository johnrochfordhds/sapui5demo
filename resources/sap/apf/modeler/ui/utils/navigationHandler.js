/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2014 SAP SE. All rights reserved
 */
jQuery.sap.declare('sap.apf.modeler.ui.utils.navigationHandler');sap.apf.modeler.ui.utils.navigationHandler=(function(){var i,d={};var t=function(l,m){b(l,{isSwitchConfiguration:true},m);};var a=function(l,m){_(l,{isValidationCheck:true},m);};var _=function(l,s,m){var C=l.oCoreApi;var n=C.getText("mandatoryField");var o=Object.keys(s)[0];var p={_handleValidationNavigation:f,_handlePreventNavigation:j,configListInstance:l,callback:m};p[o]=s[o];d.oConfirmValidationDialog=sap.ui.xmlfragment("idMandatoryValidationDialogFragement","sap.apf.modeler.ui.fragment.mandatoryDialog",p);l.getView().addDependent(d.oConfirmValidationDialog);e(C,"validationDialog");var v=new sap.m.Label();v.addStyleClass("dialogText");v.setText(n);d.oConfirmValidationDialog.removeAllContent();d.oConfirmValidationDialog.addContent(v);d.oConfirmValidationDialog.attachAfterClose(function(){d.oConfirmValidationDialog.destroy();});d.oConfirmValidationDialog.open();};var b=function(l,s,m){var C=l.oCoreApi;var n=C.getText("unsavedConfiguration");var o=Object.keys(s)[0];var p={_handleNavigationWithSave:g,_handleNavigateWithoutSave:h,_handlePreventNavigation:j,configListInstance:l,callback:m};p[o]=s[o];d.oConfirmNavigationDialog=sap.ui.xmlfragment("idMessageDialogFragment","sap.apf.modeler.ui.fragment.messageDialog",p);l.getView().addDependent(d.oConfirmNavigationDialog);e(C,"naviagtionDialog");var q=new sap.m.Label();q.addStyleClass("dialogText");q.setText(n);d.oConfirmNavigationDialog.removeAllContent();d.oConfirmNavigationDialog.addContent(q);d.oConfirmNavigationDialog.attachAfterClose(function(){d.oConfirmNavigationDialog.destroy();});d.oConfirmNavigationDialog.open();};var c=function(d){d.close();};var e=function(C,l){if(l==="naviagtionDialog"){sap.ui.core.Fragment.byId("idMessageDialogFragment","idMessageDialog").setTitle(C.getText("warning"));sap.ui.core.Fragment.byId("idMessageDialogFragment","idYesButton").setText(C.getText("yes"));sap.ui.core.Fragment.byId("idMessageDialogFragment","idNoButton").setText(C.getText("no"));sap.ui.core.Fragment.byId("idMessageDialogFragment","idCancelButton").setText(C.getText("cancel"));}else if(l==="validationDialog"){sap.ui.core.Fragment.byId("idMandatoryValidationDialogFragement","idMandatoryValidationDialog").setTitle(C.getText("warning"));sap.ui.core.Fragment.byId("idMandatoryValidationDialogFragement","idYesButton").setText(C.getText("yes"));sap.ui.core.Fragment.byId("idMandatoryValidationDialogFragement","idNoButton").setText(C.getText("no"));}};var f=function(){var l=this.callback;c(d.oConfirmValidationDialog);if(typeof l.yes==="function"){l.yes();}};var g=function(){var l=this.configListInstance;var m=this.callback;var s=function(m){l.configEditor.save(function(n,o,p){l.configId=n;l.configurationHandler.memorizeConfiguration(n);if(p===undefined){if(typeof m==="function"){m();}var q=l.oCoreApi.getText("successOnSave");sap.m.MessageToast.show(q,{width:"20em"});}else{var M=l.oCoreApi.createMessageObject({code:"12000"});M.setPrevious(p);l.oCoreApi.putMessage(M);var r=l.oCoreApi.getText("errorOnSave");sap.m.MessageToast.show(r,{width:"20em"});}});};c(d.oConfirmNavigationDialog);if(typeof m.yes==="function"){m.yes(s);}};var h=function(){var l=this.configListInstance;var m=this.callback;c(d.oConfirmNavigationDialog);l.configurationHandler.resetConfiguration(l.configId);if(typeof m.no==="function"){m.no();}};var j=function(){var l=this.isValidationCheck;var m=this.callback;if(!l){c(d.oConfirmNavigationDialog);}else{c(d.oConfirmValidationDialog);}if(typeof m.cancel==="function"){m.cancel();}else if(typeof m.no==="function"&&l){m.no();}};var k=function(){return{throwLossOfDataPopup:t,throwMandatoryPopup:a};};return{getInstance:function(){return i||(i=k());}};}());
