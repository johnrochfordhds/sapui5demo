/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
/*global jQuery, sap*/
jQuery.sap.require("sap.apf.modeler.ui.utils.textPoolHelper");
jQuery.sap.require("sap.apf.modeler.ui.utils.nullObjectChecker");
jQuery.sap.require("sap.apf.modeler.ui.utils.optionsValueModelBuilder");
jQuery.sap.require("sap.apf.modeler.ui.utils.viewValidator");
/**
* @class facetFilter
* @name facetFilter
* @description Facet filter controller of modeler
* 			   The ViewData for this view needs the following parameters:
*  			   getCalatogServiceUri()- api to fetch uri
*  			   updateSelectedNode - Updates the tree node with ID of new face filter
*  			   updateTitleAndBreadCrumb - Updates the title of facet filter in breadcrumb
*  			   oParams - Object contains URL Context
*  			   oConfigurationHandler - Handler for configuration
*  			   oConfigurationEditor -  manages the facet filter object
*/
(function() {
	"use strict";
	var oParams, oTextReader, oConfigurationHandler, oConfigurationEditor, oTextPool, oFacetFilter, viewValidatorForFF;
	var nullObjectChecker = new sap.apf.modeler.ui.utils.NullObjectChecker();
	var optionsValueModelBuilder = new sap.apf.modeler.ui.utils.OptionsValueModelBuilder();
	// Adds 'Auto Complete Feature' to the input label field in the view using sap.apf.modeler.ui.utils.TextPoolHelper
	function _enableAutoComplete(oController) {
		var oTextPoolHelper = new sap.apf.modeler.ui.utils.TextPoolHelper(oTextPool);
		var oTranslationFormat = sap.apf.modeler.ui.utils.TranslationFormatMap.FACETFILTER_LABEL;
		var oDependenciesForText = {
			oTranslationFormat : oTranslationFormat,
			type : "text"
		};
		var oFacetFilterLabel = oController.byId("idLabel");
		oTextPoolHelper.setAutoCompleteOn(oFacetFilterLabel, oDependenciesForText);
	}
	// Sets static texts in UI
	function _setDisplayText(oController) {
		oController.byId("idFacetFilterBasicData").setTitle(oTextReader("basicData"));
		oController.byId("idFFLabel").setText(oTextReader("ffLabel"));
		oController.byId("idLabel").setPlaceholder(oTextReader("New Filter"));
		oController.byId("idFFPropertyLabel").setText(oTextReader("ffProperty"));
		oController.byId("idDoNotShowAtRuntimeLabel").setText(oTextReader("doNotShowAtRuntime"));
		oController.byId("idSelectionModeLabel").setText(oTextReader("ffSelectionMode"));
		oController.byId("idValueHelpLabel").setText(oTextReader("valueHelpMode"));
		oController.byId("idVHNone").setText(oTextReader("none"));
		oController.byId("idValueHelpRequest").setText(oTextReader("valueHelpRequest"));
		oController.byId("idConfigListOfValues").setText(oTextReader("configListOfValues"));
		oController.byId("idConfigListOfValuesLabel").setText(oTextReader("configListOfValuesLabel"));
		oController.byId("idSingleSelectionMode").setText(oTextReader("singleSelection"));
		oController.byId("idMultiSelectionMode").setText(oTextReader("multipleSelection"));
		oController.byId("idDefaultValuesTitle").setTitle(oTextReader("vhDefaultValues"));
		oController.byId("idPreselectionModeLabel").setText(oTextReader("vhDefaultValueMode"));
		oController.byId("idAutomaticSelection").setText(oTextReader("automaticValue"));
		oController.byId("idFixedValue").setText(oTextReader("fixedValues"));
		oController.byId("idFunction").setText(oTextReader("function"));
		oController.byId("idPreselectionDefaultsLabel").setText(oTextReader("vhDefaultValues"));
		oController.byId("idPreselectionFunctionLabel").setText(oTextReader("function"));
		oController.byId("idValueHelpTitle").setTitle(oTextReader("valueHelp"));
		oController.byId("idFFAliasLabel").setText(oTextReader("ffAlias"));
		oController.byId("idFilterResolutionTitle").setTitle(oTextReader("filterResolution"));
		oController.byId("idUseVHRAsFRRCheckBoxLabel").setText(oTextReader("vhCheckBoxLabel"));
	}
	// Updates the tree node with ID of the new facet filter created and icon in case of new filter; If a label change is to be updated we pass new label and ID of facet filter
	function _updateTreeNode(oController, sFacetFilterLabel) {
		var oFacetFilterInfo = {
			id : oFacetFilter.getId(),
			icon : "sap-icon://filter"
		};
		if (sFacetFilterLabel) {
			delete oFacetFilterInfo.icon;
			oFacetFilterInfo.name = sFacetFilterLabel;
		}
		oController.getView().getViewData().updateSelectedNode(oFacetFilterInfo);
	}
	// Updates the title and bread crumb with new label
	function _updateBreadCrumbOnFFLabelChange(oController, sFacetFilterLabel) {
		var sTitle = oTextReader("facetFilter") + ": " + sFacetFilterLabel;
		oController.getView().getViewData().updateTitleAndBreadCrumb(sTitle);
	}
	// Called on initialization to create a new facet filter or retrieve existing facet filter
	function _retrieveOrCreateFFObject(oController) {
		var sFacetFilterId;
		if (oParams && oParams.arguments && oParams.arguments.facetFilterId) {
			oFacetFilter = oConfigurationEditor.getFacetFilter(oParams.arguments.facetFilterId);
		}
		if (!nullObjectChecker.checkIsNotUndefined(oFacetFilter)) {
			sFacetFilterId = oConfigurationEditor.createFacetFilter();
			oFacetFilter = oConfigurationEditor.getFacetFilter(sFacetFilterId);
			_updateTreeNode(oController);
		}
	}
	// Called on initialization to create sub views VHR and FRR for facet filter
	function _instantiateSubViews(oController) {
		var requestOptionsVHRController, requestOptionsFRRController, oVHRView, oFRRView;
		var oViewData = {
			oTextReader : oTextReader,
			oConfigurationHandler : oConfigurationHandler,
			oConfigurationEditor : oConfigurationEditor,
			oParentObject : oFacetFilter,
			getCalatogServiceUri : oController.getView().getViewData().getCalatogServiceUri
		};
		//use specific controller type to reuse request options view
		requestOptionsVHRController = new sap.ui.controller("sap.apf.modeler.ui.controller.facetFilterVHR");
		oVHRView = new sap.ui.view({
			viewName : "sap.apf.modeler.ui.view.requestOptions",
			type : sap.ui.core.mvc.ViewType.XML,
			id : oController.createId("idVHRView"),
			viewData : oViewData,
			controller : requestOptionsVHRController
		});
		requestOptionsFRRController = new sap.ui.controller("sap.apf.modeler.ui.controller.facetFilterFRR");
		oFRRView = new sap.ui.view({
			viewName : "sap.apf.modeler.ui.view.requestOptions",
			type : sap.ui.core.mvc.ViewType.XML,
			id : oController.createId("idFRRView"),
			viewData : oViewData,
			controller : requestOptionsFRRController
		});
		//To be fired whenever useSameAsVHR check box is selected/unselected
		oController.getView().attachEvent("useSameAsVHREvent", oFRRView.getController().handleCopy.bind(oFRRView.getController()));
		oController.getView().attachEvent("enableDisableFRRFieldsEvent", oFRRView.getController().enableOrDisableView.bind(oFRRView.getController()));
		oVHRView.attachEvent("useSameAsVHREvent", oFRRView.getController().handleCopy.bind(oFRRView.getController()));
		//To be fired to update subView facet filter and config editor instances after reset
		oController.getView().attachEvent("updateSubViewInstancesOnResetEvent", oVHRView.getController().updateSubViewInstancesOnReset.bind(oVHRView.getController()));
		oController.getView().attachEvent("updateSubViewInstancesOnResetEvent", oFRRView.getController().updateSubViewInstancesOnReset.bind(oFRRView.getController()));
		//To be fired whenever facet filter visibility is changed
		oController.getView().attachEvent("doNotShowAtRuntimeEvent", oVHRView.getController().clearVHRFields.bind(oVHRView.getController()));
		oController.getView().attachEvent("clearVHRFieldsIfValueListEvent", oVHRView.getController().clearVHRFields.bind(oVHRView.getController()));
		oController.getView().attachEvent("doNotShowAtRuntimeEvent", oFRRView.getController().clearFRRFields.bind(oFRRView.getController()));
		oVHRView.addStyleClass("formTopPadding");
		oVHRView.addStyleClass("formBottomPadding");
		oFRRView.addStyleClass("formTopPadding");
	}
	// Called on change of visibility of facet filter and on init and takes care of UI control updates. Accepts controller context and a boolean which denotes visibility of facet filter
	function _hideOrShowForHiddenFilter(oController, bVisibleInForm) {
		oController.byId("idSelectionMode").setVisible(bVisibleInForm);
		oController.byId("idSelectionModeLabel").setVisible(bVisibleInForm);
		oController.byId("idSelectionModeRadioGroup").setSelectedButton(oController.byId("idMultiSelectionMode"));
		oController.byId("idValueHelp").setVisible(bVisibleInForm);
		oController.byId("idValueHelpLabel").setVisible(bVisibleInForm);
		oController.byId("idValueHelpRadioGroup").setSelectedButton(oController.byId("idVHNone"));
		oController.byId("idValueHelpTitle").setVisible(bVisibleInForm);
		oController.byId("idFFForm1").setVisible(bVisibleInForm);
		if (bVisibleInForm) {
			oController.byId("idFRRVBox").insertItem(oController.byId("idFRRView"));
			oController.byId("idDoNotShowAtRuntimeCheckBox").setSelected(false);
		} else {
			_setOrRemoveMandatoryForValueHelpRequest(oController, bVisibleInForm);
			_setOrRemoveMandatoryForConfigValueList(oController, bVisibleInForm);
			oController.byId("idFRRVBox").removeItem(oController.byId("idFRRView"));
			oController.byId("idUseVHRAsFRRCheckBox").setSelected(bVisibleInForm);
		}
	}
	// Called on init to set visibility of facet filter
	function _setFFVisibility(oController) {
		if (!oFacetFilter.isVisible()) {
			oController.byId("idDoNotShowAtRuntimeCheckBox").setSelected(true);
		}
		_hideOrShowForHiddenFilter(oController, oFacetFilter.isVisible());
	}
	// Called on init to set property of facet filter
	function _setFFProperty(oController) {
		var oModelForFFProp = optionsValueModelBuilder.convert(oConfigurationEditor.getAllKnownProperties());
		oController.byId("idFFProperty").setModel(oModelForFFProp);
		if (nullObjectChecker.checkIsNotNullOrUndefinedOrBlank(oFacetFilter.getProperty())) {
			oController.byId("idFFProperty").setValue(oFacetFilter.getProperty());
		}
	}
	// Called on init to set label of facet filter
	function _setFFLabel(oController) {
		// In case of a new facet filter do not set a label
		if (!nullObjectChecker.checkIsNotNullOrUndefinedOrBlank(oConfigurationEditor.getFacetFilter(oParams.arguments.facetFilterId))) {
			return;
		}
		if (nullObjectChecker.checkIsNotNullOrUndefinedOrBlank(oFacetFilter.getLabelKey()) && oTextPool.get(oFacetFilter.getLabelKey())) {
			oController.byId("idLabel").setValue(oTextPool.get(oFacetFilter.getLabelKey()).TextElementDescription);
		} else {
			oController.byId("idLabel").setValue(oFacetFilter.getId());
		}
	}
	// Called on init to set alias of facet filter
	function _setFFAlias(oController) {
		var oModelForFFAlias = optionsValueModelBuilder.convert(oConfigurationEditor.getAllKnownProperties());
		oController.byId("idFFAlias").setModel(oModelForFFAlias);
		if (nullObjectChecker.checkIsNotNullOrUndefinedOrBlank(oFacetFilter.getAlias())) {
			oController.byId("idFFAlias").setValue(oFacetFilter.getAlias());
		}
	}
	// Called on init to set selection mode of facet filter
	function _setFFSelectionMode(oController) {
		if (!nullObjectChecker.checkIsNotNullOrUndefinedOrBlank(oConfigurationEditor.getFacetFilter(oParams.arguments.facetFilterId))) {
			oFacetFilter.setMultiSelection(true);// By default new facet filters are of single select and therefore set to multi select when created
		}
		if (oFacetFilter.isMultiSelection()) {
			oController.byId("idSelectionModeRadioGroup").setSelectedButton(oController.byId("idMultiSelectionMode"));
		} else {
			oController.byId("idSelectionModeRadioGroup").setSelectedButton(oController.byId("idSingleSelectionMode"));
		}
	}
	function _setPreselectionFunction(oController) {
		oController.byId("idPreselectionFunction").setValue("");
		if (nullObjectChecker.checkIsNotNullOrUndefinedOrBlank(oFacetFilter.getPreselectionFunction())) {
			oController.byId("idPreselectionFunction").setValue(oFacetFilter.getPreselectionFunction());
		}
	}
	// Sets default value mode and model on Init. For a new filter preselection mode is set to fixed values
	function _setDefaultValueMode(oController) {
		var bIsFunction = false, bIsFixedValue = false;
		if (oFacetFilter.getAutomaticSelection()) {
			oController.byId("idPreselectionModeRadioGroup").setSelectedButton(oController.byId("idAutomaticSelection"));
		} else {
			if (nullObjectChecker.checkIsNotNullOrUndefinedOrBlank(oFacetFilter.getPreselectionFunction())) {
				oController.byId("idPreselectionModeRadioGroup").setSelectedButton(oController.byId("idFunction"));
				_setPreselectionFunction(oController);
				bIsFunction = true;
			} else {
				oController.byId("idPreselectionModeRadioGroup").setSelectedButton(oController.byId("idFixedValue"));
				_setPreselectionDefaults(oController);
				bIsFixedValue = true;
			}
		}
		_setOrRemoveMandatoryForPreselectionFunction(oController, bIsFunction);
		_setOrRemoveMandatoryForPreselectionDefault(oController, bIsFixedValue);
	}
	// sets or hides it in the UI and removes it from the mandatory fields or Displays preselection function fields, sets it as required and adds it to mandatory fields
	function _setOrRemoveMandatoryForPreselectionFunction(oController, bVisible) {
		oController.byId("idPreselectionFunctionLabel").setVisible(bVisible);
		oController.byId("idPreselectionFunction").setVisible(bVisible);
		if (bVisible) {
			viewValidatorForFF.addField("idPreselectionFunction");
		} else {
			oController.byId("idPreselectionFunction").setValue("");
			viewValidatorForFF.removeField("idPreselectionFunction");
		}
	}
	// sets or hides it in the UI and removes it from mandatory fields or Displays preselection default fields, sets it as required and adds it to mandatory fields if selection mode is single select
	function _setOrRemoveMandatoryForPreselectionDefault(oController, bVisible) {
		oController.byId("idPreselectionDefaultsLabel").setVisible(bVisible);
		oController.byId("idPreselectionDefaults").setVisible(bVisible);
		if (bVisible) {
			viewValidatorForFF.addField("idPreselectionDefaults");
		} else {
			viewValidatorForFF.removeField("idPreselectionDefaults");
		}
	}
	// sets the preselection default value
	function _setPreselectionDefaults(oController) {
		oController.byId("idPreselectionDefaults").setTokens([]);
		var defaultValueListArray = oFacetFilter.getPreselectionDefaults();
		if (nullObjectChecker.checkIsNotNullOrUndefinedOrBlank(defaultValueListArray)) {
			defaultValueListArray.forEach(function(defaultValueForToken) {
				oController.byId("idPreselectionDefaults").addToken(new sap.m.Token({
					text : defaultValueForToken
				}));
			});
		}
	}
	// Sets config list value
	function _setConfigValueList(oController) {
		oController.byId("idConfigListOfValuesMultiInput").setTokens([]);
		var valueListArray = oFacetFilter.getValueList();
		if (nullObjectChecker.checkIsNotNullOrUndefinedOrBlank(valueListArray)) {
			valueListArray.forEach(function(configTextForToken) {
				oController.byId("idConfigListOfValuesMultiInput").addToken(new sap.m.Token({
					text : configTextForToken
				}));
			});
		}
	}
	// sets or removes the required fields (Multi input fields) based on boolean
	function _setOrRemoveMandatoryForConfigValueList(oController, bIsVisible) {
		oController.byId("idConfigListOfValuesLabel").setVisible(bIsVisible);
		oController.byId("idConfigListOfValuesMultiInput").setVisible(bIsVisible);
		if (bIsVisible) {
			viewValidatorForFF.addField("idConfigListOfValuesMultiInput");
		} else {
			viewValidatorForFF.removeField("idConfigListOfValuesMultiInput");
		}
	}
	// sets or removes the required fields (value help request fields) based on boolean
	function _setOrRemoveMandatoryForValueHelpRequest(oController, bIsVisible) {
		oController.byId("idFFAliasLabel").setVisible(bIsVisible);
		oController.byId("idFFAlias").setVisible(bIsVisible);
		if (bIsVisible) {
			oController.byId("idVHRVBox").insertItem(oController.byId("idVHRView"));
		} else {
			oController.getView().fireEvent("clearVHRFieldsIfValueListEvent");
			oController.byId("idFFAlias").setValue("");
			oController.byId("idVHRVBox").removeItem(oController.byId("idVHRView"));
		}
	}
	// Sets the useVHRCheckBox value and triggers event to disable FRR fields if selected on init
	function _setUseVHRCheckBox(oController) {
		if (oFacetFilter.getUseSameRequestForValueHelpAndFilterResolution()) { // if the same request has to be used for filter resolution
			oController.byId("idUseVHRAsFRRCheckBox").setSelected(true);
			oController.getView().fireEvent("enableDisableFRRFieldsEvent");
		}
	}
	//set value help mode based on the availability of values none/value help request/ config value list
	function _setValueHelpMode(oController) {
		var bIsValueHelp = false, bIsConfigListOfValue = false;
		if (nullObjectChecker.checkIsNotNullOrUndefinedOrBlank(oFacetFilter.getServiceOfValueHelp())) {
			bIsValueHelp = true;
			_hideOrShowUseVHRAsFRRCheckBox(oController, true);
			oController.byId("idValueHelpRadioGroup").setSelectedButton(oController.byId("idValueHelpRequest"));
		} else if (nullObjectChecker.checkIsNotNullOrUndefinedOrBlank(oFacetFilter.getValueList())) {
			_setConfigValueList(oController);
			bIsConfigListOfValue = true;
			oController.byId("idValueHelpRadioGroup").setSelectedButton(oController.byId("idConfigListOfValues"));
		} else {
			oController.byId("idValueHelpRadioGroup").setSelectedButton(oController.byId("idVHNone"));
		}
		_setOrRemoveMandatoryForValueHelpRequest(oController, bIsValueHelp);
		_setOrRemoveMandatoryForConfigValueList(oController, bIsConfigListOfValue);
	}
	function _hideOrShowUseVHRAsFRRCheckBox(oController, bIsShowFRRCheckBox) {
		oController.byId("idUseVHRAsFRRCheckBox").setVisible(bIsShowFRRCheckBox);
		oController.byId("idUseVHRAsFRRCheckBoxLabel").setVisible(bIsShowFRRCheckBox);
	}
	function _setValueStateForFixedValue(warningMessageKey, oController) {
		oController.byId("idPreselectionDefaults").setValueState(sap.ui.core.ValueState.Warning);
		oController.byId("idPreselectionDefaults").setValueStateText(oTextReader(warningMessageKey));
		oController.byId('idPreselectionDefaults').focus();
	}
	function _addTokenForMultiInputField(textForToken, oMultiInputControl) {
		var aPreselectionDefaults = new sap.m.Token({
			text : textForToken
		});
		oMultiInputControl.addToken(aPreselectionDefaults);
		oConfigurationEditor.setIsUnsaved();
	}
	function _tokenChangeAttachEvent(oMultiInputControl, tokenChangeHandlerEvent) {
		if (oMultiInputControl.mEventRegistry.tokenChange === undefined) {
			oMultiInputControl.attachTokenChange(tokenChangeHandlerEvent);
		}
	}
	sap.ui.controller("sap.apf.modeler.ui.controller.facetFilter", {
		// Called on initialization of the view. Sets the static texts for all controls in UI. Initializes VHR and FRR subviews. Creates or retrieves facet filter object
		onInit : function() {
			var oController = this;
			var oViewData = oController.getView().getViewData();
			oTextReader = oViewData.getText;
			oParams = oViewData.oParams;
			oConfigurationHandler = oViewData.oConfigurationHandler;
			oTextPool = oConfigurationHandler.getTextPool();
			oConfigurationEditor = oViewData.oConfigurationEditor;
			if (!oConfigurationEditor) {
				oConfigurationHandler.loadConfiguration(oParams.arguments.configId, function(configurationEditor) {
					oConfigurationEditor = configurationEditor;
				});
			}
			viewValidatorForFF = new sap.apf.modeler.ui.utils.ViewValidator(oController.getView());
			_setDisplayText(oController);
			_enableAutoComplete(oController);
			_retrieveOrCreateFFObject(oController);
			_instantiateSubViews(oController);
			oController.setDetailData();
			//Set Mandatory Fields
			viewValidatorForFF.addFields([ "idFFProperty", "idLabel" ]);
		},
		onAfterRendering : function() {
			var oController = this;
			_tokenChangeAttachEvent(oController.byId("idConfigListOfValuesMultiInput"), oController.handleTokenChangeForConfigListOfValues.bind(oController));
			_tokenChangeAttachEvent(oController.byId("idPreselectionDefaults"), oController.handleTokenChangeForPreselectionDefaults.bind(oController));
		},
		// Sets data on all controls
		setDetailData : function() {
			var oController = this;
			_setFFVisibility(oController);
			_setFFProperty(oController);
			_setFFLabel(oController);
			_setFFAlias(oController);
			_setFFSelectionMode(oController);
			_setDefaultValueMode(oController);
			_setValueHelpMode(oController);
			_setUseVHRCheckBox(oController);
		},
		// Updates facet filter object and config editor on reset
		updateSubViewInstancesOnReset : function(oConfigEditor) {
			var oController = this;
			oConfigurationEditor = oConfigEditor;
			oFacetFilter = oConfigurationEditor.getFacetFilter(oFacetFilter.getId());
			oController.getView().fireEvent("updateSubViewInstancesOnResetEvent", [ oConfigurationEditor, oFacetFilter ]);
		},
		// Fires enable of FRR fields if facet filter is set to invisible. By default sets selection mode to multiple. Triggers event to show/hide UI controls on visible/invisible
		handleChangeForVisibilityAtRuntime : function() {
			var oController = this, bVisibleInRuntime = true;
			if (oController.byId("idDoNotShowAtRuntimeCheckBox").getSelected()) {
				bVisibleInRuntime = false;
				oFacetFilter.setInvisible();
				oFacetFilter.setUseSameRequestForValueHelpAndFilterResolution(false);
				oController.getView().fireEvent("enableDisableFRRFieldsEvent");
				oController.getView().fireEvent("doNotShowAtRuntimeEvent");
				oFacetFilter.setValueList([]);
				_setConfigValueList(oController);
			} else {
				oFacetFilter.setVisible();
			}
			oFacetFilter.setMultiSelection(true);
			oConfigurationEditor.setIsUnsaved();
			//UI changes on hide/show
			_hideOrShowForHiddenFilter(oController, bVisibleInRuntime);
		},
		// Updates property of facet filter on change
		handleChangeForProperty : function() {
			var oController = this;
			var sFacetFilterProperty = oController.byId("idFFProperty").getValue().trim();
			if (nullObjectChecker.checkIsNotNullOrUndefinedOrBlank(sFacetFilterProperty)) {
				oFacetFilter.setProperty(sFacetFilterProperty);
			}
			oConfigurationEditor.setIsUnsaved();
		},
		// Updates label of facet filter on change and also tree node, title and breadcrumb if not empty
		handleChangeForLabel : function() {
			var oController = this;
			var sFacetFilterLabelId;
			var sFacetFilterLabel = oController.byId("idLabel").getValue().trim();
			var oTranslationFormat = sap.apf.modeler.ui.utils.TranslationFormatMap.FACETFILTER_LABEL;
			if (nullObjectChecker.checkIsNotNullOrUndefinedOrBlank(sFacetFilterLabel)) {
				sFacetFilterLabelId = oTextPool.setText(sFacetFilterLabel, oTranslationFormat);
				oFacetFilter.setLabelKey(sFacetFilterLabelId);
				_updateTreeNode(oController, sFacetFilterLabel);
				_updateBreadCrumbOnFFLabelChange(oController, sFacetFilterLabel);
			}
			oConfigurationEditor.setIsUnsaved();
		},
		// Updates alias of facet filter on change
		handleChangeForAlias : function() {
			var oController = this;
			var sFacetFilterAlias = oController.byId("idFFAlias").getValue().trim();
			oFacetFilter.setAlias(undefined);
			if (nullObjectChecker.checkIsNotNullOrUndefinedOrBlank(sFacetFilterAlias)) {
				oFacetFilter.setAlias(sFacetFilterAlias);
			}
			oConfigurationEditor.setIsUnsaved();
		},
		// Updates selection mode of facet filter on change; Changes required tag of preselection mode controls
		handleChangeForSelectionMode : function() {
			var oController = this, aPSDefaults, oDefaultTokenForSingleSelection;
			var bSelectedButton = oController.byId("idSelectionModeRadioGroup").getSelectedButton();
			if (bSelectedButton === oController.byId("idSingleSelectionMode")) {
				oFacetFilter.setMultiSelection(false);
				if (oController.byId("idPreselectionDefaultsLabel").getVisible()) {
					aPSDefaults = oFacetFilter.getPreselectionDefaults();
					if (aPSDefaults && aPSDefaults.length > 1) {
						//Single select filter and therefore setting only first default value and ignoring rest
						oFacetFilter.setPreselectionDefaults([ aPSDefaults[0] ]);
						oDefaultTokenForSingleSelection = new sap.m.Token({
							text : aPSDefaults[0]
						});
						oController.byId("idPreselectionDefaults").setTokens([ oDefaultTokenForSingleSelection ]);
						_setValueStateForFixedValue("singleToMultipleSelectionWarningMessage", oController);
					}
				}
			} else {
				oController.byId("idPreselectionDefaults").setValueState(sap.ui.core.ValueState.None);
				oFacetFilter.setMultiSelection(true);
			}
			oConfigurationEditor.setIsUnsaved();
		},
		// Updates preselection mode of facet filter on change; Hides/shows preselection defaults/function
		handleChangeForPreselectionMode : function() {
			var oController = this, bAutomatic = false, bPreselectionFunctionVisible = false, bPreselectionDefaultVisible = false;
			switch (oController.byId("idPreselectionModeRadioGroup").getSelectedButton()) {
				case oController.byId("idFunction"):
					bPreselectionFunctionVisible = true;
					oFacetFilter.removePreselectionDefaults();
					break;
				case oController.byId("idFixedValue"):
					bPreselectionDefaultVisible = true;
					oFacetFilter.removePreselectionFunction();
					break;
				default:
					bAutomatic = true;
			}
			oFacetFilter.setAutomaticSelection(bAutomatic);
			_setPreselectionDefaults(oController);
			_setPreselectionFunction(oController);
			_setOrRemoveMandatoryForPreselectionDefault(oController, bPreselectionDefaultVisible);
			_setOrRemoveMandatoryForPreselectionFunction(oController, bPreselectionFunctionVisible);
			oConfigurationEditor.setIsUnsaved();
		},
		//handles and updates preselection defaults of facet filter 
		handleChangeForPreselectionDefaults : function(oEvent) {
			var oController = this;
			oController.byId("idPreselectionDefaults").setValue("");
			oController.byId("idPreselectionDefaults").setValueState(sap.ui.core.ValueState.None);
			if (!oFacetFilter.isMultiSelection()) {
				if (oController.byId("idPreselectionDefaults").getTokens().length < 1) {
					oController.byId("idPreselectionDefaults").setValueState(sap.ui.core.ValueState.None);
					_addTokenForMultiInputField(oEvent.getParameter("value"), oController.byId("idPreselectionDefaults"));
				} else {
					_setValueStateForFixedValue("singleSelectionWarningMessage", oController);
				}
			} else {
				_addTokenForMultiInputField(oEvent.getParameter("value"), oController.byId("idPreselectionDefaults"));
			}
		},
		//handles when token is added or removed for preselection defaults of facet filter based on selection mode
		handleTokenChangeForPreselectionDefaults : function(oEvent) {
			var oController = this;
			var i, stringsToSetDefaultValue = [];
			var tokenArrayForPreSelectionDefault = oController.byId("idPreselectionDefaults").getTokens();
			oController.byId("idPreselectionDefaults").setValueState(sap.ui.core.ValueState.None);
			if (oEvent.getParameters().type === "removed" || oEvent.getParameters().type === "added") {
				for(i = 0; i < tokenArrayForPreSelectionDefault.length; i++) {
					stringsToSetDefaultValue[i] = tokenArrayForPreSelectionDefault[i].getText();
				}
				if (oFacetFilter.isMultiSelection()) {
					oFacetFilter.setPreselectionDefaults(stringsToSetDefaultValue);
				} else {
					oFacetFilter.setPreselectionDefaults([ stringsToSetDefaultValue[0] ]);
				}
				//Configuration Editor is set unsaved in tokenChange event only in case of removing the token because while removing the token, handler for pre selection default is not called.
				if (oEvent.getParameters().type === "removed") {
					oConfigurationEditor.setIsUnsaved();
				}
			}
		},
		// Updates preselection function of facet filter
		handleChangeForPreselectionFunction : function() {
			var oController = this;
			var sPreselectionFunction = oController.byId("idPreselectionFunction").getValue().trim();
			oFacetFilter.removePreselectionFunction();
			if (nullObjectChecker.checkIsNotNullOrUndefinedOrBlank(sPreselectionFunction)) {
				oFacetFilter.setPreselectionFunction(sPreselectionFunction);
			}
			oConfigurationEditor.setIsUnsaved();
		},
		// Updates facet filter to use same request as VHR or not; Fires events to copy VHR values to FRR and also to enable/disable FRR views
		handleChangeForUseVHRAsFRRCheckBox : function() {
			var oController = this;
			if (oController.byId("idUseVHRAsFRRCheckBox").getSelected()) {
				oFacetFilter.setUseSameRequestForValueHelpAndFilterResolution(true);
			} else {
				oFacetFilter.setUseSameRequestForValueHelpAndFilterResolution(false);
			}
			oController.getView().fireEvent("enableDisableFRRFieldsEvent");
			oController.getView().fireEvent("useSameAsVHREvent");
			oConfigurationEditor.setIsUnsaved();
		},
		// Updates value mode of facet filter on change; Hides/shows value help request/value config list/ none
		handleChangeForValueHelpOption : function() {
			var oController = this, bVisibleVHR = false, bVisibleValueList = false;
			switch (oController.byId("idValueHelpRadioGroup").getSelectedButton()) {
				case oController.byId("idValueHelpRequest"):
					bVisibleVHR = true;
					oFacetFilter.setValueList([]);
					break;
				case oController.byId("idConfigListOfValues"):
					bVisibleValueList = true;
					oFacetFilter.setAlias(undefined);
					break;
				default:
					oFacetFilter.setAlias(undefined);
					oFacetFilter.setValueList([]);
			}
			if (oFacetFilter.getUseSameRequestForValueHelpAndFilterResolution() === true) {
				oFacetFilter.setUseSameRequestForValueHelpAndFilterResolution(false);
				oController.byId("idUseVHRAsFRRCheckBox").setSelected(false);
			}
			oController.getView().fireEvent("enableDisableFRRFieldsEvent");
			_hideOrShowUseVHRAsFRRCheckBox(oController, bVisibleVHR);
			_setConfigValueList(oController);
			_setOrRemoveMandatoryForValueHelpRequest(oController, bVisibleVHR);
			_setOrRemoveMandatoryForConfigValueList(oController, bVisibleValueList);
			oConfigurationEditor.setIsUnsaved();
		},
		// Updates configuration list of facet filter
		handleChangeForConfigListOfValues : function(oEvent) {
			var oController = this;
			oController.byId("idConfigListOfValuesMultiInput").setValue("");
			_addTokenForMultiInputField(oEvent.getParameter("value"), oController.byId("idConfigListOfValuesMultiInput"));
		},
		//Updates the token of configuration list of facet filter (add/ remove token)
		handleTokenChangeForConfigListOfValues : function(oEvent) {
			var oController = this;
			var i, stringOfTokenArray = [];
			var tokenArrayForConfigList = oController.byId("idConfigListOfValuesMultiInput").getTokens();
			if (oEvent.getParameters().type === "removed" || oEvent.getParameters().type === "added") {
				for(i = 0; i < tokenArrayForConfigList.length; i++) {
					stringOfTokenArray[i] = tokenArrayForConfigList[i].getText();
				}
				oFacetFilter.setValueList(stringOfTokenArray);
				//Configuration Editor is set unsaved in tokenChange event only in case of removing the token because while removing the token, handler for ConfigListOfValue is not called.
				if (oEvent.getParameters().type === "removed") {
					oConfigurationEditor.setIsUnsaved();
				}
			}
		},
		// returns the current validation state of parent view along with sub views VHR and FRR
		getValidationState : function() {
			var oController = this;
			return viewValidatorForFF.getValidationState() && oController.byId("idVHRView").getController().getValidationState() && oController.byId("idFRRView").getController().getValidationState();
		},
		// Triggered when facet filter view is destroyed and destroys sub views VHR and FRR
		onExit : function() {
			var oController = this;
			oController.byId("idVHRView").destroy();
			oController.byId("idFRRView").destroy();
		}
	});
}());