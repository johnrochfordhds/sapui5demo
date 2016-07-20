/*!
* SAP APF Analysis Path Framework
* 
 * (c) Copyright 2012-2014 SAP SE. All rights reserved
*/
jQuery.sap.require("sap.apf.ui.representations.BaseVizFrameChartRepresentation");jQuery.sap.require("sap.apf.core.constants");jQuery.sap.declare("sap.apf.ui.representations.pieChart");
sap.apf.ui.representations.pieChart=function(a,p){sap.apf.ui.representations.BaseVizFrameChartRepresentation.apply(this,[a,p]);this.type=sap.apf.ui.utils.CONSTANTS.representationTypes.PIE_CHART;this.chartType=sap.apf.ui.utils.CONSTANTS.vizFrameChartTypes.PIE;this._addDefaultKind();};
sap.apf.ui.representations.pieChart.prototype=Object.create(sap.apf.ui.representations.BaseVizFrameChartRepresentation.prototype);sap.apf.ui.representations.pieChart.prototype.constructor=sap.apf.ui.representations.pieChart;
sap.apf.ui.representations.pieChart.prototype._addDefaultKind=function(){this.parameter.measures.forEach(function(m){if(m.kind===undefined){m.kind=sap.apf.core.constants.representationMetadata.kind.SECTORSIZE;}});this.parameter.dimensions.forEach(function(d){if(d.kind===undefined){d.kind=sap.apf.core.constants.representationMetadata.kind.SECTORCOLOR;}});};
sap.apf.ui.representations.pieChart.prototype.getAxisFeedItemId=function(k){var s=sap.apf.core.constants.representationMetadata.kind;var a;switch(k){case s.SECTORCOLOR:a=sap.apf.core.constants.vizFrame.feedItemTypes.COLOR;break;case s.SECTORSIZE:a=sap.apf.core.constants.vizFrame.feedItemTypes.SIZE;break;default:break;}return a;};
