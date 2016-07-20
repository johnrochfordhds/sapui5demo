/*!
 * 
 * 		SAP UI development toolkit for HTML5 (SAPUI5)
 * 		(c) Copyright 2009-2015 SAP SE. All rights reserved
 * 	
 */
jQuery.sap.declare("sap.suite.ui.commons.MicroAreaChartLabel");jQuery.sap.require("sap.suite.ui.commons.library");jQuery.sap.require("sap.ui.core.Element");sap.ui.core.Element.extend("sap.suite.ui.commons.MicroAreaChartLabel",{metadata:{deprecated:true,library:"sap.suite.ui.commons",properties:{"label":{type:"string",group:"Misc",defaultValue:null},"color":{type:"sap.suite.ui.commons.InfoTileValueColor",group:"Misc",defaultValue:"Neutral"}}}});
/*!
 * ${copyright}
 */
jQuery.sap.require("sap.suite.ui.microchart.AreaMicroChartLabel");sap.suite.ui.microchart.AreaMicroChartLabel.extend("sap.suite.ui.commons.MicroAreaChartLabel",{metadata:{library:"sap.suite.ui.commons"}});
