/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
jQuery.sap.declare("sap.apf.core.sessionHandler");
jQuery.sap.require("sap.apf.core.ajax");
jQuery.sap.require("sap.apf.utils.filter");
jQuery.sap.require("sap.apf.core.constants");

(function() {
	'use strict';
	/**
	 * @class Handles the session of an APF based application. e.g. the XSRF token handling
	 */
	/*global setTimeout*/
	sap.apf.core.SessionHandler = function(oInject) {
		// private vars
		var that = this;
		var dirtyState = false;
		var pathName = '';
		var sXsrfToken = "";
		var sServiceRootPath = "";
		var oHashTableXsrfToken = new sap.apf.utils.Hashtable(oInject.messageHandler);
		var nFetchTryCounter = 0;
		var oCoreApi = oInject.coreApi;
		var oMessageHandler = oInject.messageHandler;

		// private functions
		var onError = function(oJqXHR, sStatus, sErrorThrown) {
			if ((sXsrfToken.length === 0 || sXsrfToken === "unsafe") && nFetchTryCounter < 2) {
				setTimeout(that.fetchXcsrfToken, 500 + Math.random() * 1500);
			} else {
				oMessageHandler.check(false, "No XSRF Token available!", 5101);
			}
		};
		var onFetchXsrfTokenResponse = function(oData, sStatus, oXMLHttpRequest) {
			sXsrfToken = oXMLHttpRequest.getResponseHeader("x-csrf-token");
			/*
			* In case XSRF prevention flag is not set in .xsaccess file for the service, then no "x-csrf-token" field is returned in response header. 
			 * For robustness, XSRF token is set to empty string. Every request triggered by APF contains then a "x-csrf-token" request header field containing an empty string. 
			 */
			if (sXsrfToken === null) {
				sXsrfToken = "";
			} else if ((sXsrfToken.length === 0 || sXsrfToken === "unsafe") && nFetchTryCounter < 2) {
				setTimeout(that.fetchXcsrfToken, 500 + Math.random() * 1500);
			}
		};
		
		// public vars
		/**
		 * @description Returns the type
		 * @returns {String}
		 */
		this.type = "sessionHandler";
		// public function
		/**
		 * @see sap.apf.core.ajax
		 */
		this.ajax = function(oSettings) {
			sap.apf.core.ajax(oSettings);
		};
		/**
		 * @description Returns the XSRF token as string for a given OData service root path
		 * @param {String} serviceRootPath OData service root path
		 * @returns {String}
		 */
		this.getXsrfToken = function(serviceRootPath) {
			sServiceRootPath = serviceRootPath;
			if (oHashTableXsrfToken.hasItem(sServiceRootPath)) {
				return oHashTableXsrfToken.getItem(sServiceRootPath);
			}
			that.fetchXcsrfToken();
			oHashTableXsrfToken.setItem(sServiceRootPath, sXsrfToken);
			return sXsrfToken;
		};

		/**
		 * @description fetches XSRF token from XSE
		 */
		this.fetchXcsrfToken = function() {
			that.ajax({
				url : oCoreApi.getUriGenerator().getAbsolutePath(sServiceRootPath),
				type : "GET",
				beforeSend : function(xhr) {
					xhr.setRequestHeader("x-csrf-token", "Fetch");
				},
				success : onFetchXsrfTokenResponse,
				error : onError,
				async : false
			});
			nFetchTryCounter = nFetchTryCounter + 1;
		};
        /**
         * @private
         * @name sap.apf.core.SessionHandler#setDirtyState
         * @function
         * @description Stores the current state for dirty information
         * @param {boolean} state 
         */ 		
		this.setDirtyState = function(state) {
		    dirtyState = state;
		};
		/**
		 * @private
		 * @name sap.apf.core.SessionHandler#isDirty
		 * @function
		 * @description Returns the last set state for the dirty information
		 * @returns {boolean} true: State of current instance is dirty | false: State of current instance is clean
		 */		
		this.isDirty = function() {
		    return dirtyState;
		};
		/**
		 * @private
		 * @name sap.apf.core.SessionHandler#setPathNamee
		 * @function
		 * @description Set name is stored transiently. For persistent storage the methods of persistence object need to be used.
		 * @param {string} name 
		 */ 		
		this.setPathName = function(name) {
		    if(typeof name != 'string') {
		        pathName = '';
		        return;
		    }
		    pathName = name;
		};
        /**
         * @private
         * @name sap.apf.core.SessionHandler#getPathNamee
         * @function
         * @description Returns the last set path name
         * @returns {string} path name
         */ 		
		this.getPathName = function() {
		    return pathName;
		};
	};
}());