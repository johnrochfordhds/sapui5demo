/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
/*global jQuery, sap */

jQuery.sap.declare('sap.apf.core.utils.fileExists');
jQuery.sap.require('sap.apf.core.utils.checkForTimeout');

(function() {
	'use strict';
	/**
	 * @description Checks, whether a file exists on server
	 */
	sap.apf.core.utils.FileExists = function() {
		var fileExistsBuffer = {};
		/**
		 * @description Checks, whether a file with given fully specified path exists on server. Address must be valid URL.
		 * @param {string} sUrl Path to file on server
		 * @returns {boolean}
		 */
		this.check = function (sUrl) {
			if(fileExistsBuffer[sUrl] !== undefined){
				return fileExistsBuffer[sUrl];
			}
			var bFileExists = false;
			jQuery.ajax({
				url : sUrl,
				type : "HEAD",
				success : function(oData, sStatus, oJqXHR) {
					var oMessage = sap.apf.core.utils.checkForTimeout(oJqXHR);
					if(oMessage === undefined){
						bFileExists = true;
					} else {
						bFileExists = false;
					}
				},
				error : function() {
					bFileExists = false;
				},
				async : false
			});
			fileExistsBuffer[sUrl] = bFileExists;
			return bFileExists;
		};
	};
}());