/*!
 * 
 * 		SAP UI development toolkit for HTML5 (SAPUI5)
 * 		(c) Copyright 2009-2015 SAP SE. All rights reserved
 * 	
 */
jQuery.sap.declare("sap.suite.ui.commons.BulletChartData");jQuery.sap.require("sap.suite.ui.commons.library");jQuery.sap.require("sap.ui.core.Element");sap.ui.core.Element.extend("sap.suite.ui.commons.BulletChartData",{metadata:{deprecated:true,library:"sap.suite.ui.commons",properties:{"value":{type:"float",group:"Misc",defaultValue:0},"color":{type:"sap.suite.ui.commons.InfoTileValueColor",group:"Misc",defaultValue:sap.suite.ui.commons.InfoTileValueColor.Neutral}}}});
/*!
 * ${copyright}
 */
jQuery.sap.require("sap.suite.ui.microchart.BulletMicroChartData");sap.suite.ui.microchart.BulletMicroChartData.extend("sap.suite.ui.commons.BulletChartData",{metadata:{library:"sap.suite.ui.commons"}});
