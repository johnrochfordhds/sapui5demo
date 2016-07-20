/*
 * 
 * 		SAP UI development toolkit for HTML5 (SAPUI5)
 * 		(c) Copyright 2009-2015 SAP SE. All rights reserved
 * 	
 */
jQuery.sap.declare("sap.suite.ui.commons.ProcessFlowRenderer");jQuery.sap.require("sap.suite.ui.commons.ProcessFlowLaneHeader");sap.suite.ui.commons.ProcessFlowRenderer={};
sap.suite.ui.commons.ProcessFlowRenderer.render=function(r,c){var s=this.getZoomStyleClass(c),a,p,l,P=sap.suite.ui.commons.ProcessFlowRenderer,C,o;o=P._renderBasicStructure(r,c);if(o){return;}try{a=c._getOrCreateProcessFlow();p=c._getOrCreateLaneMap();C=c._getConnectionsMap();}catch(e){c._handleException(e);return;}r.write("<table");r.writeAttribute("id",c.getId()+"-table");r.addClass("sapSuiteUiCommonsPF");r.addClass(s);r.writeClasses();r.write(">");l=Object.keys(p).length;P._renderTableHeader(r,c,p,l);P._renderTableBody(r,c,l,a,C);r.write("</table>");r.write("</div>");r.write("</div>");this._writeCounter(r,c,"Right");r.renderControl(c._getScrollingArrow("right"));r.write("</div>");};
sap.suite.ui.commons.ProcessFlowRenderer.getZoomStyleClass=function(c){switch(c.getZoomLevel()){case sap.suite.ui.commons.ProcessFlowZoomLevel.One:return"sapSuiteUiCommonsPFZoomLevel1";case sap.suite.ui.commons.ProcessFlowZoomLevel.Two:return"sapSuiteUiCommonsPFZoomLevel2";case sap.suite.ui.commons.ProcessFlowZoomLevel.Three:return"sapSuiteUiCommonsPFZoomLevel3";case sap.suite.ui.commons.ProcessFlowZoomLevel.Four:return"sapSuiteUiCommonsPFZoomLevel4";}};
sap.suite.ui.commons.ProcessFlowRenderer._renderNormalNodeHeader=function(r,c,n,i,a){r.write("<th colspan=\"3\">");r.renderControl(n);r.write("</th>");if(i<a-1){r.write("<th colspan=\"2\">");var l=sap.suite.ui.commons.ProcessFlowLaneHeader.createNewProcessSymbol(c._isHeaderMode());l.attachPress(jQuery.proxy(c.ontouchend,c));r.renderControl(l);r.write("</th>");}};
sap.suite.ui.commons.ProcessFlowRenderer._renderMergedNodeHeader=function(r,c,n,a,l,d){var N=c._mergeLaneIdNodeStates(l);n.setState(N);a++;var b=a*3+(a-1)*2;r.write("<th colspan=\""+b+"\">");r.renderControl(n);r.write("</th>");if(d){r.write("<th colspan=\"2\">");var L=sap.suite.ui.commons.ProcessFlowLaneHeader.createNewProcessSymbol(c._isHeaderMode());L.attachPress(jQuery.proxy(c.ontouchend,c));r.renderControl(L);r.write("</th>");}};
sap.suite.ui.commons.ProcessFlowRenderer._writeCounter=function(r,c,d){r.write("<span");r.writeAttribute("id",c.getId()+"-counter"+d);r.addClass("suiteUiPFHCounter");r.addClass("suiteUiPFHCounter"+d);r.writeClasses();r.write(">");r.writeEscaped("0");r.write("</span>");};
sap.suite.ui.commons.ProcessFlowRenderer._renderNode=function(r,c,n,i){if(i){r.writeAttribute("tabindex",0);r.writeAttributeEscaped("aria-label",n._getAriaText());r.write(">");i=false;}n._setParentFlow(c);n._setZoomLevel(c.getZoomLevel());n._setFoldedCorner(c.getFoldedCorners());r.renderControl(n);return i;};
sap.suite.ui.commons.ProcessFlowRenderer._renderConnection=function(r,c,C,i){if(i){if(C.getAggregation("_labels")&&C.getAggregation("_labels").length>0){r.writeAttribute("tabindex",0);}r.write(">");i=false;}C.setZoomLevel(c.getZoomLevel());c.addAggregation("_connections",C);r.renderControl(C);return i;};
sap.suite.ui.commons.ProcessFlowRenderer._renderTableHeader=function(r,c,m,n){var i,N,o,l,d;r.write("<thead");r.writeAttribute("id",c.getId()+"-thead");r.write(">");r.write("<tr");r.addClass("sapSuiteUiCommonsPFHeader");r.addClass("sapSuiteUiCommonsPFHeaderHidden");if(c.getShowLabels()){r.addClass("sapSuiteUiPFWithLabel");}r.writeClasses();r.write(">");r.write("<th></th>");i=0;while(i<n-1){r.write("<th></th><th></th><th></th><th></th><th></th>");i++;}r.write("<th></th><th></th><th></th>");r.write("<th></th>");r.write("</tr>");r.write("<tr");r.addClass("sapSuiteUiCommonsPFHeaderRow");r.writeClasses();r.write(">");r.write("<th>");l=sap.suite.ui.commons.ProcessFlowLaneHeader.createNewStartSymbol(c._isHeaderMode());r.renderControl(l);r.write("</th>");i=0;var a=0;var b=[];d=false;while(i<(n-1)){var p=1;N=m[i];o=m[i+1];if(N.getLaneId()+p===o.getLaneId()){a=a+1;b.push(N.getState());}else{if(a===0){this._renderNormalNodeHeader(r,c,N,i,n);}else{b.push(N.getState());d=true;this._renderMergedNodeHeader(r,c,N,a,b,d);b=[];a=0;}}i++;}if(a===0){if(!o){o=m[0];}this._renderNormalNodeHeader(r,c,o,i,n);}else{b.push(o.getState());d=false;this._renderMergedNodeHeader(r,c,N,a,b,d);a=0;}r.write("<th>");l=sap.suite.ui.commons.ProcessFlowLaneHeader.createNewEndSymbol(c._isHeaderMode());r.renderControl(l);r.write("</th>");r.write("</tr>");r.write("</thead>");};
sap.suite.ui.commons.ProcessFlowRenderer._renderTableBody=function(r,c,a,b,C){var i,j,n,N;var s=sap.suite.ui.commons.ProcessFlowRenderer._checkIfHightedOrSelectedNodesExists(C);r.write("<tbody>");var m=b.length;if(m>0){r.write("<tr>");r.write("<td");r.writeAttribute("colspan",(a*5).toString());r.write(">");r.write("</tr>");}i=0;while(i<m){r.write("<tr>");r.write("<td></td>");n=b[i].length;j=0;while(j<n-1){N=b[i][j];var d=true;if((j==0)||(j%2)){r.write("<td");}else{r.write("<td colspan=\"4\"");if(sap.ui.Device.browser.name==="cr"){r.addClass("sapSuiteUiCommonsProcessFlowZIndexForConnectors");r.writeClasses();}}if(N){if(N instanceof sap.suite.ui.commons.ProcessFlowNode){d=sap.suite.ui.commons.ProcessFlowRenderer._renderNode(r,c,N,d);}else{N._setShowLabels(c.getShowLabels());sap.suite.ui.commons.ProcessFlowRenderer._setLabelsInConnection(b,C,N,{row:i,column:j},c,s);d=sap.suite.ui.commons.ProcessFlowRenderer._renderConnection(r,c,N,d);}}if(d){r.write(">");}r.write("</td>");j++;}r.write("<td></td>");r.write("<td></td>");r.write("</tr>");i++;}r.write("</tbody>");};
sap.suite.ui.commons.ProcessFlowRenderer._renderBasicStructure=function(r,c){r.write("<div");r.writeAttribute("aria-label","process flow");r.writeControlData(c);r.addClass("sapSuiteUiPFContainer");if(c._arrowScrollable){r.addClass("sapPFHScrollable");if(c._bPreviousScrollForward){r.addClass("sapPFHScrollForward");}else{r.addClass("sapPFHNoScrollForward");}if(c._bPreviousScrollBack){r.addClass("sapPFHScrollBack");}else{r.addClass("sapPFHNoScrollBack");}}else{r.addClass("sapPFHNotScrollable");}r.writeClasses();r.write(">");this._writeCounter(r,c,"Left");r.renderControl(c._getScrollingArrow("left"));r.write("<div");r.writeAttribute("id",c.getId()+"-scrollContainer");r.addClass("sapSuiteUiScrollContainerPF");r.addClass("sapSuiteUiDefaultCursorPF");r.writeClasses();r.write(">");r.write("<div");r.writeAttribute("id",c.getId()+"-scroll-content");r.writeAttribute("tabindex",0);r.write(">");if(!c.getLanes()||c.getLanes().length==0){r.write("</div>");r.write("</div>");r.write("</div>");return true;}return false;};
sap.suite.ui.commons.ProcessFlowRenderer._setLabelsInConnection=function(c,a,b,p,C,s){for(var i=0;i<a.length;i++){var d=a[i];if(d&&d.label){for(var j=0;j<d.connectionParts.length;j++){var e=d.connectionParts[j];if(e.x===p.column&&e.y===p.row){if(c[p.row][p.column+1]instanceof sap.suite.ui.commons.ProcessFlowNode&&c[p.row][p.column+1].getNodeId()===d.targetNode.getNodeId()){sap.suite.ui.commons.ProcessFlowRenderer._setLineTypeInLabel(d,s);if(d.label.getEnabled()){if(d.label.hasListeners("press")){d.label.detachEvent("press",C._handleLabelClick,C);}d.label.attachPress(C._handleLabelClick,C);}b.addAggregation("_labels",d.label,true);}}}}}};
sap.suite.ui.commons.ProcessFlowRenderer._setLineTypeInLabel=function(c,s){var C=false;var b=false;if(c.sourceNode.getSelected()&&c.targetNode.getSelected()){C=true;c.label._setSelected(true);}else{c.label._setSelected(false);}if(c.sourceNode.getHighlighted()&&c.targetNode.getHighlighted()){b=true;c.label._setHighlighted(true);}else{c.label._setHighlighted(false);}if(s&&!C&&!b){c.label._setDimmed(true);}else{c.label._setDimmed(false);}};
sap.suite.ui.commons.ProcessFlowRenderer._checkIfHightedOrSelectedNodesExists=function(c){var s=false;for(var i=0;i<c.length;i++){var C=c[i];if(C.label){if(C.sourceNode.getSelected()&&C.targetNode.getSelected()||C.sourceNode.getHighlighted()&&C.targetNode.getHighlighted()){s=true;}}}return s;};
