/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
sap.ui.jsview("sap.apf.ui.reuse.view.deleteAnalysisPath",{getControllerName:function(){return"sap.apf.ui.reuse.controller.deleteAnalysisPath";},createContent:function(c){var a=jQuery(window).height()*0.6+"px";var b=jQuery(window).height()*0.6+"px";var l=jQuery(window).height()*0.55+"px";var d=jQuery(window).height()*0.55+"px";this.oCoreApi=this.getViewData().oInject.oCoreApi;this.oUiApi=this.getViewData().oInject.uiApi;var s=this;var e=new sap.m.List({width:l,height:d,mode:sap.m.ListMode.Delete,items:{path:"/GalleryElements",template:new sap.m.StandardListItem({title:"{AnalysisPathName}",description:"{description}",tooltip:"{AnalysisPathName}"})},"delete":c.handleDeleteOfDialog.bind(c)});var D=new sap.m.Dialog({title:s.oCoreApi.getTextNotHtmlEncoded("select-analysis-path"),contentWidth:a,contentHeight:b,content:e,leftButton:new sap.m.Button({text:s.oCoreApi.getTextNotHtmlEncoded("close"),press:function(){D.close();s.oUiApi.getLayoutView().setBusy(false);}})});if(sap.ui.Device.system.desktop){this.addStyleClass("sapUiSizeCompact");D.addStyleClass("sapUiSizeCompact");}return D;}});
