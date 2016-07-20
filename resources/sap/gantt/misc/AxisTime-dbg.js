/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define(["sap/ui/base/Object", "sap/gantt/misc/Utility", "sap/ui/thirdparty/d3"], function (BaseObject) {
	// Utility cannot be referenced because of cyclic dependency between AxisOrdinal and Utility, use global name to reference
	"use strict";

	/**
	 * Creates and initializes an AxisTime class.
	 * 
	 * @class The reusable functional class represents an instance of time-value linear coordinate mapping.
	 * 
	 * @param {array} timeRange The array must contain two or more dates that represent some ranges of data.
	 * @param {array} viewRange The array must contain two or more values, to match the cardinality of timeRange, representing some ranges of values.
	 * @param {number} zoomRate Zoom rate of the viewport area.
	 * @param {number} zoomOrigin Zoom origin of the viewport area.
	 * @param {number} viewOffset Offset of the viewport area.
	 * @param {object} locale Settings for language, time zone, and daylight saving.
	 * @param {boolean} RTL Indicates whether to apply the "right-to-left" layout.
	 * @param {array} oZoomStrategy Specifies the strategy to zoom in/out.
	 * 
	 * @return Instance of AxisTime.
	 * 
	 * @constructor
	 * @public
	 * @alias sap.gantt.misc.AxisTimes
	 */
	
	var AxisTime = function (timeRange, viewRange, zoomRate, zoomOrigin, viewOffset, locale, RTL, oZoomStrategy) {
		this.scale = d3.time.scale().domain(timeRange).range(viewRange).clamp(false);

		this.timeRange = timeRange;
		this.viewRange = viewRange;

		this.zoomRate = sap.gantt.misc.Utility.assign(zoomRate, 1);
		this.zoomOrigin = sap.gantt.misc.Utility.assign(zoomOrigin, 0);

		this.viewOffset = sap.gantt.misc.Utility.assign(viewOffset, 0);

		this.locale = locale;
		var language = sap.ui.getCore().getConfiguration().getLanguage();
		this.language = language.toLowerCase();

		if (locale && locale.getUtcdiff()) {
			var format = d3.time.format("%Y%m%d%H%M%S");
			this.timeZoneOffset = Math.round((format.parse("20000101" + locale.getUtcdiff()).getTime() - format.parse("20000101000000").getTime()) / 1000);
			if (locale.getUtcsign() === "-") {
				this.timeZoneOffset = -this.timeZoneOffset;
			}
		}
		this.RTL = RTL;
		this._oZoomStrategy = oZoomStrategy ? oZoomStrategy : sap.gantt.config.DEFAULT_TIME_ZOOM_STRATEGY;
	};

	/*
	 * Constants
	 */
	AxisTime.prototype.CONSTANT = {
		C_SEPARATOR: "_@@_",
		C_MESSAGE: {
			ARGUMENT_ERROR: "AxisOrdinal: Argument Error!"
		}
	};

	// public methods =>
	
	/**
	 * Given a date within the timeRange, this function returns the corresponding value within the viewRange.
	 * 
	 * @param {date} time Given date within the timeRange.
	 * 
	 * @return {number} Value corresponding to the given date within the viewRange.
	 * 
	 * @public
	 */
	
	AxisTime.prototype.timeToView = function(time){
		if (this.RTL !== true) {
			return Math.round((this.scale(time) - this.zoomOrigin) * this.zoomRate - this.viewOffset);
		} else {
			return Math.round(this.viewRange[1] * this.zoomRate - (((this.scale(time) + this.zoomOrigin) * this.zoomRate) + this.viewOffset));
		}
	};
	
	/**
	 * Returns the date within the timeRange for the corresponding value within the viewRange.
	 * 
	 * @param {number} value Given value within the viewRange.
	 * 
	 * @return {date} Date corresponding to the given value within the timeRange.
	 * 
	 * @public
	 */
	
	AxisTime.prototype.viewToTime = function(value){
		if (this.RTL !== true) {
			return this.scale.invert((value + this.viewOffset) / this.zoomRate + this.zoomOrigin);
		} else {
			return this.scale.invert(this.viewRange[1] - (value + this.viewOffset) / this.zoomRate - this.zoomOrigin);
		}
	};

	/**
	 * Sets a new value of timeRange.
	 * 
	 * @param {array} timeRange New value of timeRange.
	 * 
	 * @return {sap.gantt.misc.AxisTimes} Reference to this in order to allow method chaining.
	 * 
	 * @public
	 */
	
	AxisTime.prototype.setTimeRange = function(timeRange){
		this.timeRange = timeRange;
		this.scale.domain(timeRange);
		return this;
	};

	/**
	 * Retrieves the value of timeRange.
	 * 
	 * @return {array} Value of timeRange.
	 * 
	 * @public
	 */

	AxisTime.prototype.getTimeRange = function(){
		return this.scale.domain();
	};

	/**
	 * Sets a new value of viewRange.
	 * 
	 * @param {array} viewRange New value of viewRange.
	 * 
	 * @return {sap.gantt.misc.AxisTimes} Reference to this in order to allow method chaining.
	 * 
	 * @public
	 */

	AxisTime.prototype.setViewRange = function(viewRange){
		this.viewRange = viewRange;
		this.scale.range(viewRange);
		return this;
	};

	/**
	 * Retrieves the value of viewRange.
	 * 
	 * @return {array} Value of viewRange.
	 * 
	 * @public
	 */

	AxisTime.prototype.getViewRange = function(){
		var range = this.scale.range();
		return [Math.round((range[0] - this.zoomOrigin) * this.zoomRate - this.viewOffset),
		        Math.round((range[1] - this.zoomOrigin) * this.zoomRate - this.viewOffset)];
	};
	
	/**
	 * Retrieves the value of oZoomStrategy.
	 * 
	 * @return {object} Value of oZoomStrategy.
	 * 
	 * @public
	 */

	AxisTime.prototype.getZoomStrategy = function () {
		return this._oZoomStrategy;
	};

	/**
	 * Sets a new value of zoomRate.
	 * 
	 * @param {number} zoomRate New value of zoomRate.
	 * 
	 * @return {sap.gantt.misc.AxisTimes} Reference to this in order to allow method chaining.
	 * 
	 * @public
	 */
	AxisTime.prototype.setZoomRate = function(zoomRate){
		this.zoomRate = sap.gantt.misc.Utility.assign(zoomRate, 1);
		return this;
	};

	/**
	 * Retrieves the value of zoomRate.
	 * 
	 * @return {number} Value of zoomRate.
	 * 
	 * @public
	 */
	AxisTime.prototype.getZoomRate = function(){
		return this.zoomRate;
	};

	/**
	 * Sets a new value of zoomOrigin.
	 * 
	 * @param {number} zoomOrigin New value of zoomOrigin.
	 * 
	 * @return {sap.gantt.misc.AxisTimes} Reference to this in order to allow method chaining.
	 * 
	 * @public
	 */
	AxisTime.prototype.setZoomOrigin = function(zoomOrigin){
		this.zoomOrigin = sap.gantt.misc.Utility.assign(zoomOrigin, 0);
		return this;
	};

	/**
	 * Retrieves the value of zoomOrigin.
	 * 
	 * @return {number} Value of zoomOrigin.
	 * 
	 * @public
	 */
	AxisTime.prototype.getZoomOrigin = function(){
		return this.zoomOrigin;
	};

	/**
	 * Sets a new value of viewOffset.
	 * 
	 * @param {number} viewOffset New value of viewOffset.
	 * 
	 * @return {sap.gantt.misc.AxisTimes} Reference to this in order to allow method chaining.
	 * 
	 * @public
	 */
	AxisTime.prototype.setViewOffset = function(viewOffset){
		this.viewOffset = sap.gantt.misc.Utility.assign(viewOffset, 0);
		return this;
	};

	/**
	 * Retrieves the value of viewOffset.
	 * 
	 * @return {number} Value of viewOffset.
	 * 
	 * @public
	 */
	AxisTime.prototype.getViewOffset = function(){
		return this.viewOffset;
	};

	AxisTime.prototype.setLocale = function(locale){
		this.locale = locale;
		if (locale && locale.getUtcdiff()) {
			var format = d3.time.format("%Y%m%d%H%M%S");
			this.timeZoneOffset = Math.round((format.parse("20000101" + locale.getUtcdiff()).getTime() - format.parse("20000101000000").getTime()) / 1000);
			if (locale.getUtcsign() === "-") {
				this.timeZoneOffset = -this.timeZoneOffset;
			}
		}
		return this;
	};

	AxisTime.prototype.getLocale = function(){
		return this.locale;
	};

	/**
	 * Clones a new AxisTimes from the current one.
	 * 
	 * @return {sap.gantt.misc.AxisTimes} Reference to the newly created clone.
	 * 
	 * @public
	 */
	AxisTime.prototype.clone = function(){
		return new AxisTime([new Date(this.timeRange[0].valueOf()), new Date(this.timeRange[1].valueOf())],
			this.viewRange.slice(0), this.zoomRate, this.zoomOrigin, this.viewOffset, this.locale, this.RTL);
	};

	/**
	 * Retrieves an index of the time interval level in array oZoomStrategy.
	 * 
	 * @return {number} Index of the time interval level in array oZoomStrategy.
	 * 
	 * @public
	 */
	AxisTime.prototype.getCurrentTickTimeIntervalLevel = function(){
		var startTime = d3.time.format("%Y%m%d%H%M%S").parse("20000101000000");
		var start = this.scale(startTime);
		var count = 0;
		for (var i in this._oZoomStrategy) {
			var interval = this._oZoomStrategy[i].innerInterval;
			var end = this.scale(jQuery.sap.getObject(interval.unit).offset(startTime, interval.span));
			var r = (end - start) * this.zoomRate;
			if (r > interval.range) {
				return count;
			}
			count++;
		}
		return count - 1;
	};

	/**
	 * Retrieves a key of the time interval level in array oZoomStrategy.
	 * 
	 * @return {string} Key of the time interval level in array oZoomStrategy.
	 * 
	 * @public
	 */
	AxisTime.prototype.getCurrentTickTimeIntervalKey = function(){
		var startTime = d3.time.format("%Y%m%d%H%M%S").parse("20000101000000");
		var start = this.scale(startTime);
		var iCurrentTickKey;
		for (var i in this._oZoomStrategy) {
			var interval = this._oZoomStrategy[i].innerInterval;
			var end = this.scale(jQuery.sap.getObject(interval.unit).offset(startTime, interval.span));
			var r = (end - start) * this.zoomRate;
			if (r > interval.range) {
				iCurrentTickKey = i;
				break;
			}
		}
		return iCurrentTickKey;
	};

	/**
	 * Retrieves an object containing the information of current time, its position, and label.
	 * 
	 * @return {object} Reference to an object containing the information of current time, its position, and label.
	 * 
	 * @public
	 */
	AxisTime.prototype.getNowLabel = function(){
		var date = new Date();
		var utcDate = new Date(date.getTime() + (date.getTimezoneOffset() * 60000));
		var value = this.timeToView(utcDate);
		var localDate = d3.time.second.offset(utcDate,this.timeZoneOffset);
		
		var label = this.getTimeLabel(this.language, this._oZoomStrategy[this.getCurrentTickTimeIntervalKey()].smallInterval.format, localDate);

		return [{"date": localDate, "value": Math.round(value), "label": label}];
	};

	/**
	 * Retrieves an array of time ticks, each item containing date position and label, for the specified level within the given timeBoundary or viewBoundary.
	 * 
	 * @param {number} level Corresponding index in array oZoomStrategy.
	 * 
	 * @param {number} timeBoundary Time range within which time ticks are generated.
	 * 
	 * @param {number} viewBoundary View range within which time ticks are generated. Available only when timeBoundary isn't specified.
	 * 
	 * @return {object} Reference to an array of time ticks, each item containing date, position, and label.
	 * 
	 * @public
	 */
	AxisTime.prototype.getTickTimeIntervalLabel = function(level, timeBoundary, viewBoundary){
		var i;
		var lvl = level;
		if (typeof level === "number") {
			var count = 0;
			for (i in this._oZoomStrategy) {
				if (count === level) {
					lvl = i;
					break;
				}
				count++;
			}
		}

		var preStartDate, preEndDate;
		var daylightInterval = null;
		if (this.locale && this.locale.getDstHorizons().length > 0){
			daylightInterval = this.locale.getDstHorizons();
		}
		var format = d3.time.format("%Y%m%d%H%M%S");
		var dlsIntervals = [];
		if (daylightInterval){
			for (i = 0; i < daylightInterval.length; i++){
				dlsIntervals[i] = {};
				preStartDate = daylightInterval[i].getStartTime();
				preEndDate = daylightInterval[i].getEndTime();
				dlsIntervals[i].startDate = format.parse(preStartDate);
				dlsIntervals[i].endDate = format.parse(preEndDate);
			}
		}

		var localTimeRange = this.timeZoneOffset ?
			[d3.time.second.offset(this.timeRange[0], this.timeZoneOffset), d3.time.second.offset(this.timeRange[1], this.timeZoneOffset)] :
			this.timeRange;
		var localAxisTime = new sap.gantt.misc.AxisTime(localTimeRange, this.viewRange, this.zoomRate, this.zoomOrigin, this.viewOffset, null, this.RTL);
		var timeRange = null;
		var viewRange = null;
		var visibleScale = null;
		var dstScale = null;
		var normalScale = null;
		var startTimeRange = null;
		var endTimeRange = null;
		var timeRangeSet = [];
		var viewRangeSet = [];
		var scaleValue = null;
		if (timeBoundary) {
			startTimeRange = this.timeZoneOffset ? d3.time.second.offset(timeBoundary[0], this.timeZoneOffset) : timeBoundary[0];
			endTimeRange = this.timeZoneOffset ? d3.time.second.offset(timeBoundary[1], this.timeZoneOffset) : timeBoundary[1];

			timeRange = this.timeZoneOffset ?
				[d3.time.second.offset(timeBoundary[0], this.timeZoneOffset), d3.time.second.offset(timeBoundary[1], this.timeZoneOffset)] :
				timeBoundary;
			viewRange = [this.timeToView(timeBoundary[0]), this.timeToView(timeBoundary[1])];

			if (dlsIntervals && dlsIntervals.length){
				this._calculateTimeRange(dlsIntervals, startTimeRange, endTimeRange, timeRangeSet);
			}
			scaleValue = this._calculateScale(timeRangeSet, viewRangeSet, timeRange, viewRange, false);
		} else if (viewBoundary){
			startTimeRange = this.timeZoneOffset ? d3.time.second.offset(this.viewToTime(viewBoundary[0]), this.timeZoneOffset) : this.viewToTime(viewBoundary[0]);
			endTimeRange = this.timeZoneOffset ? d3.time.second.offset(this.viewToTime(viewBoundary[1]), this.timeZoneOffset) : this.viewToTime(viewBoundary[1]);
			timeRange = [startTimeRange, endTimeRange];
			viewRange = viewBoundary;

			if (dlsIntervals.length){
				this._calculateTimeRange(dlsIntervals, startTimeRange, endTimeRange, timeRangeSet);
			}
			scaleValue = this._calculateScale(timeRangeSet, viewRangeSet, timeRange, viewRange, false);
		} else {
			startTimeRange = localTimeRange[0];
			endTimeRange = localTimeRange[1];
			timeRange = localTimeRange;
			viewRange = this.viewRange;

			if (dlsIntervals.length){
				this._calculateTimeRange(dlsIntervals, startTimeRange, endTimeRange, timeRangeSet);
			}
			scaleValue = this._calculateScale(timeRangeSet, viewRangeSet, timeRange, viewRange, localTimeRange);
		}
		viewRangeSet = scaleValue.viewRangeSet;
		visibleScale = scaleValue.visibleScale;
		dstScale = scaleValue.dstScale;
		normalScale = scaleValue.normalScale;
		var ticks = [];
		var date, normalDate, value, label;
		var largeInterval = this._oZoomStrategy[lvl].largeInterval;
		var smallInterval = this._oZoomStrategy[lvl].smallInterval;

		var iIndex, iInner;
		if (largeInterval) {
			var largeIntervalTicks = [];
			var largeDstIntervalTicks = [];
			var largeNorIntervalTicks = [];

			if (!(visibleScale instanceof Array)){
				largeIntervalTicks[0] = visibleScale.ticks(jQuery.sap.getObject(largeInterval.unit).range, largeInterval.span);
			} else {
				for (iIndex = 0; iIndex < dstScale.length; iIndex++){
					largeDstIntervalTicks[iIndex] = dstScale[iIndex].ticks(jQuery.sap.getObject(largeInterval.unit).range, largeInterval.span);
					largeNorIntervalTicks[iIndex] = normalScale[iIndex].ticks(jQuery.sap.getObject(largeInterval.unit).range, largeInterval.span);
				}
				for (iIndex = 0; iIndex < visibleScale.length; iIndex++){
					largeIntervalTicks[iIndex] = visibleScale[iIndex].ticks(jQuery.sap.getObject(largeInterval.unit).range, largeInterval.span);
				}
			}
			var largeIntervalData = [];
			if (largeIntervalTicks[0] !== null){
				for (iIndex = 0; iIndex < largeIntervalTicks.length; iIndex++){
					for (iInner = 0; iInner < largeIntervalTicks[iIndex].length; iInner++) {
						date = largeIntervalTicks[iIndex][iInner];

						value = localAxisTime.timeToView(date);
					
						label = this.getTimeLabel(this.language, largeInterval.format, date);

						largeIntervalData.push({"date": date, "value": Math.round(value), "label": label});
					}
				}
			}

			if (largeDstIntervalTicks[0] !== null){
				for (iIndex = 0; iIndex < largeDstIntervalTicks.length; iIndex++){
					for (iInner = 0; iInner < largeDstIntervalTicks[iIndex].length; iInner++){
						date = largeDstIntervalTicks[iIndex][iInner];
						normalDate = largeNorIntervalTicks[iIndex][iInner];

						value = localAxisTime.timeToView(d3.time.second.offset(date.getTime(), -60 * 60));
						
						label = this.getTimeLabel(this.language, largeInterval.format, date);

						largeIntervalData.push({"date": date, "value": Math.round(value), "label": label});

					}
				}
			}
			ticks.push(largeIntervalData);
		} else {
			ticks.push([]);
		}
		if (smallInterval) {
			var smallDstIntervalTicks = [];
			var smallNorIntervalTicks = [];
			var smallIntervalTicks = [];
			if (!(visibleScale instanceof Array)){
				smallIntervalTicks[0] = visibleScale.ticks(jQuery.sap.getObject(smallInterval.unit).range, smallInterval.span);
			} else {
				for (iIndex = 0; iIndex < dstScale.length; iIndex++){
					smallDstIntervalTicks[iIndex] = dstScale[iIndex].ticks(jQuery.sap.getObject(smallInterval.unit).range, smallInterval.span);
					smallNorIntervalTicks[iIndex] = normalScale[iIndex].ticks(jQuery.sap.getObject(smallInterval.unit).range, smallInterval.span);
				}
				for (iIndex = 0; iIndex < visibleScale.length; iIndex++){
					smallIntervalTicks[iIndex] = visibleScale[iIndex].ticks(jQuery.sap.getObject(smallInterval.unit).range, smallInterval.span);
				}
			}

			var smallIntervalData = [];
			if (smallIntervalTicks[0]){
				for (iIndex = 0; iIndex < smallIntervalTicks.length; iIndex++){
					for (iInner = 0; iInner < smallIntervalTicks[iIndex].length; iInner++) {
						date = smallIntervalTicks[iIndex][iInner];
						var changeDate;
						var ignoreTickFlag = false;
						if (dlsIntervals.length){
							for (var d = 0; d < dlsIntervals.length; d++){
								if (date.getTime() === dlsIntervals[d].startDate.getTime()){
									changeDate = d3.time.second.offset(date.getTime(), 60 * 60);
									if ((iInner === smallIntervalTicks[iIndex].length - 1) && (lvl === "1hour" || lvl === "30min" || lvl === "15min" || lvl === "10min" || lvl === "5min")){
										ignoreTickFlag = true;
									}
								}
								if ((iInner === smallIntervalTicks[iIndex].length - 1) && (date.getTime() === d3.time.second.offset(dlsIntervals[d].endDate.getTime(), 60 * 60).getTime())){
									changeDate = d3.time.second.offset(date.getTime(), -60 * 60);
								}
							}
						}

						value = localAxisTime.timeToView(date);

						if (ignoreTickFlag){
							break;
						} else if (changeDate){
							label = this.getTimeLabel(this.language, smallInterval.format, changeDate);
							changeDate = null;
						} else {
							label = this.getTimeLabel(this.language, smallInterval.format, date);
						}

						smallIntervalData.push({"date": date, "value": Math.round(value), "label": label});
					}
				}
			}

			if (smallDstIntervalTicks[0]){
				for (iIndex = 0; iIndex < smallDstIntervalTicks.length; iIndex++){
					for (iInner = 0; iInner < smallDstIntervalTicks[iIndex].length; iInner++){
						date = smallDstIntervalTicks[iIndex][iInner];
						normalDate = smallNorIntervalTicks[iIndex][iInner];
						var oChangeDate;
						var bIgnoreTickFlag = false;
						if ((iInner === smallDstIntervalTicks[iIndex].length - 1) && (lvl === "1hour" || lvl === "30min" || lvl === "15min" || lvl === "10min" || lvl === "5min")){
							if (timeRangeSet.length > 0){
								for (var rangeItem = 0; rangeItem < timeRangeSet.length; rangeItem++){
									if ((!timeRangeSet[rangeItem].haveDST) && (normalDate.getTime() === timeRangeSet[rangeItem].range[0].getTime())){
										bIgnoreTickFlag = true;
									}
								}
							}
						}
						if (dlsIntervals.length){
							for (var s = 0; s < dlsIntervals.length; s++){
								if (date.getTime() === dlsIntervals[s].startDate.getTime()){
									oChangeDate = d3.time.second.offset(date.getTime(), 60 * 60);
								}
								if ((iInner === smallDstIntervalTicks[iIndex].length - 1) &&
										(date.getTime() === d3.time.second.offset(dlsIntervals[s].endDate.getTime(), 60 * 60).getTime())){
									oChangeDate = d3.time.second.offset(date.getTime(), -60 * 60);
								}
							}
						}
						if (lvl !== "1hour" && lvl !== "30min" && lvl !== "15min" && lvl !== "10min" && lvl !== "5min"){
							value = localAxisTime.timeToView(d3.time.second.offset(date.getTime(), -60 * 60));
						} else {
							value = localAxisTime.timeToView(normalDate);
						}
						if (bIgnoreTickFlag){
							break;
						} else if (oChangeDate){
							
							label = this.getTimeLabel(this.language, smallInterval.format, oChangeDate);
							oChangeDate = null;
						} else {
							
							label = this.getTimeLabel(this.language, smallInterval.format, date);
						}

						smallIntervalData.push({"date": date, "value": Math.round(value), "label": label});

					}
				}
			}
			ticks.push(smallIntervalData);
		} else {
			ticks.push([]);
		}

		return ticks;
	};
	// <= public methods

	AxisTime.prototype._calculateScale = function(timeRangeSet, viewRangeSet, timeRange, viewRange, localTimeRange){
		var visibleScale = null;
		var dstScale = [];
		var normalScale = [];
		if (timeRangeSet.length){
			visibleScale = [];
			var dstCount = 0;
			var visibleCount = 0;
			for (var t = 0; t < timeRangeSet.length; t++){
				viewRangeSet[t] = [this.timeToView(timeRangeSet[t].range[0]), this.timeToView(timeRangeSet[t].range[1])];
				if (timeRangeSet[t].haveDST){
					dstScale[dstCount] = new sap.gantt.misc.AxisTime(timeRangeSet[t].dstRange, viewRangeSet[t], this.zoomRate, this.zoomOrigin, this.viewOffset, null, this.RTL).scale;
					normalScale[dstCount] = new sap.gantt.misc.AxisTime(timeRangeSet[t].range, viewRangeSet[t], this.zoomRate, this.zoomOrigin, this.viewOffset, null, this.RTL).scale;
					dstCount++;
				} else {
					visibleScale[visibleCount] = new sap.gantt.misc.AxisTime(timeRangeSet[t].range, viewRangeSet[t], this.zoomRate, this.zoomOrigin, this.viewOffset, null, this.RTL).scale;
					visibleCount++;
				}
			}
		} else if (localTimeRange) {
			visibleScale = new sap.gantt.misc.AxisTime(localTimeRange, this.viewRange, this.zoomRate, this.zoomOrigin, this.viewOffset, null, this.RTL).scale;
		} else {
			visibleScale = new sap.gantt.misc.AxisTime(timeRange, viewRange, this.zoomRate, this.zoomOrigin, this.viewOffset, null, this.RTL).scale;
		}
		var retVal = {"viewRangeSet": viewRangeSet, "visibleScale" : visibleScale, "dstScale" : dstScale, "normalScale" : normalScale};
		return retVal;
	};

	AxisTime.prototype._calculateTimeRange = function(dlsIntervals, startTimeRange, endTimeRange, timeRangeSet){
		if (dlsIntervals.length){
			var startTime = startTimeRange;
			var endTime = endTimeRange;
			var tempTimeRange = [];
			var tempDstRange = [];
			var dstStartDate, dstEndDate;
			dstStartDate = dlsIntervals[0].startDate;
			dstEndDate = dlsIntervals[0].endDate;
			this._calculateRangeItem(dstStartDate, dstEndDate, startTime, endTime, tempTimeRange, tempDstRange);
			if (dlsIntervals.length > 1){
				for (var j = 1; j < dlsIntervals.length; j++){
					if (tempTimeRange.length){
						var rangeNeedCal = [];
						for (var item in tempTimeRange){
							rangeNeedCal.push(tempTimeRange[item]);
						}

						tempTimeRange = [];
						//tempDstRange = [];
						for (var t = 0 ; t < rangeNeedCal.length; t++){
							dstStartDate = dlsIntervals[j].startDate;
							dstEndDate = dlsIntervals[j].endDate;
							startTime = rangeNeedCal[t].range[0];
							endTime = rangeNeedCal[t].range[1];
							this._calculateRangeItem(dstStartDate, dstEndDate, startTime, endTime, tempTimeRange, tempDstRange);
						}
					}
				}
			}

			for (var dst in tempDstRange){
				timeRangeSet.push(tempDstRange[dst]);
			}
			for (var time in tempTimeRange){
				timeRangeSet.push(tempTimeRange[time]);
			}
		}
	};

	AxisTime.prototype._calculateRangeItem = function(dstStartDate, dstEndDate, startTimeRange, endTimeRange, tempTimeRange, timeRangeSet){
		var rangeItem = null;
		if (startTimeRange < dstStartDate){
			if (endTimeRange < dstEndDate){
				if (endTimeRange > dstStartDate){
					rangeItem = {};
					rangeItem.haveDST = false;
					rangeItem.range = [startTimeRange, dstStartDate];
					tempTimeRange.push(rangeItem);
					rangeItem = {};
					rangeItem.haveDST = true;
					rangeItem.range = [dstStartDate, endTimeRange];
					rangeItem.dstRange = [d3.time.second.offset(dstStartDate.getTime(), 60 * 60), d3.time.second.offset(endTimeRange, 60 * 60)];
					timeRangeSet.push(rangeItem);
				} else {
					rangeItem = {};
					rangeItem.haveDST = false;
					rangeItem.range = [startTimeRange, endTimeRange];
					tempTimeRange.push(rangeItem);
				}
			} else {
				rangeItem = {};
				rangeItem.haveDST = false;
				rangeItem.range = [startTimeRange, dstStartDate];
				tempTimeRange.push(rangeItem);
				rangeItem = {};
				rangeItem.haveDST = true;
				rangeItem.range = [dstStartDate, dstEndDate];
				rangeItem.dstRange = [d3.time.second.offset(dstStartDate.getTime(), 60 * 60), d3.time.second.offset(dstEndDate.getTime(), 60 * 60)];
				timeRangeSet.push(rangeItem);
				rangeItem = {};
				rangeItem.haveDST = false;
				rangeItem.range = [dstEndDate, endTimeRange];
				tempTimeRange.push(rangeItem);
			}
		} else if (startTimeRange >= dstStartDate){
			if (startTimeRange < dstEndDate){
				if (endTimeRange <= dstEndDate){
					rangeItem = {};
					rangeItem.haveDST = true;
					rangeItem.range = [startTimeRange, endTimeRange];
					rangeItem.dstRange = [d3.time.second.offset(startTimeRange, 60 * 60), d3.time.second.offset(endTimeRange, 60 * 60)];
					timeRangeSet.push(rangeItem);
				} else {
					rangeItem = {};
					rangeItem.haveDST = true;
					rangeItem.range = [startTimeRange, dstEndDate];
					rangeItem.dstRange = [d3.time.second.offset(startTimeRange, 60 * 60), d3.time.second.offset(dstEndDate.getTime(), 60 * 60)];
					timeRangeSet.push(rangeItem);
					rangeItem = {};
					rangeItem.haveDST = false;
					rangeItem.range = [dstEndDate, endTimeRange];
					tempTimeRange.push(rangeItem);
				}
			} else {
				rangeItem = {};
				rangeItem.haveDST = false;
				rangeItem.range = [startTimeRange, endTimeRange];
				tempTimeRange.push(rangeItem);
			}
		}
	};

	AxisTime.prototype.getTimeLabel = function(language, format, date){
		
		var oFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern : format}, new sap.ui.core.Locale(language));
		
		return oFormat.format(date);
		
	};

	return AxisTime;
}, true);
