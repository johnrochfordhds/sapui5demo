/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
jQuery.sap.require('sap.apf.modeler.ui.utils.nullObjectChecker');
jQuery.sap.declare('sap.apf.modeler.ui.utils.staticValuesBuilder');
(function() {
	'use strict';
	/**
	* @class staticValuesBuilder
	* @memberOf sap.apf.modeler.ui.utils
	* @name staticValuesBuilder
	* @description builds static model data
	*/
	sap.apf.modeler.ui.utils.staticValuesBuilder = function(oTextReader) {
		/**
		* @private
		* @function
		* @name sap.apf.modeler.ui.utils.staticValuesBuilder#getNavTargetTypeData
		* @returns an array of values of navigation target types
		* */
		sap.apf.modeler.ui.utils.staticValuesBuilder.prototype.getNavTargetTypeData = function() {
			var arr = [ oTextReader("globalNavTargets"), oTextReader("stepSpecific") ];
			return arr;
		};
	};
})();