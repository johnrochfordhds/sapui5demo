/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP SE. All rights reserved
 */
jQuery.sap.declare("sap.apf.ui.representations.lineChartWithTwoVerticalAxes");
jQuery.sap.require("sap.apf.ui.representations.BaseVizFrameChartRepresentation");
/**
 * @class lineChartWithTwoVerticalAxes constructor.
 * @param oParametersdefines parameters required for chart such as Dimension/Measures,tooltip, axis information.
 * @returns chart object
 */
sap.apf.ui.representations.lineChartWithTwoVerticalAxes = function(oApi, oParameters) {
	sap.apf.ui.representations.BaseVizFrameChartRepresentation.apply(this, [ oApi, oParameters ]);
	this.type = sap.apf.ui.utils.CONSTANTS.representationTypes.LINE_CHART_WITH_TWO_VERTICAL_AXES;
	this.chartType = sap.apf.ui.utils.CONSTANTS.vizFrameChartTypes.LINE_CHART_WITH_TWO_VERTICAL_AXES;
	//this.setVizPropsForSpecificRepresentation(vizProperties);
	this._addDefaultKind();
};
sap.apf.ui.representations.lineChartWithTwoVerticalAxes.prototype = Object.create(sap.apf.ui.representations.BaseVizFrameChartRepresentation.prototype);
//Set the "constructor" property to refer to lineChartWithTwoVerticalAxes
sap.apf.ui.representations.lineChartWithTwoVerticalAxes.prototype.constructor = sap.apf.ui.representations.lineChartWithTwoVerticalAxes;
/** 
 * @private
 * @method _addDefaultKind
 * @description reads the oParameters for chart and modifies it by including a default kind
 * in case the "kind" property is not defined in dimension/measures
 */
sap.apf.ui.representations.lineChartWithTwoVerticalAxes.prototype._addDefaultKind = function() {
	this.parameter.measures.forEach(function(measure, index) {
		if (measure.kind === undefined) {//handle the scenario where the kind is not available
			measure.kind = index === 0 ? sap.apf.core.constants.representationMetadata.kind.YAXIS : sap.apf.core.constants.representationMetadata.kind.YAXIS2;
		}
	});
	this.parameter.dimensions.forEach(function(dimension, index) {
		if (dimension.kind === undefined) {//handle the scenario where the kind is not available
			dimension.kind = index === 0 ? sap.apf.core.constants.representationMetadata.kind.XAXIS : sap.apf.core.constants.representationMetadata.kind.LEGEND;
		}
	});
};
/** 
 * @method setVizPropsForSpecificRepresentation
 * @description sets the vizProperies specific to the representation on main chart
 */
sap.apf.ui.representations.lineChartWithTwoVerticalAxes.prototype.setVizPropsForSpecificRepresentation = function() {
	this.chart.setVizProperties({
		plotArea : {
			primaryValuesColorPalette : [ "#FF0000", "#9400D3" ],
			secondaryValuesColorPalette : [ "#0000FF", "#008000" ]
		},
		valueAxis : {
			title : {
				style : {
					color : "#000000"
				}
			}
		},
		valueAxis2 : {
			visible : true,
			title : {
				visible : true,
				style : {
					color : "#000000"
				}
			},
			label : {
				visible : true
			}
		}
	});
};
/** 
* @method setVizPropsForSpecificRepresentation
* @description sets the vizProperies specific to the representation on thumbnail chart
*/
sap.apf.ui.representations.lineChartWithTwoVerticalAxes.prototype.setVizPropsOfThumbnailForSpecificRepresentation = function() {
	this.thumbnailChart.setVizProperties({
		valueAxis2 : {
			visible : false,
			title : {
				visible : false
			}
		},
		plotArea : {
			primaryValuesColorPalette : [ "#FF0000", "#9400D3" ],
			secondaryValuesColorPalette : [ "#0000FF", "#008000" ]
		}
	});
};
sap.apf.ui.representations.lineChartWithTwoVerticalAxes.prototype.getAxisFeedItemId = function(sKind) {
	var oSupportedTypes = sap.apf.core.constants.representationMetadata.kind;
	var axisfeedItemId;
	switch (sKind) {
		case oSupportedTypes.XAXIS:
			axisfeedItemId = sap.apf.core.constants.vizFrame.feedItemTypes.CATEGORYAXIS;
			break;
		case oSupportedTypes.YAXIS:
			axisfeedItemId = sap.apf.core.constants.vizFrame.feedItemTypes.VALUEAXIS;
			break;
		case oSupportedTypes.YAXIS2:
			axisfeedItemId = sap.apf.core.constants.vizFrame.feedItemTypes.VALUEAXIS2;
			break;
		case oSupportedTypes.LEGEND:
			axisfeedItemId = sap.apf.core.constants.vizFrame.feedItemTypes.COLOR;
			break;
		default:
			break;
	}
	return axisfeedItemId;
};
