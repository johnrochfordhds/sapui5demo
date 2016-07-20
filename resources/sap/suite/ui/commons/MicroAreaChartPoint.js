/*!
 * 
 * 		SAP UI development toolkit for HTML5 (SAPUI5)
 * 		(c) Copyright 2009-2015 SAP SE. All rights reserved
 * 	
 */
jQuery.sap.declare("sap.suite.ui.commons.MicroAreaChartPoint");jQuery.sap.require("sap.suite.ui.commons.library");jQuery.sap.require("sap.ui.core.Element");sap.ui.core.Element.extend("sap.suite.ui.commons.MicroAreaChartPoint",{metadata:{deprecated:true,publicMethods:["getXValue","getYValue"],library:"sap.suite.ui.commons",properties:{"x":{type:"float",group:"Misc",defaultValue:null},"y":{type:"float",group:"Misc",defaultValue:null}}}});
/*!
 * ${copyright}
 */
jQuery.sap.require("sap.suite.ui.microchart.AreaMicroChartPoint");sap.suite.ui.microchart.AreaMicroChartPoint.extend("sap.suite.ui.commons.MicroAreaChartPoint",{metadata:{library:"sap.suite.ui.commons"}});
