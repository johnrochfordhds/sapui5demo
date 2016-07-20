/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
jQuery.sap.declare("sap.apf.ui.instance");
//FIXME: Lazy load print only when required
jQuery.sap.require('sap.apf.ui.utils.print');
jQuery.sap.require('sap.apf.ui.utils.constants');
//FIXME: Load vizhelper within each representation, where it is used.
//jQuery.sap.require('sap.apf.ui.representations.utils.vizHelper');
//FIXME: Lazy load representations when required
jQuery.sap.require('sap.apf.ui.representations.lineChart');
jQuery.sap.require('sap.apf.ui.representations.columnChart');
jQuery.sap.require('sap.apf.ui.representations.scatterPlotChart');
jQuery.sap.require('sap.apf.ui.representations.stackedColumnChart');
jQuery.sap.require('sap.apf.ui.representations.table');
jQuery.sap.require('sap.apf.ui.representations.pieChart');
jQuery.sap.require('sap.apf.ui.representations.percentageStackedColumnChart');
jQuery.sap.require('sap.apf.ui.representations.bubbleChart');
jQuery.sap.require('sap.apf.ui.representations.barChart');
jQuery.sap.require('sap.apf.ui.representations.stackedBarChart');
jQuery.sap.require('sap.apf.ui.representations.percentageStackedBarChart');
jQuery.sap.require('sap.apf.ui.representations.heatmapChart');
jQuery.sap.require('sap.apf.ui.representations.lineChartWithTwoVerticalAxes');
jQuery.sap.require('sap.apf.ui.representations.lineChartWithTimeAxis');
/** 
 *@class Ui Component Instance
 *@name sap.apf.ui.Instance
 *@description Creation of new Ui Component Instance
 *@param {object} oInject - Core Instance
 */
sap.apf.ui.Instance = function(oInject) {
	'use strict';
	oInject.uiApi = this;
	var oCoreApi = oInject.oCoreApi;
	var oStartFilterHandler = oInject.oStartFilterHandler;
	var stepContainer;
	var analysisPath;
	var messageHandler;
	var oFacetFilterView;
	var apfLocation = oCoreApi.getUriGenerator().getApfLocation();
	this.oEventCallbacks = {};
	//sap.ui.getCore().loadLibrary('sap.viz');
	jQuery.sap.includeStyleSheet(apfLocation + "resources/css/apfUi.css", "apfCss");
	jQuery.sap.includeStyleSheet(apfLocation + "resources/css/apfPrint.css", "printCss");
	jQuery("#printCss").attr("media", "print"); // @comment : Doesn't Support adding attribute
	/**
	 *@description Getter for Analysis Path layout
	 *@see sap.apf.ui.reuse.view.analysisPath
	 *@returns {analysisPath}
	 */
	this.getAnalysisPath = function() {
		if (analysisPath === undefined) {
			analysisPath = sap.ui.view({
				viewName : "sap.apf.ui.reuse.view.analysisPath",
				type : sap.ui.core.mvc.ViewType.JS,
				viewData : oInject
			});
		}
		return analysisPath;
	};
	/**
	 *@description Getter for Notification Bar
	 *@see sap.apf.ui.reuse.view.messageHandler
	 *@returns {oNotificationView }
	 */
	this.getNotificationBar = function() {
		if (messageHandler === undefined) {
			messageHandler = sap.ui.view({
				viewName : "sap.apf.ui.reuse.view.messageHandler",
				type : sap.ui.core.mvc.ViewType.JS,
				viewData : oInject
			});
		}
		return messageHandler;
	};
	/**
	 *@description Creates a step container to hold representation
	 *@see sap.apf.ui.reuse.view.stepContainer
	 *@returns {stepContainer}
	 */
	this.getStepContainer = function() {
		if (stepContainer === undefined) {
			stepContainer = sap.ui.view({
				viewName : "sap.apf.ui.reuse.view.stepContainer",
				type : sap.ui.core.mvc.ViewType.JS,
				viewData : oInject
			});
		}
		return stepContainer;
	};
	/**
	 *@memberOf sap.apf.Api#addMasterFooterContent
	 *@description Calls the updatePath with proper callback for UI. 
	 * 				It also refreshes the steps either from the active step or 
	 * 				all the steps depending on the boolean value passed.
	 *@param {boolean} 
	 */
	this.selectionChanged = function(bRefreshAllSteps) {
		if (bRefreshAllSteps) {
			this.getAnalysisPath().getController().refresh(0);
		} else {
			var nActiveStepIndex = oCoreApi.getSteps().indexOf(oCoreApi.getActiveStep());
			this.getAnalysisPath().getController().refresh(nActiveStepIndex + 1);
		}
		oCoreApi.updatePath(this.getAnalysisPath().getController().callBackForUpdatePath.bind(this.getAnalysisPath().getController()));
	};
	var applicationLayout;
	/**
	 *@class view
	 *@name view
	 *@memberOf sap.apf.ui
	 *@description holds views for ui
	 */
	/**
	 *@memberOf sap.apf.ui
	 *@description returns app
	 *@return Application
	 */
	var application = new sap.m.App().addStyleClass("sapApf");
	var bIsAppLayoutCreated = false;
	this.createApplicationLayout = function() {
		// Ensure layout page is added only once
		if (!bIsAppLayoutCreated) {
			application.addPage(this.getLayoutView());
			bIsAppLayoutCreated = true;
		}
		return application;
	};
	/**
	 *@memberOf sap.apf.ui
	 *@description Creates a main application layout with the header and main
	 *              view
	 *@return layout view
	 */
	this.getLayoutView = function() {
		if (applicationLayout === undefined) {
			applicationLayout = sap.ui.view({
				viewName : "sap.apf.ui.reuse.view.layout",
				type : sap.ui.core.mvc.ViewType.XML,
				viewData : oInject
			});
		}
		return applicationLayout;
	};
	/**
	 *@memberOf sap.apf.ui
	 *@description adds content to detail footer
	 *@param oControl
	 *            {object} Any valid UI5 control
	 */
	this.addDetailFooterContent = function(oControl) {
		this.getLayoutView().getController().addDetailFooterContentLeft(oControl);
	};
	/**
	 *@memberOf sap.apf.ui
	 *@description adds content to master footer
	 *@param oControl
	 *            {object} Any valid UI5 control
	 */
	this.addMasterFooterContentRight = function(oControl) {
		this.getLayoutView().getController().addMasterFooterContentRight(oControl);
	};
	/**
	 *@memberOf sap.apf.ui
	 *@description registers callback for event callback.
	 *@param fn callback
	 */
	this.setEventCallback = function(sEventType, fnCallback) {
		this.oEventCallbacks[sEventType] = fnCallback;
	};
	/**
	 *@memberOf sap.apf.ui
	 *@returns the registered callback for event callback.
	 */
	this.getEventCallback = function(sEventType) {
		return this.oEventCallbacks[sEventType];
	};
	/**
	 * @name sap.apf.ui#drawFacetFilter
	 * @member of sap.apf.ui
	 * @param {Object} subHeaderInstance - Pass the sub header instance to add the facet filter view item
	 * @description draws facet filter on layout subHeader.
	 */
	this.drawFacetFilter = function(aConfiguredFilters) {
		if (aConfiguredFilters && aConfiguredFilters.length) {
			oFacetFilterView = sap.ui.view({
				viewName : "sap.apf.ui.reuse.view.facetFilter",
				type : sap.ui.core.mvc.ViewType.JS,
				viewData : {
					oCoreApi : oCoreApi,
					oUiApi : this,
					aConfiguredFilters : aConfiguredFilters,
					oStartFilterHandler : oStartFilterHandler
				}
			});
			var subHeaderInstance = this.getLayoutView().byId("subHeader");
			subHeaderInstance.addItem(oFacetFilterView.byId("idAPFFacetFilter"));
		}
	};
	/**
	 * @function
	 * @name sap.apf.ui#contextChanged
	 * @param {boolean} bResetPath - True when new path is triggered.
	 * @memberOf sap.apf.ui
	 * @description It to be called when the path context is changed/updated.
	 * Notifies application footers of context change.
	 */
	this.contextChanged = function(bResetPath) {
		var fnCallback = this.getEventCallback(sap.apf.core.constants.eventTypes.contextChanged);
		if (typeof fnCallback === "function") {
			fnCallback();
		}
	};
	/**
	 * @function
	 * @name sap.apf.ui#getFacetFilterForPrint
	 * @memberOf sap.apf.ui
	 * @description Currently used by printHelper to get formatted filter values.
	 * @returns facet filter control from which selected values(formatted) are used for printing
	 * */
	this.getFacetFilterForPrint = function() {
		if (oFacetFilterView) {
			return oFacetFilterView.byId("idAPFFacetFilter");
		}
	};
	/**
	 * @function
	 * @name sap.apf.ui#handleStartup
	 * @memberOf sap.apf.ui
	 * @description It is called during start of APF.
	 * Gets the configured visible facet filters and draws the facet filter. 
	 * In case the first step is configured for the application it is created. 
	 * In addition the callback for updating the path is also registered.
	 */
	this.handleStartup = function(deferredMode) {
		var that = this;
		var promiseStartup = jQuery.Deferred();
		deferredMode.done(function(mode) {
			var promiseStartFilters = oStartFilterHandler.getStartFilters();
			promiseStartFilters.done(function(aConfiguredFilters) {
				that.contextChanged();
				that.drawFacetFilter(aConfiguredFilters);
				if (mode.navigationMode === "backward") {
					that.getAnalysisPath().getController().bIsBackNavigation = true; //FIXME Boolean to set busy indicator to false
					oCoreApi.updatePath(that.getAnalysisPath().getController().callBackForUpdatePath.bind(that.getAnalysisPath().getController()));
					that.getAnalysisPath().getController().setPathTitle();
				}
				if (mode.navigationMode === "forward") {
					if (oCoreApi.getStartParameterFacade().getSteps()) {
						var stepId = oCoreApi.getStartParameterFacade().getSteps()[0].stepId;
						var repId = oCoreApi.getStartParameterFacade().getSteps()[0].representationId;
						var callback = that.getAnalysisPath().getController().callBackForUpdatePathAndSetLastStepAsActive.bind(that.getAnalysisPath().getController());
						oCoreApi.createFirstStep(stepId, repId, callback);
					}
				}
				promiseStartup.resolve();
			});
		});
		return promiseStartup.promise();
	};
	/**
	 * @function 
	 * @name sap.apf.ui#destroy
	 * @description Cleanup of instance level objects called on destroy of application
	 */
	this.destroy = function() {
		oFacetFilterView = undefined;
		this.getAnalysisPath().getToolbar().getController().oPrintHelper = undefined;
		this.getAnalysisPath().getCarousel().dndBox = undefined;
		closeDialogs(this);
	};
	function closeDialogs(self) {
		// Dialogs from Tool Bar control
		var toolbarController = self.getAnalysisPath().getToolbar().getController();
		var stepGalleryController = self.getAnalysisPath().getCarousel().getStepGallery().getController();
		var setpToolbarController = self.getStepContainer().getController().getView().getStepToolbar().getController();
		checkAndCloseDialog(toolbarController.saveDialog);
		checkAndCloseDialog(toolbarController.newOpenDilog);
		checkAndCloseDialog(toolbarController.newDialog);
		checkAndCloseDialog(toolbarController.delConfirmDialog);
		checkAndCloseDialog(toolbarController.confirmDialog);
		checkAndCloseDialog(toolbarController.confrimLogoffDialog);
		checkAndCloseDialog(toolbarController.errorMsgDialog);
		checkAndCloseDialog(toolbarController.noPathAddedDialog);
		checkAndCloseDialog(stepGalleryController.oHierchicalSelectDialog);
		checkAndCloseDialog(setpToolbarController.selectionDisplayDialog);
		//Selection Dialogs
		if (toolbarController.deleteAnalysisPath !== undefined) {
			checkAndCloseDialog(toolbarController.deleteAnalysisPath.getController().oDialog);
		}
		if (toolbarController.pathGallery !== undefined) {
			checkAndCloseDialog(toolbarController.pathGallery.getController().oDialog);
		}
		//Function call for View Settings Dialog
		viewDialogClose(self);
	}
	function checkAndCloseDialog(dialog) {
		if (dialog !== undefined) {
			if (dialog instanceof sap.m.ViewSettingsDialog) {
				dialog.destroy();
			} else {
				if (dialog.isOpen()) {
					dialog.close();
				}
			}
		}
	}
	function viewDialogClose(self) {
		var bIsActiveStep = false;
		var bIsSelectedRepresentatioin = false;
		var selectedRepresentation;
		if (self.getStepContainer().getController().oCoreApi.getActiveStep() !== undefined) {
			bIsActiveStep = true;
		}
		if (bIsActiveStep) {
			selectedRepresentation = self.getStepContainer().getController().oCoreApi.getActiveStep().getSelectedRepresentation();
			if (selectedRepresentation !== undefined) {
				bIsSelectedRepresentatioin = true;
			}
		}
		if (bIsSelectedRepresentatioin) {
			if (selectedRepresentation.type !== sap.apf.ui.utils.CONSTANTS.representationTypes.TABLE_REPRESENTATION) {
				if (selectedRepresentation.toggleInstance !== undefined) {
					checkAndCloseDialog(selectedRepresentation.toggleInstance.viewSettingsDialog);
				}
			} else {
				checkAndCloseDialog(selectedRepresentation.viewSettingsDialog);
			}
		}
	}
};
