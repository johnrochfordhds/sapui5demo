/*!
* SAP APF Analysis Path Framework
* 
 * (c) Copyright 2012-2014 SAP SE. All rights reserved
*/
jQuery.sap.require('sap.apf.ui.utils.facetFilterListHandler');
jQuery.sap.require('sap.apf.ui.utils.facetFilterListConverter');
jQuery.sap.require('sap.apf.ui.utils.facetFilterValueFormatter');
/**
* @class facetFilter
* @memberOf sap.apf.ui.reuse.controller
* @name facetFilter
* @description controller facetFilter view
*/
(function() {
	'use strict';
	/* Selections are cached on init and during change for each list in order to compare whether change occurred
	 * Example : aCachedSelectedKeys = {
	 * 				"__list0" : ["20100101"],
	 * 				"__list1" : ["4000", "5000"]
	 * 			 }
	 */
	var aCachedSelectedKeys = {};
	/* Declaration of facet filter list handler which will be associated with each facet filter list
	 * Example : aFacetFilterListHandlers = {
	 * 				"__list0" : sap.apf.ui.utils.facetFilterListHandler,
	 * 				"__list1" : sap.apf.ui.utils.facetFilterListHandler
	 * 			 }
	 */
	var aFacetFilterListHandlers = {};
	// Boolean to check if facet filter list selections changed
	var bSelectionChanged;
	//Facet filter list converter is used to modify the values in the form understandable by the control
	var oFacetFilterListConverter = new sap.apf.ui.utils.FacetFilterListConverter();
	/**
	 * @private
	 * @function
	 * @name sap.apf.ui.reuse.controller.facetFilter#_populateAndSelectFFListValuesFor
	 * @param oFacetFilterListControl : facet filter list control [Passed from bind function] Example : sap.m.FacetFilterList,
	 * 	      {array} aFilterValues : Filter values for the facet filter list control [Resolved from promise]
	 * 				  Example : [ {
									"StartDate" : "20000101"
								}, {
									"StartDate" : "20000201"
								} ]
	 * @description Formats the filter values and converts the values in the form understandable by facet filter list control and sets the data in the model for the filter control
	 * */
	function _populateFFListValuesFor(oFacetFilterListControl, oGetValuesPromiseArgs) {
		var oFacetFilterListModel = oFacetFilterListControl.getModel();
		var aFFValueFormatter = new sap.apf.ui.utils.FacetFilterValueFormatter();
		oGetValuesPromiseArgs.oFormatterArgs.aFilterValues = oGetValuesPromiseArgs.aFilterValues;
		var aFormattedFilterValues = aFFValueFormatter.getFormattedFFData(oGetValuesPromiseArgs.oFormatterArgs);
		//Facet filter list converter is used to modify the values in the form understandable by the control
		var aModifiedFilterValues = oFacetFilterListConverter.getFFListDataFromFilterValues(aFormattedFilterValues, oGetValuesPromiseArgs.oFormatterArgs.sSelectProperty);
		//Register on the new promise to get updates on reset, new or open path and also when filters propagate restrictions to dependent filters
		oGetValuesPromiseArgs.oFilterRestrictionPropagationPromiseForValues.done(function(oNewValues, oNewFilterRestrictionPropagationPromise) {
			_populateFFListValuesFor(oFacetFilterListControl, {
				aFilterValues : oNewValues,
				oFilterRestrictionPropagationPromiseForValues : oNewFilterRestrictionPropagationPromise,
				oFormatterArgs : oGetValuesPromiseArgs.oFormatterArgs
			});
		});
		//Modify the  size limit of the model based on the length of the data so that all values are shown in the facet filter list.
		oFacetFilterListModel.setSizeLimit(aModifiedFilterValues.length);
		//Updates the facet filter list with the values
		oFacetFilterListModel.setData(aModifiedFilterValues);
		oFacetFilterListModel.updateBindings();
	}
	/**
	 * @private
	 * @function
	 * @name sap.apf.ui.reuse.controller.facetFilter#_removeFFListOnError
	 * @param oFacetFilterListControl : facet filter list control [Passed from bind function] Example : sap.m.FacetFilterList
	 * @description Gets the facet filter control if get values failed
	 * It removes the filter from the UI
	 * */
	function _removeFFListOnError(oFacetFilterListControl) {
		var oController = this;
		oController.getView().byId("idAPFFacetFilter").removeList(oFacetFilterListControl);
	}
	/**
	 * @private
	 * @function
	 * @name sap.apf.ui.reuse.controller.facetFilter#_updateSelectedValuesForFFList
	 * @param {Array} Facet filter list data
	 * 		  Example : [ {
							"key" : "20000101",
							"text" : "1/1/2000",
							"selected" : false
						}, {
							"key" : "20000201",
							"text" : "2/1/2000",
							"selected" : false
						} ],
	 * 		  {Array} Selected filter value keys Example : [ "20000201" ]
	 * @description Updates the facet filter list items with the selections
	 * @returns {Array} of facet filter list data with updated selections
	 * 			 Example : [ {
							"key" : "20000101",
							"text" : "1/1/2000",
							"selected" : false
						}, {
							"key" : "20000201",
							"text" : "2/1/2000",
							"selected" : true
						} ]
	 * */
	function _updateSelectedValuesForFFList(aFacetFilterListData, oFFSelectedValues) {
		var index;
		//First we make the selected value of all items as false
		aFacetFilterListData.forEach(function(oFacetFilterListData) {
			oFacetFilterListData.selected = false;
		});
		//Now we update only the items to be selected. This is not done if all values are to be selected.
		oFFSelectedValues.forEach(function(oFFSelectedValue) {
			for(index = 0; index < aFacetFilterListData.length; index++) {
				if (oFFSelectedValue === aFacetFilterListData[index].key) {
					aFacetFilterListData[index].selected = true;
					break;
				}
			}
		});
		return aFacetFilterListData;
	}
	/**
	 * @private
	 * @function
	 * @name sap.apf.ui.reuse.controller.facetFilter#_updateSelectedFilterFor
	 * @param oFacetFilterListControl : facet filter list control [Passed from bind function] Example : sap.m.FacetFilterList,
	 * 		  {Array} aSelectedFilterValues : Selected filter values/keys for the facet filter list control [Resolved from promise] Example : [ "20000201" ]
	 * @description Sets the data in the model for the filter control
	 * */
	function _updateSelectedFilterFor(oFacetFilterListControl, oGetSelectedValuesPromiseArgs) {
		var sFacetFilterListId = oFacetFilterListControl.getId();
		var oFacetFilterListModel = oFacetFilterListControl.getModel();
		var aFacetFilterListDataSet = oFacetFilterListModel.getData();
		//Register on the new promise to get updates on reset, new or open path and also when filters propagate restrictions to dependent filters
		oGetSelectedValuesPromiseArgs.oFilterRestrictionPropagationPromiseForSelectedValues.done(function(oNewSelectedValues, oNewFilterRestrictionPropagationPromise) {
			//Facet filter list stores selections even if items are no longer available in the list and so we clear them before updating selections
			oFacetFilterListControl.removeSelectedKeys();
			_updateSelectedFilterFor(oFacetFilterListControl, {
				aSelectedFilterValues : oNewSelectedValues,
				oFilterRestrictionPropagationPromiseForSelectedValues : oNewFilterRestrictionPropagationPromise
			});
		});
		/*
		 * Caching the selected values for later updates( to compare and check whether changes were made)
		 */
		aCachedSelectedKeys[sFacetFilterListId] = oGetSelectedValuesPromiseArgs.aSelectedFilterValues;
		//Updates the facet filter list data with the selected values
		aFacetFilterListDataSet = _updateSelectedValuesForFFList(aFacetFilterListDataSet, oGetSelectedValuesPromiseArgs.aSelectedFilterValues);
		oFacetFilterListModel.setData(aFacetFilterListDataSet);
		oFacetFilterListModel.updateBindings();
		//Facet filter list's parent(Facet filter control) needs to be rerendered to display implicit updates(without user action)
		oFacetFilterListControl.getParent().rerender();
	}
	/**
	 * @private
	 * @function
	 * @name sap.apf.ui.reuse.controller.facetFilter#_populateAndSelectFFListValues
	 * @param The facet filter controller context
	 * @description Fetches filter values for all facet filter list controls. Later fetches the selected values for the control and updates
	 * */
	function _populateAndSelectFFListValues(oController) {
		var aFacetFilterListControls = oController.getView().byId("idAPFFacetFilter").getLists();
		aFacetFilterListControls.forEach(function(oFacetFilterListControl) {
			/*
			 * For each facet filter list, fetch the values then populate the values on the control
			 * If fetch of values failed remove the facet filter list from UI
			 * After fetch of values, fetch selected values for each facet filte rlist and update the control
			 */
			//Bind function accepts the context as the first parameter and the other parameters are passed as parameters to the function it is bound to
			(aFacetFilterListHandlers[oFacetFilterListControl.getId()].getFacetFilterListData().then(_populateFFListValuesFor.bind(null, oFacetFilterListControl), _removeFFListOnError.bind(oController, oFacetFilterListControl))).then(function() {
				aFacetFilterListHandlers[oFacetFilterListControl.getId()].getSelectedFFValues().then(_updateSelectedFilterFor.bind(null, oFacetFilterListControl));
			});
		});
	}
	sap.ui.controller("sap.apf.ui.reuse.controller.facetFilter", {
		/**
		 * @public
		 * @function
		 * @name sap.apf.ui.reuse.controller.facetFilter#onInit
		 * @description Called on initialization of the view
		 * Instantiates all facet filter list handlers
		 * Populates and selects the filter values
		 * */
		onInit : function() {
			var oController = this, sFacetFilterListId;
			if (sap.ui.Device.system.desktop) {
				oController.getView().addStyleClass("sapUiSizeCompact");
			}
			bSelectionChanged = false;
			var oViewData = oController.getView().getViewData();
			/*
			 * Creation of a facetFilterListHandler for each facet filter list
			 * Key of each facetFilterListhandler is the ID of the facet filter list control
			 */
			oViewData.aConfiguredFilters.forEach(function(oConfiguredFilter, nIndex) {
				sFacetFilterListId = oController.getView().byId("idAPFFacetFilter").getLists()[nIndex].getId();
				aFacetFilterListHandlers[sFacetFilterListId] = new sap.apf.ui.utils.FacetFilterListHandler(oViewData.oCoreApi, oViewData.oUiApi, oConfiguredFilter, oFacetFilterListConverter);
			});
			_populateAndSelectFFListValues(oController);
		},
		/**
		 * @public
		 * @function
		 * @name sap.apf.ui.reuse.controller.facetFilter#onListClose
		 * @param {oEvent} List Close Event
		 * @description Sets the selected values on the filter and calls the selection changed event
		 * */
		onListClose : function(oEvent) {
			var oController = this;
			var oClosedListControl = oEvent.getSource();
			var aSelectedKeys = [], aSelectedItems, sClosedListId, aCachedSelections, sSortedSelectedKeys, sSortedCachedSelections, bFilterChanged;
			aSelectedItems = oClosedListControl.getSelectedItems();
			aSelectedKeys = aSelectedItems.map(function(oItem) {
				return oItem.getKey();
			});
			//Compare current selections with cache.
			sClosedListId = oClosedListControl.getId();
			aCachedSelections = aCachedSelectedKeys[sClosedListId];
			if (aCachedSelections !== undefined) {
				sSortedSelectedKeys = JSON.stringify(aSelectedKeys.sort());
				sSortedCachedSelections = JSON.stringify(aCachedSelections.sort());
				bFilterChanged = (sSortedSelectedKeys === sSortedCachedSelections);
				//After comparison of cached and current selections, if filters changed update the cached keys and set the selected keys on the filter
				if (!bFilterChanged) {
					aCachedSelectedKeys[sClosedListId] = aSelectedKeys;
					//Boolean is set to true since there was a change in selections of facet filter list
					bSelectionChanged = true;
					aFacetFilterListHandlers[sClosedListId].setSelectedFFValues(aSelectedKeys);
					//Trigger selection changed to update path
					oController.getView().getViewData().oUiApi.selectionChanged(true);
				}
			}
		},
		/**
		 * @public
		 * @function
		 * @name sap.apf.ui.reuse.controller.facetFilter#onResetPress
		 * @description Reset to the initial filter values for all the facet filter list controls
		 * */
		onResetPress : function() {
			var oController = this;
			//Check to see if there is any change in initial state of facet filter
			if (bSelectionChanged) {
				oController.getView().getViewData().oStartFilterHandler.resetVisibleStartFilters();
				//Trigger selection changed to update path
				oController.getView().getViewData().oUiApi.selectionChanged(true);
				//Boolean is reset after facet filter lists are reset to initial state
				bSelectionChanged = false;
			}
		}
	});
}());