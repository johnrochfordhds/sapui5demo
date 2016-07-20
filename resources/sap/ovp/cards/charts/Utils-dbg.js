/**
 * @fileOverview This file contains miscellaneous utility functions.
 */

(function () {
	"use strict";
	jQuery.sap.declare("sap.ovp.cards.charts.Utils");


	sap.ovp.cards.charts.Utils = sap.ovp.cards.charts.Utils || {};


	/* All constants feature here */
	sap.ovp.cards.charts.Utils.constants = {
			/* qualifiers for annotation terms */
			CHART_QUALIFIER_KEY: "chartAnnotationPath",
			SELVAR_QUALIFIER_KEY: "selectionAnnotationPath",
			PREVAR_QUALIFIER_KEY: "presentationAnnotationPath",
			/* size of the collection to be rendered on chart */
			CHART_DATA_SIZE: "4",
			/* DEBUG MESSAGES */
			ERROR_NO_CHART: "Analytic cards require valid \"chartAnnotationPath\" " +
					"configured in manifest.json"
	};

	/* retrieve qualifier from iContext */
	sap.ovp.cards.charts.Utils.getQualifier = function (iContext, annoTerm) {
		/* see sap.ovp.cards.charts.Utils.constants for legal values of annoTerm */
		if (!annoTerm) {
			return "";
		}
		var settingsModel = iContext.getSetting('ovpCardProperties');
		if (!settingsModel) {
			return "";
		}
		var oSettings = settingsModel.oData;
		if (!oSettings) {
			return "";
		}
		var fullQualifier = oSettings && oSettings[annoTerm] ? oSettings[annoTerm] : "";
		return fullQualifier === "" ? "" : fullQualifier.split("#")[1];
	};

	/************************ FORMATTERS ************************/

	sap.ovp.cards.charts.Utils.wrapInBraces = function(whateverNeedsToBeInBraces) {
		return "{" + whateverNeedsToBeInBraces + "}";
	};

	sap.ovp.cards.charts.Utils.getSapLabel = function(property) {
		var entityTypeObject = this.getModel('ovpCardProperties').getProperty("/entityType");
		var label = sap.ovp.cards.charts.Utils.getAllColumnLabels(entityTypeObject)[property];
		return label ? label : property;
	};

	sap.ovp.cards.charts.Utils.formDimensionPath = function(dimension) {
		var ret = "{" + dimension + "}";
		var entityTypeObject = this.getModel('ovpCardProperties').getProperty("/entityType");
		if (!entityTypeObject) {
			return ret;
		}
		var edmTypes = sap.ovp.cards.charts.Utils.getEdmTypeOfAll(entityTypeObject);
		if (!edmTypes || !edmTypes[dimension]) {
			return ret;
		}
		var type = edmTypes[dimension];
		if (type == "Edm.DateTime") {
			return "{path:'" + dimension + "', formatter: 'sap.ovp.cards.charts.Utils.returnDateFormat'}";
		}
		var columnTexts = sap.ovp.cards.charts.Utils.getAllColumnTexts(entityTypeObject);
		if (!columnTexts) {
			return ret;
		}
		ret = "{" + (columnTexts[dimension] || dimension) + "}";
		return ret;
	};

	sap.ovp.cards.charts.Utils.returnDateFormat = function(date) {
		if (date) {
			jQuery.sap.require("sap.ui.core.format.DateFormat");
			var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "dd-MMM"});
			return oDateFormat.format(new Date(date));
		}
		return "";
	};

	/*
	 * Reads filters from annotation and prepares data binding path
	 */
	sap.ovp.cards.charts.Utils.formatItems = function(iContext, oEntitySet, oSelectionVariant, oPresentationVariant, oDimensions, oMeasures) {
		var ret = "";
		var dimensionsList = [];
		var measuresList = [];
		var sorterList = [];
		var bFilter = oSelectionVariant && oSelectionVariant.SelectOptions;
		var bParams = oSelectionVariant && oSelectionVariant.Parameters;
		var bSorter = oPresentationVariant && oPresentationVariant.SortOrder;
		var maxItemTerm = oPresentationVariant && oPresentationVariant.MaxItems, maxItems = null;
		var columnsWithText;
		var tmp;
		var aConfigFilters;

		if (bParams) {
			var dataModel = iContext.getSetting("dataModel");
			var path = sap.ovp.cards.AnnotationHelper.resolveParameterizedEntitySet(dataModel, oEntitySet, oSelectionVariant);
			ret += "{path: '" + path + "'";
		} else {
			ret += "{path: '/" + oEntitySet.name + "'";
		}

		var filters = [];
		var entityTypeObject = null;
		var edmTypes = null;
		if (!iContext || !iContext.getSetting('ovpCardProperties')) {
			jQuery.sap.log.error("Analytic card configuration error");
			ret += "}";
			return ret;
		}
		entityTypeObject = iContext.getSetting('ovpCardProperties').getProperty("/entityType");
		edmTypes = sap.ovp.cards.charts.Utils.getEdmTypeOfAll(entityTypeObject);
		columnsWithText = sap.ovp.cards.charts.Utils.getAllColumnTexts(entityTypeObject);
		aConfigFilters = iContext.getSetting('ovpCardProperties').getProperty("/filters");

		if (bFilter) {
			jQuery.each(oSelectionVariant.SelectOptions, function() {
				var prop = this.PropertyName.PropertyPath;
				jQuery.each(this.Ranges, function() {
					if (this.Sign.EnumMember === "com.sap.vocabularies.UI.v1.SelectionRangeSignType/I") {
						var filtervalue = this.Low.String;
						if (edmTypes &&
								(edmTypes[prop].substring(0, 7) === "Edm.Int" ||
										edmTypes[prop].substring(0, 11) === 'Edm.Decimal')) {
							filtervalue = Number(filtervalue);
						}
						var filter = {
								path : prop,
								operator : this.Option.EnumMember.split("/")[1],
								value1 : filtervalue
						};
						if (this.High) {
							filter.value2 = this.High.String;
						}
						filters.push(filter);
					}
				});
			});
		}

		/* 
		 * code for ObjectStream
		 */
		if (aConfigFilters && aConfigFilters.length > 0){
			filters = filters.concat(aConfigFilters);
		}

		if (filters.length > 0) {
			ret += ", filters: " + JSON.stringify(filters);
		}

		if (bSorter) {
			var oSortAnnotationCollection = oPresentationVariant.SortOrder;
			if (oSortAnnotationCollection.length < 1) {
				jQuery.sap.log.warning("OVP-AC: Analytic card: Warning: SortOrder is present in PresentationVariant, " +
				"but it is empty or not well formed.");
			} else {
				var sSorterValue = "";
				var oSortOrder;
				var sSortOrder;
				var sSortBy;
				for (var i = 0; i < oSortAnnotationCollection.length; i++) {
					oSortOrder = oSortAnnotationCollection[i];
					sSortBy = oSortOrder.Property.PropertyPath;
					sorterList.push(sSortBy);
					if (typeof oSortOrder.Descending == "undefined") {
						sSortOrder = 'true';
					} else {
						var checkFlag = oSortOrder.Descending.Bool || oSortOrder.Descending.Boolean;
						if (!checkFlag) {
							jQuery.sap.log.warning("OVP-AC: Analytic card: Warning: Boolean value is not present in PresentationVariant ");
							sSortOrder = 'true';
						} else {
							sSortOrder = checkFlag.toLowerCase() == 'true' ? 'true' : 'false';
						}
					}
					sSorterValue = sSorterValue + "{path: '" + sSortBy + "',descending: " + sSortOrder + "},";
				}
				/* trim the last ',' */
				ret += ", sorter: [" + sSorterValue.substring(0, sSorterValue.length - 1) + "]";
			}
		}

		if (maxItemTerm) {
			maxItems = maxItemTerm.Int32 ? maxItemTerm.Int32 : maxItemTerm.Int;
		}

		jQuery.each(oMeasures, function(i, m){
			tmp = m.Measure.PropertyPath;
			measuresList.push(tmp);
			if (columnsWithText && tmp != columnsWithText[tmp]) {
				measuresList.push(columnsWithText[tmp] ? columnsWithText[tmp] : tmp);
			}
		});
		jQuery.each(oDimensions, function(i, d){
			tmp = d.Dimension.PropertyPath;
			dimensionsList.push(tmp);
			if (columnsWithText && tmp != columnsWithText[tmp]) {
				dimensionsList.push(columnsWithText[tmp] ? columnsWithText[tmp] : tmp);
			}
		});
		ret += ", parameters: {select:'" + [].concat(dimensionsList, measuresList).join(",");
		if (sorterList.length > 0) {
			ret += "," + sorterList.join(",");
		}
		/* close `parameters` */
		ret += "'}";

		if (maxItems) {
			if (/^\d+$/.test(maxItems)) {
				ret += ", length: " + maxItems;
			} else {
				jQuery.sap.log.error("OVP-AC: Analytic card Error: maxItems is Invalid. " +
					"Please enter an Integer.");
			}
		}
		ret += "}";
		return ret;
	};

	sap.ovp.cards.charts.Utils.formatItems.requiresIContext = true;


	/************************ METADATA PARSERS ************************/

	/* Returns the set of all properties in the metadata */
	sap.ovp.cards.charts.Utils.getAllColumnProperties = function(prop, entityTypeObject) {
		var finalObject = {};
		var properties = entityTypeObject.property;
		for (var i = 0, len = properties.length; i < len; i++) {
			if (properties[i].hasOwnProperty(prop) && prop == "com.sap.vocabularies.Common.v1.Label") {
				finalObject[properties[i].name] = properties[i][prop].String;
			} else if (properties[i].hasOwnProperty(prop)) {
				finalObject[properties[i].name] = properties[i][prop];
			} else {
				finalObject[properties[i].name] = properties[i].name;
			}
		}
		return finalObject;
	};

	/* Returns column name that contains the sap:label(s) for all properties in the metadata*/
	sap.ovp.cards.charts.Utils.getAllColumnLabels = function(entityTypeObject) {
		return sap.ovp.cards.charts.Utils.getAllColumnProperties("com.sap.vocabularies.Common.v1.Label", entityTypeObject);
	};


	/* Returns column name that contains the sap:text(s) for all properties in the metadata*/
	sap.ovp.cards.charts.Utils.getAllColumnTexts = function(entityTypeObject) {
		return sap.ovp.cards.charts.Utils.getAllColumnProperties("sap:text", entityTypeObject);
	};


	/* get EdmType of all properties from $metadata */
	sap.ovp.cards.charts.Utils.getEdmTypeOfAll = function(entityTypeObject) {
		return sap.ovp.cards.charts.Utils.getAllColumnProperties("type", entityTypeObject);
	};

	/************************ Format Chart Axis ************************/
	sap.ovp.cards.charts.Utils.formatChartYaxis = function() {
		jQuery.sap.require("sap.ui.core.format.NumberFormat");
		var customFormatter = {
				locale: function(){},
				format: function(value, pattern) {
					if (pattern == "yValueAxisFormatter") {
						var numberFormat = sap.ui.core.format.NumberFormat.getFloatInstance( 
								{style: 'short', 
									minFractionDigits: 2,
									maxFractionDigits: 2}
						);
						return numberFormat.format(Number(value)); 
					}
				}
		};

		jQuery.sap.require("sap.viz.ui5.api.env.Format");
		sap.viz.ui5.api.env.Format.numericFormatter(customFormatter);
	};

	sap.ovp.cards.charts.Utils.hideDateTimeAxis = function(vizFrame, feedName) {
		var entityTypeObject = vizFrame.getModel('ovpCardProperties').getProperty("/entityType");
		var edmTypes = sap.ovp.cards.charts.Utils.getEdmTypeOfAll(entityTypeObject);
		var feeds = vizFrame.getFeeds();
		for (var i = 0; i < feeds.length; i++) {
			if (feeds[i].getUid() == feedName) {
				var feedValues = feeds[i].getValues();
				if (!feedValues) {
					return;
				}
				for (var j = 0; j < feedValues.length; j++) {
					if (edmTypes[feedValues[j]] != "Edm.DateTime") {
						return;
					}
				}
				vizFrame.setVizProperties({categoryAxis:{
					title:{
						visible: false
					}
				}});
				return;
			}
		}
	};
	/************************ Line Chart functions ************************/

	sap.ovp.cards.charts.Utils.LineChart = sap.ovp.cards.charts.Utils.LineChart || {};
	sap.ovp.cards.charts.Utils.LineChart.categoryAxisFeedList = {};

	sap.ovp.cards.charts.Utils.LineChart.getVizProperties = function(iContext, dimensions, measures) {
		var rawValueAxisTitles = sap.ovp.cards.charts.Utils.LineChart.getValueAxisFeed(iContext, measures).split(",");
		var rawCategoryAxisTitles = sap.ovp.cards.charts.Utils.LineChart.getCategoryAxisFeed(iContext, dimensions).split(",");
		var valueAxisTitles = [];
		jQuery.each(rawValueAxisTitles, function(i, m){
			valueAxisTitles.push(m);
		});
		var categoryAxisTitles = [];
		jQuery.each(rawCategoryAxisTitles, function(i, d){
			categoryAxisTitles.push(d);
		});
		/*
		 //Readable version for debugging
		 //eslint can't multiline strings
		 return "{\
				valueAxis:{\
					title:{\
						visible:true,\
						text: '" + valueAxisTitles.join(",") + "'\
					},\
					label:{\
						formatString:'yValueAxisFormatter'\
					}\
				},\
				categoryAxis:{\
					title:{\
						visible:true,\
						text: '" + categoryAxisTitles.join(",") + "'\
					},\
					label:{\
						formatString:'yValueAxisFormatter'\
					}\
				},\
				legend: {\
					isScrollable: false\
				},\
				title: {\
					visible: false\
				},\
				interaction:{\
					noninteractiveMode: true,\
					selectability: {\
						legendSelection: false,\
						axisLabelSelection: false,\
						mode: 'NONE',\
						plotLassoSelection: false,\
						plotStdSelection: false\
					}\
				}\
			}";
		*/
		return "{ valueAxis:{  title:{   visible:true,   text: '" + valueAxisTitles.join(",") + "'  },  label:{   formatString:'yValueAxisFormatter'  } }, categoryAxis:{  title:{   visible:true,   text: '" + categoryAxisTitles.join(",") + "'  },  label:{   formatString:'yValueAxisFormatter'  } }, legend: {  isScrollable: false }, title: {  visible: false }, interaction:{  noninteractiveMode: true,  selectability: {   legendSelection: false,   axisLabelSelection: false,   mode: 'NONE',   plotLassoSelection: false,   plotStdSelection: false  } } }";
	};
	sap.ovp.cards.charts.Utils.LineChart.getVizProperties.requiresIContext = true;

	sap.ovp.cards.charts.Utils.LineChart.getValueAxisFeed = function(iContext, measures) {
		var entityTypeObject = iContext.getSetting('ovpCardProperties').getProperty("/entityType");
		if (!entityTypeObject) {
			return "";
		}
		var columnLabels = sap.ovp.cards.charts.Utils.getAllColumnLabels(entityTypeObject);
		var ret = [];
		jQuery.each(measures, function(i, m){
			ret.push(columnLabels[m.Measure.PropertyPath] || m.Measure.PropertyPath);
		});
		return ret.join(",");
	};
	sap.ovp.cards.charts.Utils.LineChart.getValueAxisFeed.requiresIContext = true;


	sap.ovp.cards.charts.Utils.LineChart.getCategoryAxisFeed = function(iContext, dimensions) {
		var entityTypeObject = iContext.getSetting('ovpCardProperties').getProperty("/entityType");
		if (!entityTypeObject) {
			return "";
		}
		var columnLabels = sap.ovp.cards.charts.Utils.getAllColumnLabels(entityTypeObject);
		var ret = [];
		var qualifier;
		var feedValue;
		jQuery.each(dimensions, function(i, d){
			if (d.Role.EnumMember.split("/")[1] === "Category") {
				feedValue = columnLabels[d.Dimension.PropertyPath];
				ret.push(feedValue ? feedValue : d.Dimension.PropertyPath);
			}
		});
		/*
		 * If no dimensions are given as category, pick first dimension as category
		 * (see Software Design Description UI5 Chart Control 3.1.2.2.1.1)
		 */
		if (ret.length < 1) {
			feedValue = columnLabels[dimensions[0].Dimension.PropertyPath];
			ret.push(feedValue ? feedValue : dimensions[0].Dimension.PropertyPath);
		}
		qualifier = sap.ovp.cards.charts.Utils.getQualifier(iContext,
				sap.ovp.cards.charts.Utils.constants.CHART_QUALIFIER_KEY);
		sap.ovp.cards.charts.Utils.LineChart.categoryAxisFeedList[qualifier] = ret;
		return ret.join(",");
	};
	sap.ovp.cards.charts.Utils.LineChart.getCategoryAxisFeed.requiresIContext = true;


	sap.ovp.cards.charts.Utils.LineChart.getColorFeed = function(iContext, dimensions) {
		var ret = [];
		var qualifier;
		var entityTypeObject = iContext.getSetting('ovpCardProperties').getProperty("/entityType");
		if (!entityTypeObject) {
			return "";
		}
		var columnLabels = sap.ovp.cards.charts.Utils.getAllColumnLabels(entityTypeObject);
		var feedValue;
		jQuery.each(dimensions, function(i, d){
			if (d.Role.EnumMember.split("/")[1] === "Series") {
				feedValue = columnLabels[d.Dimension.PropertyPath];
				ret.push(feedValue ? feedValue : d.Dimension.PropertyPath);
			}
		});
		/*
		 * If the dimensions is picked up for category feed as no category is given in the annotation,
		 * remove it from color feed.
		 * (see Software Design Description UI5 Chart Control 3.1.2.2.1.1)
		 */
		qualifier = sap.ovp.cards.charts.Utils.getQualifier(iContext,
				sap.ovp.cards.charts.Utils.constants.CHART_QUALIFIER_KEY);
		ret = jQuery.grep(ret, function(value) {
			if (!sap.ovp.cards.charts.Utils.LineChart.categoryAxisFeedList[qualifier]) {
				return true;
			}
			return value != sap.ovp.cards.charts.Utils.LineChart.categoryAxisFeedList[qualifier][0];
		});
		return ret.join(",");
	};
	sap.ovp.cards.charts.Utils.LineChart.getColorFeed.requiresIContext = true;


	sap.ovp.cards.charts.Utils.LineChart.testColorFeed = function(iContext, dimensions) {
		return sap.ovp.cards.charts.Utils.LineChart.getColorFeed(iContext, dimensions) !== "";
	};
	sap.ovp.cards.charts.Utils.LineChart.testColorFeed.requiresIContext = true;



	/************************ Bubble Chart Functions ************************/

	sap.ovp.cards.charts.Utils.BubbleChart = sap.ovp.cards.charts.Utils.BubbleChart || {};

	sap.ovp.cards.charts.Utils.BubbleChart.getVizProperties = function(iContext, dimensions, measures) {
		var rawValueAxisTitles = sap.ovp.cards.charts.Utils.BubbleChart.getValueAxisFeed(iContext, measures).split(",");
		var rawValueAxis2Titles = sap.ovp.cards.charts.Utils.BubbleChart.getValueAxis2Feed(iContext, measures).split(",");
		var valueAxisTitles = [];
		jQuery.each(rawValueAxisTitles, function(i, m){
			valueAxisTitles.push(m);
		});
		var valueAxis2Titles = [];
		jQuery.each(rawValueAxis2Titles, function(i, m){
			valueAxis2Titles.push(m);
		});
		/*
		 //Readable version for debugging
		 //eslint can't multiline strings
		return "{\
				valueAxis:{\
					title:{\
						visible:true,\
						text: '" + valueAxisTitles.join(",") + "'\
					},\
					label:{\
						formatString:'yValueAxisFormatter'\
					}\
				},\
				valueAxis2:{\
					title:{\
						visible:true,\
						text: '" + valueAxis2Titles.join(",") + "'\
					},\
					label:{\
						formatString:'yValueAxisFormatter'\
					}\
				},\
				categoryAxis:{\
					title:{\
						visible:true\
					},\
					label:{\
						formatString:'yValueAxisFormatter'\
					}\
				},\
				legend: {\
					isScrollable: false\
				},\
				title: {\
					visible: false\
				},\
				interaction:{\
					noninteractiveMode: true,\
					selectability: {\
						legendSelection: false,\
						axisLabelSelection: false,\
						mode: 'NONE',\
						plotLassoSelection: false,\
						plotStdSelection: false\
					}\
				}\
			}";
		*/
		return "{ valueAxis:{  title:{ visible:true, text: '" + valueAxisTitles.join(",") + "'  },  label:{ formatString:'yValueAxisFormatter'  } }, valueAxis2:{  title:{ visible:true, text: '" + valueAxis2Titles.join(",") + "'  },  label:{ formatString:'yValueAxisFormatter'  } }, categoryAxis:{  title:{ visible:true  },  label:{ formatString:'yValueAxisFormatter'  } }, legend: {  isScrollable: false }, title: {  visible: false }, interaction:{  noninteractiveMode: true,  selectability: { legendSelection: false, axisLabelSelection: false, mode: 'NONE', plotLassoSelection: false, plotStdSelection: false  } } }";
	};
	sap.ovp.cards.charts.Utils.BubbleChart.getVizProperties.requiresIContext = true;

	sap.ovp.cards.charts.Utils.BubbleChart.getMeasurePriorityList = function(iContext, measures) {
		/* (see Software Design Description UI5 Chart Control - Bubble Chart) */
		var ovpCardPropertiesModel;
		if (!iContext ||
				!iContext.getSetting ||
				!(ovpCardPropertiesModel = iContext.getSetting('ovpCardProperties'))) {
			return [""];
		}
		var entityTypeObject = ovpCardPropertiesModel.getProperty("/entityType");
		if (!entityTypeObject) {
			return [""];
		}
		var columnLabels = sap.ovp.cards.charts.Utils.getAllColumnLabels(entityTypeObject);
		var ret = [null, null, null];
		jQuery.each(measures, function(i, m){
			if (m.Role.EnumMember.split("/")[1] === "Axis1") {
				if (ret[0] === null) {
					ret[0] = columnLabels[m.Measure.PropertyPath] || m.Measure.PropertyPath;
				} else if (ret[1] === null) {
					ret[1] = columnLabels[m.Measure.PropertyPath] || m.Measure.PropertyPath;
				} else if (ret[2] == null) {
					ret[2] = columnLabels[m.Measure.PropertyPath] || m.Measure.PropertyPath;
				}
			}
		});
		jQuery.each(measures, function(i, m){
			if (m.Role.EnumMember.split("/")[1] === "Axis2") {
				if (ret[0] === null) {
					ret[0] = columnLabels[m.Measure.PropertyPath] || m.Measure.PropertyPath;
				} else if (ret[1] === null) {
					ret[1] = columnLabels[m.Measure.PropertyPath] || m.Measure.PropertyPath;
				} else if (ret[2] == null) {
					ret[2] = columnLabels[m.Measure.PropertyPath] || m.Measure.PropertyPath;
				}
			}
		});
		jQuery.each(measures, function(i, m){
			if (m.Role.EnumMember.split("/")[1] === "Axis3") {
				if (ret[0] === null) {
					ret[0] = columnLabels[m.Measure.PropertyPath] || m.Measure.PropertyPath;
				} else if (ret[1] === null) {
					ret[1] = columnLabels[m.Measure.PropertyPath] || m.Measure.PropertyPath;
				} else if (ret[2] == null) {
					ret[2] = columnLabels[m.Measure.PropertyPath] || m.Measure.PropertyPath;
				}
			}
		});
		return ret;
	};
	sap.ovp.cards.charts.Utils.BubbleChart.getMeasurePriorityList.requiresIContext = true;


	sap.ovp.cards.charts.Utils.BubbleChart.getValueAxisFeed = function(iContext, measures) {
		return sap.ovp.cards.charts.Utils.BubbleChart.getMeasurePriorityList(iContext, measures)[0];
	};
	sap.ovp.cards.charts.Utils.BubbleChart.getValueAxisFeed.requiresIContext = true;


	sap.ovp.cards.charts.Utils.BubbleChart.getValueAxis2Feed = function(iContext, measures) {
		return sap.ovp.cards.charts.Utils.BubbleChart.getMeasurePriorityList(iContext, measures)[1];
	};
	sap.ovp.cards.charts.Utils.BubbleChart.getValueAxis2Feed.requiresIContext = true;


	sap.ovp.cards.charts.Utils.BubbleChart.getBubbleWidthFeed = function(iContext, measures) {
		return sap.ovp.cards.charts.Utils.BubbleChart.getMeasurePriorityList(iContext, measures)[2];
	};
	sap.ovp.cards.charts.Utils.BubbleChart.getBubbleWidthFeed.requiresIContext = true;


	sap.ovp.cards.charts.Utils.BubbleChart.getColorFeed = function(iContext, dimensions) {
		var entityTypeObject = iContext.getSetting('ovpCardProperties').getProperty("/entityType");
		if (!entityTypeObject) {
			return "";
		}
		var columnLabels = sap.ovp.cards.charts.Utils.getAllColumnLabels(entityTypeObject);
		var ret = [];
		var feedValue;
		jQuery.each(dimensions, function(i, d){
			if (d.Role.EnumMember.split("/")[1] === "Series") {
				feedValue = columnLabels[d.Dimension.PropertyPath];
				ret.push(feedValue ? feedValue : d.Dimension.PropertyPath);
			}
		});
		return ret.join(",");
	};
	sap.ovp.cards.charts.Utils.BubbleChart.getColorFeed.requiresIContext = true;

	sap.ovp.cards.charts.Utils.BubbleChart.getShapeFeed = function(iContext, dimensions) {
		var entityTypeObject = iContext.getSetting('ovpCardProperties').getProperty("/entityType");
		if (!entityTypeObject) {
			return "";
		}
		var columnLabels = sap.ovp.cards.charts.Utils.getAllColumnLabels(entityTypeObject);
		var ret = [];
		var feedValue;
		jQuery.each(dimensions, function(i, d){
			if (d.Role.EnumMember.split("/")[1] === "Category") {
				feedValue = columnLabels[d.Dimension.PropertyPath];
				ret.push(feedValue ? feedValue : d.Dimension.PropertyPath);
			}
		});
		return ret.join(",");
	};
	sap.ovp.cards.charts.Utils.BubbleChart.getShapeFeed.requiresIContext = true;


	sap.ovp.cards.charts.Utils.BubbleChart.testColorFeed = function(iContext, dimensions) {
		return sap.ovp.cards.charts.Utils.BubbleChart.getColorFeed(iContext, dimensions) !== "";
	};
	sap.ovp.cards.charts.Utils.BubbleChart.testColorFeed.requiresIContext = true;


	sap.ovp.cards.charts.Utils.BubbleChart.testShapeFeed = function(iContext, dimensions) {
		return sap.ovp.cards.charts.Utils.BubbleChart.getShapeFeed(iContext, dimensions) !== "";
	};
	sap.ovp.cards.charts.Utils.BubbleChart.testShapeFeed.requiresIContext = true;


	sap.ovp.cards.charts.Utils.validateMeasuresDimensions = function(vizFrame, type) {
		var measuresArr = null;
		var dimensionsArr = null;
		if (!vizFrame.getDataset()) {
			jQuery.sap.log.error("OVP-AC: " + type + " Card Error: No Dataset defined for chart.");
			return false;
		}
		measuresArr = vizFrame.getDataset().getMeasures();
		dimensionsArr = vizFrame.getDataset().getDimensions();

		switch (type) {
		case "Bubble":
			if (measuresArr.length !== 3 || dimensionsArr.length < 1 ||
					!measuresArr[0].getName() || !measuresArr[1].getName() || !measuresArr[2].getName() ||
					!dimensionsArr[0].getName()) {
				jQuery.sap.log.error("OVP-AC: Bubble Card Error: Enter exactly 3 measures and at least 1 dimension.");
				return false;
			}
			break;

		case "Donut":
			if (measuresArr.length !== 1 || dimensionsArr.length !== 1 ||
					!measuresArr[0].getName() || !dimensionsArr[0].getName()) {
				jQuery.sap.log.error("OVP-AC: Donut Card Error: Enter exactly 1 measure and 1 dimension.");
				return false;
			}
			break;

		case "Line":
			if (measuresArr.length < 1 || dimensionsArr.length < 1 ||
					!measuresArr[0].getName() || !dimensionsArr[0].getName()) {
				jQuery.sap.log.error("OVP-AC: Line Card Error: Configure at least 1 dimensions and 1 measure.");
				return false;
			}
			break;
		}
		return true;
	};

	/*
	 * Check if annotations exist vis-a-vis manifest
	 * @param {String} term - Annotation with Qualifier
	 * @param {Object} annotation - Annotation Data
	 * @param {String} type - Type of Annotation
	 * @param {Boolean} [bMandatory=false] - Whether the term is mandatory
	 * @returns {Boolean}
	 */
	sap.ovp.cards.charts.Utils.checkExists = function(term, annotation, type, bMandatory, logViewId) {
		bMandatory = typeof bMandatory === "undefined" ? false : bMandatory;
		var ret = false;
		var annoTerm;
		if (!term && bMandatory) {
			jQuery.sap.log.error(logViewId + "OVP-AC: Analytic card: Error: " + type + " is mandatory.");
			return ret;
		}
		if (!term) {
			/* Optional parameters can be blank */
			jQuery.sap.log.warning(logViewId + "OVP-AC: Analytic card: Warning: " + type + " is missing.");
			ret = true;
			return ret;
		}
		annoTerm = annotation[term];
		if (!annoTerm || typeof annoTerm !== "object") {
			var logger = bMandatory ? jQuery.sap.log.error : jQuery.sap.log.warning;
			logger(logViewId + "OVP-AC: Analytic card: Error in " + type +
					". (" + term + " is not found or not well formed)");
			return ret;
		}
		ret = true;
		return ret;
	};

	/*
	 * Check and log errors/warnings if any.
	 */
	sap.ovp.cards.charts.Utils.validateCardConfiguration = function(oController) {
		var ret = false;
		if (!oController) {
			return ret;
		}
		var selVar;
		var chartAnno;
		var preVar;
		var idAnno;
		var dPAnno;
		var entityTypeData;
		var logViewId = "";
		var oCardsModel;
		var oView = oController.getView();
		if (oView) {
			logViewId = "[" + oView.getId() + "] ";
		}

		if (!(oCardsModel = oController.getCardPropertiesModel())) {
			jQuery.sap.log.error(logViewId + "OVP-AC: Analytic card: Error in card configuration." +
					"Could not obtain Cards model.");
			return ret;
		}

		entityTypeData = oCardsModel.getProperty("/entityType");
		if (!entityTypeData || jQuery.isEmptyObject(entityTypeData)) {
			jQuery.sap.log.error(logViewId + "OVP-AC: Analytic card: Error in card annotation.");
			return ret;
		}

		selVar = oCardsModel.getProperty("/selectionAnnotationPath");
		chartAnno = oCardsModel.getProperty("/chartAnnotationPath");
		preVar = oCardsModel.getProperty("/presentationAnnotationPath");
		idAnno = oCardsModel.getProperty("/identificationAnnotationPath");
		dPAnno = oCardsModel.getProperty("/dataPointAnnotationPath");
		

		ret = this.checkExists(selVar, entityTypeData, "Selection Variant", false, logViewId);
		ret = this.checkExists(chartAnno, entityTypeData, "Chart Annotation", true, logViewId) && ret;
		ret = this.checkExists(preVar, entityTypeData, "Presentation Variant", false, logViewId) && ret;
		ret = this.checkExists(idAnno, entityTypeData, "Identification Annotation", true, logViewId) && ret;
		ret = this.checkExists(dPAnno, entityTypeData, "Data Point", false, logViewId) && ret;
		return ret;
	};


	sap.ovp.cards.charts.Utils.checkNoData = function(oEvent, cardContainer, vizFrame) {
		var data, noDataDiv;
		if (!cardContainer) {
			jQuery.sap.log.error("OVP-AC: Analytic card Error: Could not obtain card container. " +
					"(" + vizFrame.getId() + ")");
			return;
		}
		data = oEvent.getParameter("data");
		if (!data || jQuery.isEmptyObject(data) ||
			!data.results || !data.results.length) {

			jQuery.sap.log.error("OVP-AC: Analytic card Error: No data available. " +
					"(" + vizFrame.getId() + ")");
			noDataDiv = sap.ui.xmlfragment("sap.ovp.cards.charts.generic.noData");
			cardContainer.removeAllItems();
			cardContainer.addItem(noDataDiv);
		}
	};

}());