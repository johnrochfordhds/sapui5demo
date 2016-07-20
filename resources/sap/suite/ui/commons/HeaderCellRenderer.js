/*!
 * 
 * 		SAP UI development toolkit for HTML5 (SAPUI5)
 * 		(c) Copyright 2009-2015 SAP SE. All rights reserved
 * 	
 */
jQuery.sap.declare("sap.suite.ui.commons.HeaderCellRenderer");sap.suite.ui.commons.HeaderCellRenderer={};
sap.suite.ui.commons.HeaderCellRenderer.render=function(r,c){var w=c.getWest();var n=c.getNorth();var e=c.getEast();var s=c.getSouth();var t="";var d="";if(w!=null){t+="W";d+=c.getId()+"-west ";}if(n!=null){t+="N";d+=c.getId()+"-north ";}if(e!=null){t+="E";d+=c.getId()+"-east ";}if(s!=null){t+="S";d+=c.getId()+"-south";}r.write("<div");r.writeControlData(c);r.addClass("sapSuiteUiCommonsHeaderCell");r.addStyle("height",c.getHeight());r.writeStyles();r.writeClasses();r.writeAttribute("role","presentation");r.writeAttribute("aria-live","assertive");r.writeAttribute("aria-labelledby",d);r.write(">");if(w!=null){this._renderInnerCell(r,w,t,"sapSuiteHdrCellWest",c.getId()+"-west");}if(n!=null){this._renderInnerCell(r,n,t,"sapSuiteHdrCellNorth",c.getId()+"-north");}if(e!=null){this._renderInnerCell(r,e,t,"sapSuiteHdrCellEast",c.getId()+"-east");}if(s!=null){this._renderInnerCell(r,s,t,"sapSuiteHdrCellSouth",c.getId()+"-south");}r.write("</div>");};
sap.suite.ui.commons.HeaderCellRenderer._renderInnerCell=function(r,c,t,s,i){r.write("<div");r.addClass(t);r.addClass(s);r.addStyle("height",c.getHeight());r.writeStyles();r.writeClasses();r.writeAttribute("id",i);if(c.getContent()&&c.getContent().getId()){r.writeAttribute("aria-labelledby",c.getContent().getId());}r.write(">");r.renderControl(c.getContent());r.write("</div>");};
