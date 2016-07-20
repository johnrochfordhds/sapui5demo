/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
jQuery.sap.declare('sap.apf.ui.utils.facetFilterListHandler');
/**
 * @class Facet filter list handler
 * @name sap.apf.ui.utils.FacetFilterHandler
 * @param {sap.apf.core.instance} oCore Api
 * @param {sap.apf.ui.instance} oUi Api
 * @param {sap.apf.utils.StartFilter} A configured visible filter
 * @param {sap.apf.ui.utils.FacetFilterListConverter} modify the values in the form understandable by the control and vice versa
 * @description Handler for facet filter list controls
 */
sap.apf.ui.utils.FacetFilterListHandler = function(oCoreApi, oUiApi, oConfiguredFilter, oFacetFilterListConverter) {
	"use strict";
	/**
	 * @private
	 * @function
	 * @name sap.apf.ui.utils.FacetFilterHandler#_errorOnNoFacetFilterData
	 * @description Creates a message object for the failed filter and puts the message
	 * */
	function _errorOnNoFacetFilterData() {
		var oMessageObject = oCoreApi.createMessageObject({
			code : "6010",
			aParameters : [ oCoreApi.getTextNotHtmlEncoded(oConfiguredFilter.getLabel()) ]
		});
		oCoreApi.putMessage(oMessageObject);
	}
	/**
	 * @public
	 * @function
	 * @name sap.apf.ui.utils.FacetFilterHandler#getFacetFilterListData
	 * @description Gets filter values and metadata information for the filter property
	 * @returns {Deferred} oFFValuePromise
	 * If get values was successful, oFFValuePromise resolved with converted filter values, the new filter restriction promise for values and arguments for formatter
	 * If get values was successful and was resolved with null or [] or was rejected, reject oFFValuePromise with []
	 * Example resolve when data was returned: 
	 * [ {
			"StartDate" : "20000101"
		}, {
			"StartDate" : "20000201"
		} ]
	 * */
	this.getFacetFilterListData = function() {
		var sSelectProperty, oFormatterArgs;
		var oFFValuePromise = jQuery.Deferred();
		var aFacetFilterListData = oConfiguredFilter.getValues();
		aFacetFilterListData.then(function(aFilterValues, oNewFilterRestrictionPropagationPromise) {
			if (aFilterValues === null || aFilterValues.length === 0) {
				_errorOnNoFacetFilterData();
				oFFValuePromise.reject([]);
			} else {
				sSelectProperty = oConfiguredFilter.getAliasNameIfExistsElsePropertyName() || oConfiguredFilter.getPropertyName();
				oConfiguredFilter.getMetadata().then(function(oPropertyMetadata) {
					oFormatterArgs = {
						oCoreApi : oCoreApi,
						oUiApi : oUiApi,
						oPropertyMetadata : oPropertyMetadata,
						sSelectProperty : sSelectProperty
					};
					oFFValuePromise.resolve({
						aFilterValues : aFilterValues,
						oFilterRestrictionPropagationPromiseForValues : oNewFilterRestrictionPropagationPromise,
						oFormatterArgs : oFormatterArgs
					});
				});
			}
		}, function(oError) {
			_errorOnNoFacetFilterData();
			oFFValuePromise.reject([]);
		});
		return oFFValuePromise.promise();
	};
	/**
	 * @public
	 * @function
	 * @name sap.apf.ui.utils.FacetFilterHandler#getSelectedFFValues
	 * @description Gets selected filter values
	 * @returns {Deferred} oFFSelectedValuePromise
	 * If get selected values was successful, resolved with selected filter values and the new filter restriction promise for selected values
	 * Example : [ "20000201" ] 
	 * */
	this.getSelectedFFValues = function() {
		var oFFSelectedValuePromise = jQuery.Deferred();
		var aFacetFilterSelectedData = oConfiguredFilter.getSelectedValues();
		aFacetFilterSelectedData.then(function(aSelectedFilterValues, oNewFilterRestrictionPropagationPromise) {
			oFFSelectedValuePromise.resolve({
				aSelectedFilterValues : aSelectedFilterValues,
				oFilterRestrictionPropagationPromiseForSelectedValues : oNewFilterRestrictionPropagationPromise
			});
		}, function(oError) {
			_errorOnNoFacetFilterData();
			//TODO What should happen when getSelectedValues() fails?
			oFFSelectedValuePromise.resolve([]);
		});
		return oFFSelectedValuePromise.promise();
	};
	/**
	 * @public
	 * @function
	 * @name sap.apf.ui.utils.FacetFilterHandler#setSelectedFFValues
	 * @param {Array} Facet filter list selected item keys Example : [ "20000201" , "20000301" ]
	 * @description Sets the selected filter value keys
	 * */
	this.setSelectedFFValues = function(aFacetFilterListSelectedItemKeys) {
		oConfiguredFilter.setSelectedValues(aFacetFilterListSelectedItemKeys);
	};
};