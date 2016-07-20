/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2015 SAP AG. All rights reserved
 */
jQuery.sap.declare('sap.apf.utils.externalContext');
jQuery.sap.require('sap.apf.core.utils.filter');

/**
 * @private
 * @class External Context
 * @description Determines the context for APF. The context can be either retrieved from a SmartBusiness Evaluation or from a X-APP-STATE property named  
 * 				sapApfCumulativeFilter. 
 * @param {object} inject Object containing functions and instances to be used by External Context
 * @param {function} inject.functions.getConfigurationProperties {@link sap.apf.core.ResourcePathHandler#getConfigurationProperties}
 * @param {sap.apf.utils.StartParameter} inject.instance.startParameter StartParameter instance
 * @param {sap.apf.Component} inject.instance.component This reference provides access to parameters and context of the calling Component.js
 * @param {sap.apf.core.MessageHandler} inject.instance.messageHandler Message handler instance
 * @name sap.apf.utils.ExternalContext
 * @returns {sap.apf.utils.ExternalContext}
 */
sap.apf.utils.ExternalContext = function(inject) {
	'use strict';
	var deferredContext = jQuery.Deferred();
	var smartBusinessEvaluationId = inject.instance.startParameter.getEvaluationId();
	var xAppStateId = inject.instance.startParameter.getXappStateId();
	var msgH = inject.instance.messageHandler;
	var requestUrl;
	var configurationProperties;
	var smartBusinessConfig;
	var externalContext = this;
	/**
	 * @private
	 * @function
	 * @name sap.apf.utils.ExternalContext#getCombinedContext
	 * @description Returns a promise which is resolved with a filter instance {@link sap.apf.core.utils.Filter} representing the
	 * 			retrieved context from a SmartBusiness Evaluation or X-APP-State. If there is no context available, the promise is resolved with an 
	 * 			empty filter instance {@link sap.apf.core.utils.Filter}.
	 * @returns {jQuery.Deferred.promise}
	 */
	this.getCombinedContext = function() {
		if (xAppStateId) { //For the moment, only handling of either SmartBusiness or X-APP-STATE is required and therefore supported
			sap.ushell.Container.getService("CrossApplicationNavigation").getAppState(inject.instance.component, xAppStateId).done(function(appContainer) {
				var containerData = appContainer.getData();
				if (containerData && containerData.sapApfCumulativeFilter) {
					deferredContext.resolve(sap.apf.core.utils.Filter.transformUI5FilterToInternal(msgH, containerData.sapApfCumulativeFilter));
				} else if (containerData && containerData.selectionVariant){
					deferredContext.resolve(externalContext.convertSelectionVariantToFilter(containerData.selectionVariant));
				} else {
					deferredContext.resolve(new sap.apf.core.utils.Filter(msgH));
				}
			});
		} else if (smartBusinessEvaluationId) {
			configurationProperties = inject.functions.getConfigurationProperties();
			smartBusinessConfig = configurationProperties && configurationProperties.smartBusiness && configurationProperties.smartBusiness.runtime;
			if (smartBusinessConfig && smartBusinessConfig.service) {
				requestUrl = smartBusinessConfig.service + "/EVALUATIONS('" + smartBusinessEvaluationId + "')/FILTERS?$format=json";
				jQuery.ajax({
					url : requestUrl,
					success : function(data) {
						var property;
						var msgH = inject.instance.messageHandler;
						var orFilter;
						var andFilter = new sap.apf.core.utils.Filter(msgH);
						var filtersForConjuction = [];
						var termsPerProperty = {};
						data.d.results.forEach(collectTermsPerProperty);
						for(property in termsPerProperty) {
							if (termsPerProperty.hasOwnProperty(property)) {
								orFilter = new sap.apf.core.utils.Filter(msgH);
								termsPerProperty[property].forEach(combineTermsPerProperty);
								filtersForConjuction.push(orFilter);
							}
						}
						filtersForConjuction.forEach(combineDifferentProperties);
						deferredContext.resolve(andFilter);
						function collectTermsPerProperty(sbFilter) {
							if (!termsPerProperty[sbFilter.NAME]) {
								termsPerProperty[sbFilter.NAME] = [];
							}
							termsPerProperty[sbFilter.NAME].push(new sap.apf.core.utils.Filter(msgH, sbFilter.NAME, sbFilter.OPERATOR, sbFilter.VALUE_1, sbFilter.VALUE_2));
						}
						function combineTermsPerProperty(filter) {
							orFilter.addOr(filter);
						}
						function combineDifferentProperties(filter) {
							andFilter.addAnd(filter);
						}
					},
					error : function(jqXHR, textStatus, errorThrown) {
					}
				});
			} else {
				deferredContext.resolve(new sap.apf.core.utils.Filter(msgH));
			}
		} else {
			deferredContext.resolve(new sap.apf.core.utils.Filter(msgH));
		}
		return deferredContext.promise();
	};
	/**
	 * @private
	 * @function
	 * @name sap.apf.utils.ExternalContext#convertParameterObject
	 * @param {object} parameterObject - contains two properties PropertyName and PropertyValue
	 * @description Returns a filterTerm instance {@link sap.apf.core.utils.FilterTerm} representing an equality of the property with the value, returns null for invalid input
	 * @returns {sap.apf.core.utils.FilterTerm | null}
	 */
	this.convertParameterObject = function(parameterObject){
		if (!parameterObject.PropertyName || parameterObject.PropertyValue === undefined || parameterObject.PropertyValue === null){
			return null; //error case
		}
		return new sap.apf.core.utils.FilterTerm(msgH, parameterObject.PropertyName, sap.apf.core.constants.FilterOperators.EQ, parameterObject.PropertyValue);
	};
	/**
	 * @private
	 * @function
	 * @name sap.apf.utils.ExternalContext#convertSelecOption
	 * @param {object} selectOption - this is an object with a PropertyName and an array of Ranges
	 * @description Returns a filter instance {@link sap.apf.core.utils.Filter} representing the selectOption, returns null for invalid input
	 * @returns {sap.apf.core.utils.Filter | null}
	 */
	this.convertSelectOption = function(selectOption){
		var externalContext = this;
		var filter = null;
		var i;
		if (!selectOption.PropertyName || !selectOption.Ranges || !(jQuery.isArray(selectOption.Ranges))){
			return null; //error case
		}
		filter = new sap.apf.core.utils.Filter(msgH);
		for (i = 0; i < selectOption.Ranges.length; i++) {
			var converted = externalContext.convertRange(selectOption.Ranges[i], selectOption.PropertyName);
			if (!converted){
				return null; //error case
			}
			filter.addOr(converted);
		}
		return filter;
	};
	/**
	 * @private
	 * @function
	 * @name sap.apf.utils.ExternalContext#convertRange
	 * @param {object} rangeObject - contains a range with Sign, Option, Low and High
	 * @param {string} propertyName - the name of the property connected to the range
	 * @description Returns a filterTerm instance {@link sap.apf.core.utils.FilterTerm} representing the Range, returns null for invalid input
	 * @description Any other sign than 'I' is handled as invalid
	 * @returns {sap.apf.core.utils.FilterTerm | null}
	 */
	this.convertRange = function(rangeObject, propertyName){
		if ( rangeObject.Sign != 'I'){
			return null; //error case
		}
		if ( rangeObject.Option === 'BT' && (rangeObject.High === undefined || rangeObject.High === null)){
			return null; //error case: BT requires High
		}
		return new sap.apf.core.utils.FilterTerm(msgH, propertyName, rangeObject.Option, rangeObject.Low, rangeObject.High);
	};

	/**
	 * @private
	 * @function
	 * @name sap.apf.utils.ExternalContext#convertSelectionVariantToFilter
	 * @param {object} selectionVariant - this is an object with two arrays "Parameters" and "SelectOptions"
	 * @description Returns a filter instance {@link sap.apf.core.utils.Filter} representing the selectionVariant, returns an empty filter if any invalid input is given
	 * @returns {sap.apf.core.utils.Filter}
	 */
	this.convertSelectionVariantToFilter = function (selectionVariant){
		var externalContext = this;
		var filter = new sap.apf.core.utils.Filter(msgH);
		var i;
		if (!selectionVariant){
			return filter;
		}
		if (selectionVariant.Parameters && !(jQuery.isArray(selectionVariant.Parameters))){
			return filter;
		}
		if (selectionVariant.SelectOptions && !(jQuery.isArray(selectionVariant.SelectOptions))){
			return filter;
		}
		if (selectionVariant.Parameters){
			for (i = 0; i < selectionVariant.Parameters.length; i++) {
				var convertedParameter = externalContext.convertParameterObject(selectionVariant.Parameters[i]);
				if (!convertedParameter){
					return new sap.apf.core.utils.Filter(msgH); //error case
				}
				filter.addAnd(convertedParameter);
			}
		}
		if(selectionVariant.SelectOptions){
			for (i = 0; i < selectionVariant.SelectOptions.length; i++) {
				var convertedSelectOptions = externalContext.convertSelectOption(selectionVariant.SelectOptions[i]);
				if (!convertedSelectOptions){
					return new sap.apf.core.utils.Filter(msgH); //error case
				}
				filter.addAnd(convertedSelectOptions);
			}
		}
		return filter;
	};
};