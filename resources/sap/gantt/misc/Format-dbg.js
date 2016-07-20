/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define([
	
], function () {
	"use strict";

	/**
	 * A dummy constructor for Format. Do not construct a Format object; instead, call static methods abapTimestampToDate, dateToAbapTimestamp, and abapTimestampToTimeLabel directly.
	 *
	 * @class
	 * The Format class provides static methods for formatting dates, times, and timestamps to be used in sap.gantt
	 *
	 * @public
	 * @alias sap.gantt.misc.Format
	 */

	var Format = function() {
		// Do not use the constructor
		throw new Error();
	};
	
	
	/**
	 * Converts an ABAP timestamp(eg:"20150909000000" ) into a Date instance.
	 *
	 * @param {string} sTimestamp The ABAP timestamp to convert
	 * @return {Date} The output date instance
	 * @static
	 * @public
	 */

	Format.abapTimestampToDate = function (sTimestamp) {
		if (typeof sTimestamp === "string") {
			// for the timestamp format such as "20150909000000"
			var date = new Date(sTimestamp.substr(0, 4),
					parseInt(sTimestamp.substr(4, 2), 0) - 1,
					sTimestamp.substr(6, 2),
					sTimestamp.substr(8, 2),
					sTimestamp.substr(10, 2),
					sTimestamp.substr(12, 2));
			//In case ts is in format of "Fri Jun 12 2015 08:00:00 GMT+0800 (China Standard Time)"
			if (!jQuery.isNumeric(date.getTime())){
				date = new Date(sTimestamp);
			}
			return date;
		} else if (jQuery.type(sTimestamp) === "date"){
			return sTimestamp;
		}
		return null;
	};
	
	
	/**
	 * Converts a Date instance into an ABAP timestamp.
	 *
	 * @param {Date} oDate The date instance to convert
	 * @return {string} The output ABAP timestamp
	 * @static
	 * @public
	 */

	Format.dateToAbapTimestamp = function (oDate) {
		
		return "" + oDate.getFullYear() +
		(oDate.getMonth() < 9 ? "0" : "") + (oDate.getMonth() + 1) +
		(oDate.getDate() < 10 ? "0" : "") + oDate.getDate() +
		(oDate.getHours() < 10 ? "0" : "") + oDate.getHours() +
		(oDate.getMinutes() < 10 ? "0" : "") + oDate.getMinutes() +
		(oDate.getSeconds() < 10 ? "0" : "") + oDate.getSeconds();
	};
	
	
	/**
	 * Converts an ABAP timestamp into a time label to be used in Gantt.
	 *
	 * @param {string} sTimestamp The ABAP timestamp to convert
	 * @param {sap.gantt.config.Locale} oLocale The locale object has the time zone and DST info; this determines how the function converts the timestamp into a locale-specific time label
	 * @return {string} The output time label
	 * @static
	 * @public
	 */
	Format.abapTimestampToTimeLabel = function (sTimestamp, oLocale) {
		var localDate = sap.gantt.misc.Format._convertUTCToLocalTime(sTimestamp, oLocale);
		var oFormat = sap.ui.core.format.DateFormat.getDateTimeInstance();
		var sLabel = oFormat.format(localDate);
		return sLabel;

	};
	
	

	Format._convertUTCToLocalTime = function (sTimeStamp, oLocale) {

		//convert utc date to local date
		//code is from axistime.js
		var timeZoneOffset = 0;
		if (oLocale && oLocale.getUtcdiff()) {
			var format = d3.time.format("%Y%m%d%H%M%S");
			timeZoneOffset = Math.round((format.parse("20000101" + oLocale.getUtcdiff()).getTime() - format.parse("20000101000000").getTime()) / 1000);
			if (oLocale.getUtcsign() === "-") {
				timeZoneOffset = -timeZoneOffset;
			}
		}
		var utcDate = sap.gantt.misc.Format.abapTimestampToDate(sTimeStamp);
		var localDate = d3.time.second.offset(utcDate, timeZoneOffset);

		//to solve the daylight saving time
		var aDstHorizons = oLocale.getDstHorizons();
		if (aDstHorizons.length > 0) {
			for (var i = 0; i < aDstHorizons.length; i++) {
				var startDate = sap.gantt.misc.Format.abapTimestampToDate(aDstHorizons[i].getStartTime());
				var endDate = sap.gantt.misc.Format.abapTimestampToDate(aDstHorizons[i].getEndTime());
				if (localDate >= startDate && localDate <= endDate) {
					localDate = d3.time.second.offset(localDate, 60 * 60);
				}
			}
		}
		return localDate;
	};


	return Format;
}, true);
