/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP SE. All rights reserved
 */
jQuery.sap.require("sap.apf.core.constants");jQuery.sap.declare("sap.apf.ui.representations.utils.vizFrameDatasetHelper");
sap.apf.ui.representations.utils.vizFrameDatasetHelper=function(){this.getDataset=function(p){var f,i,a,b;f=jQuery.extend(true,{},p);for(i=0;i<f.dimensions.length;i++){for(a in f.dimensions[i]){if(((a!=='name')&&(a!=='value')&&(a!=='dataType'))){delete f.dimensions[i][a];}}}for(i=0;i<f.measures.length;i++){for(b in f.measures[i]){if(((b!=='name')&&(b!=='value'))){delete f.measures[i][b];}}}f.data={path:"/data"};return f;};};
