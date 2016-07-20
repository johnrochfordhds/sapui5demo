/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP SE. All rights reserved
 */
/**
 * @class utils
 * @name utils
 * @memberOf sap.apf.ui.representations
 * @description holds utility functions used by viz representations
 */
jQuery.sap.require("sap.apf.core.constants");
jQuery.sap.declare("sap.apf.ui.representations.utils.vizFrameDatasetHelper");
/**
 * @class vizFrameDatasetHelper
 * @name vizFrameDatasetHelper
 * @memberOf sap.apf.ui.representations.utils
 * @description holds utility functions to determine the feedItem type id for dimensions and measures for each vizFrame chart
 * 
 */
sap.apf.ui.representations.utils.vizFrameDatasetHelper = function() {
	this.getDataset = function(oParameters) {
		var oFlattenDataSet, i, propDim, propMeas;
		oFlattenDataSet = jQuery.extend(true, {}, oParameters);
		for(i = 0; i < oFlattenDataSet.dimensions.length; i++) {
			for(propDim in oFlattenDataSet.dimensions[i]) {
				if (((propDim !== 'name') && (propDim !== 'value') && (propDim !== 'dataType'))) {
					delete oFlattenDataSet.dimensions[i][propDim];
				}
			}
		}
		for(i = 0; i < oFlattenDataSet.measures.length; i++) {
			for(propMeas in oFlattenDataSet.measures[i]) {
				if (((propMeas !== 'name') && (propMeas !== 'value'))) {
					delete oFlattenDataSet.measures[i][propMeas];
				}
			}
		}
		oFlattenDataSet.data = {
			path : "/data"
		};
		return oFlattenDataSet;
	};
};
