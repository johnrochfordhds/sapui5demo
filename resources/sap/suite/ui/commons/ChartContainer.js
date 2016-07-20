/*!
 * 
 * 		SAP UI development toolkit for HTML5 (SAPUI5)
 * 		(c) Copyright 2009-2015 SAP SE. All rights reserved
 * 	
 */
jQuery.sap.declare("sap.suite.ui.commons.ChartContainer");jQuery.sap.require("sap.suite.ui.commons.library");jQuery.sap.require("sap.ui.core.Control");sap.ui.core.Control.extend("sap.suite.ui.commons.ChartContainer",{metadata:{publicMethods:["switchChart","updateChartContainer","getSelectedContent"],library:"sap.suite.ui.commons",properties:{"showPersonalization":{type:"boolean",group:"Misc",defaultValue:false},"showFullScreen":{type:"boolean",group:"Misc",defaultValue:false},"fullScreen":{type:"boolean",group:"Misc",defaultValue:false},"showLegend":{type:"boolean",group:"Misc",defaultValue:true},"title":{type:"string",group:"Misc",defaultValue:''},"selectorGroupLabel":{type:"string",group:"Misc",defaultValue:null,deprecated:true},"autoAdjustHeight":{type:"boolean",group:"Misc",defaultValue:false},"showZoom":{type:"boolean",group:"Misc",defaultValue:true},"showLegendButton":{type:"boolean",group:"Misc",defaultValue:true}},defaultAggregation:"content",aggregations:{"dimensionSelectors":{type:"sap.ui.core.Control",multiple:true,singularName:"dimensionSelector"},"content":{type:"sap.suite.ui.commons.ChartContainerContent",multiple:true,singularName:"content"},"toolBar":{type:"sap.m.OverflowToolbar",multiple:false,visibility:"hidden"},"customIcons":{type:"sap.ui.core.Icon",multiple:true,singularName:"customIcon"}},events:{"personalizationPress":{},"contentChange":{},"customZoomInPress":{},"customZoomOutPress":{}}}});sap.suite.ui.commons.ChartContainer.M_EVENTS={'personalizationPress':'personalizationPress','contentChange':'contentChange','customZoomInPress':'customZoomInPress','customZoomOutPress':'customZoomOutPress'};jQuery.sap.require("sap.m.Button");jQuery.sap.require("sap.m.Select");jQuery.sap.require("sap.ui.core.ResizeHandler");jQuery.sap.require("sap.ui.Device");jQuery.sap.require("sap.m.OverflowToolbarButton");jQuery.sap.require("sap.ui.core.delegate.ScrollEnablement");sap.ui.getCore().loadLibrary("sap.viz");
sap.suite.ui.commons.ChartContainer.prototype.setFullScreen=function(f){if(this._firstTime){return;}if(this.getFullScreen()==f){return;}var a=this.getProperty("fullScreen");if(a!==f){this._toggleFullScreen();}};
sap.suite.ui.commons.ChartContainer.prototype.switchChart=function(c){this._setSelectedContent(c);this.rerender();};
sap.suite.ui.commons.ChartContainer.prototype.setTitle=function(v){this._oChartTitle.setText(v);this.setProperty("title",v,true);};
sap.suite.ui.commons.ChartContainer.prototype.setShowLegendButton=function(v){if(this.getShowLegendButton()===v){return;}this.setProperty("showLegendButton",v,false);if(!this.getShowLegendButton()){this.setShowLegend(false);}};
sap.suite.ui.commons.ChartContainer.prototype.setShowLegend=function(v){this.setProperty("showLegend",v,false);var c=this.getAggregation("content");if(c){for(var i=0;i<c.length;i++){var a=c[i].getContent();if(jQuery.isFunction(a.setLegendVisible)){a.setLegendVisible(v);}else{jQuery.sap.log.info("ChartContainer: chart id "+a.getId()+" is missing the setVizProperties property");}}}};
sap.suite.ui.commons.ChartContainer.prototype.addAggregation=function(a,o,s){if(a==="dimensionSelectors"){return this.addDimensionSelector(o);}else{return sap.ui.base.ManagedObject.prototype.addAggregation.apply(this,arguments);}};
sap.suite.ui.commons.ChartContainer.prototype.getAggregation=function(a,d){if(a==="dimensionSelectors"){return this.getDimensionSelectors();}else{return sap.ui.base.ManagedObject.prototype.getAggregation.apply(this,arguments);}};
sap.suite.ui.commons.ChartContainer.prototype.indexOfAggregation=function(a,o){if(a==="dimensionSelectors"){return this.indexOfDimensionSelector(o);}else{return sap.ui.base.ManagedObject.prototype.indexOfAggregation.apply(this,arguments);}};
sap.suite.ui.commons.ChartContainer.prototype.insertAggregation=function(a,o,i,s){if(a==="dimensionSelectors"){return this.insertDimensionSelector(o,i);}else{return sap.ui.base.ManagedObject.prototype.insertAggregation.apply(this,arguments);}};
sap.suite.ui.commons.ChartContainer.prototype.destroyAggregation=function(a,s){if(a==="dimensionSelectors"){return this.destroyDimensionSelectors();}else{return sap.ui.base.ManagedObject.prototype.destroyAggregation.apply(this,arguments);}};
sap.suite.ui.commons.ChartContainer.prototype.removeAggregation=function(a,o,s){if(a==="dimensionSelectors"){return this.removeDimensionSelector(o);}else{return sap.ui.base.ManagedObject.prototype.removeAggregation.apply(this,arguments);}};
sap.suite.ui.commons.ChartContainer.prototype.removeAllAggregation=function(a,s){if(a==="dimensionSelectors"){return this.removeAllDimensionSelectors();}else{return sap.ui.base.ManagedObject.prototype.removeAllAggregation.apply(this,arguments);}};
sap.suite.ui.commons.ChartContainer.prototype.addDimensionSelector=function(o){this._dimSelectorsAll.push(o);return this;};
sap.suite.ui.commons.ChartContainer.prototype.getDimensionSelectors=function(){return this._dimSelectorsAll;};
sap.suite.ui.commons.ChartContainer.prototype.indexOfDimensionSelector=function(d){for(var i=0;i<this._dimSelectorsAll.length;i++){if(this._dimSelectorsAll[i]===d){return i;}}return-1;};
sap.suite.ui.commons.ChartContainer.prototype.insertDimensionSelector=function(d,I){if(!d){return this;}var i;if(I<0){i=0;}else if(I>this._dimSelectorsAll.length){i=this._dimSelectorsAll.length;}else{i=I;}if(i!==I){jQuery.sap.log.warning("ManagedObject.insertAggregation: index '"+I+"' out of range [0,"+this._dimSelectorsAll.length+"], forced to "+i);}this._dimSelectorsAll.splice(i,0,d);return this;};
sap.suite.ui.commons.ChartContainer.prototype.destroyDimensionSelectors=function(){if(this._oToolBar){for(var i=0;i<this._dimSelectorsAll.length;i++){if(this._dimSelectorsAll[i]){this._oToolBar.removeContent(this._dimSelectorsAll[i]);this._dimSelectorsAll[i].destroy();}}}this._dimSelectorsAll=[];return this;};
sap.suite.ui.commons.ChartContainer.prototype.removeDimensionSelector=function(d){if(this._oToolBar){this._oToolBar.removeContent(d);}if(!d){return null;}else{var i=this.indexOfDimensionSelector(d);if(i===-1){return null;}else{var r=this._dimSelectorsAll.splice(i,1);return r[0];}}};
sap.suite.ui.commons.ChartContainer.prototype.removeAllDimensionSelectors=function(){var r=this._dimSelectorsAll.slice();if(this._oToolBar){for(var i=0;i<this._dimSelectorsAll.length;i++){if(this._dimSelectorsAll[i]){this._oToolBar.removeContent(this._dimSelectorsAll[i]);}}}this._dimSelectorsAll=[];return r;};
sap.suite.ui.commons.ChartContainer.prototype.addContent=function(o){this.addAggregation("content",o);this._chartContentChange=true;};
sap.suite.ui.commons.ChartContainer.prototype.insertContent=function(o,i){this.insertAggregation("content",o,i);this._chartContentChange=true;};
sap.suite.ui.commons.ChartContainer.prototype.updateContent=function(){this.updateAggregation("content");this._chartContentChange=true;};
sap.suite.ui.commons.ChartContainer.prototype.updateChartContainer=function(){this._chartContentChange=true;this.rerender();};
sap.suite.ui.commons.ChartContainer.prototype.setSelectorGroupLabel=function(s){this.setProperty("selectorGroupLabel",s,true);};
sap.suite.ui.commons.ChartContainer.prototype.getSelectedContent=function(){return this._oSelectedContent;};
sap.suite.ui.commons.ChartContainer.prototype.getScrollDelegate=function(){return this._oScrollEnablement;};
sap.suite.ui.commons.ChartContainer.prototype.init=function(){var t=this;this._bValue=null;this._firstTime=true;this._aChartIcons=[];this._selectedChart=null;this._dimSelectorsAll=[];this._customIconsAll=[];this._oShowLegendButton=null;this._oActiveChartButton=null;this._oSelectedContent=null;this._bSegmentedButtonSaveSelectState=false;this._mOriginalVizFrameHeights={};this.oResBundle=sap.ui.getCore().getLibraryResourceBundle("sap.suite.ui.commons");this._oFullScreenButton=new sap.m.OverflowToolbarButton({icon:"sap-icon://full-screen",type:sap.m.ButtonType.Transparent,text:this.oResBundle.getText("CHARTCONTAINER_FULLSCREEN"),tooltip:this.oResBundle.getText("CHARTCONTAINER_FULLSCREEN"),press:function(){t._bSegmentedButtonSaveSelectState=true;t._toggleFullScreen();}});this._oPopup=new sap.ui.core.Popup({modal:true,shadow:false,autoClose:false});this._oShowLegendButton=new sap.m.OverflowToolbarButton({icon:"sap-icon://legend",type:sap.m.ButtonType.Transparent,text:this.oResBundle.getText("CHARTCONTAINER_LEGEND"),tooltip:this.oResBundle.getText("CHARTCONTAINER_LEGEND"),press:function(){t._bSegmentedButtonSaveSelectState=true;t._onLegendButtonPress();}});this._oPersonalizationButton=new sap.m.OverflowToolbarButton({icon:"sap-icon://action-settings",type:sap.m.ButtonType.Transparent,text:this.oResBundle.getText("CHARTCONTAINER_PERSONALIZE"),tooltip:this.oResBundle.getText("CHARTCONTAINER_PERSONALIZE"),press:function(){t._oPersonalizationPress();}});this._oZoomInButton=new sap.m.OverflowToolbarButton({icon:"sap-icon://zoom-in",type:sap.m.ButtonType.Transparent,text:this.oResBundle.getText("CHARTCONTAINER_ZOOMIN"),tooltip:this.oResBundle.getText("CHARTCONTAINER_ZOOMIN"),press:function(){t._zoom(true);}});this._oZoomOutButton=new sap.m.OverflowToolbarButton({icon:"sap-icon://zoom-out",type:sap.m.ButtonType.Transparent,text:this.oResBundle.getText("CHARTCONTAINER_ZOOMOUT"),tooltip:this.oResBundle.getText("CHARTCONTAINER_ZOOMOUT"),press:function(){t._zoom(false);}});this._oChartSegmentedButton=new sap.m.SegmentedButton({select:function(e){var c=e.getParameter("button").getCustomData()[0].getValue();t._bSegmentedButtonSaveSelectState=true;t._switchChart(c);}});this._oChartTitle=new sap.m.Label();this._oToolBar=new sap.m.OverflowToolbar({content:[new sap.m.ToolbarSpacer()],width:"auto"});this.setAggregation("toolBar",this._oToolBar);this._currentRangeName=sap.ui.Device.media.getCurrentRange(sap.ui.Device.media.RANGESETS.SAP_STANDARD).name;sap.ui.Device.media.attachHandler(this._handleMediaChange,this,sap.ui.Device.media.RANGESETS.SAP_STANDARD);this.sResizeListenerId=null;if(jQuery.device.is.desktop){this.sResizeListenerId=sap.ui.core.ResizeHandler.register(this,jQuery.proxy(this._performHeightChanges,this));}else{sap.ui.Device.orientation.attachHandler(this._performHeightChanges,this);sap.ui.Device.resize.attachHandler(this._performHeightChanges,this);}};
sap.suite.ui.commons.ChartContainer.prototype.onAfterRendering=function(){var t=this;if((this.sResizeListenerId===null)&&(jQuery.device.is.desktop)){this.sResizeListenerId=sap.ui.core.ResizeHandler.register(this,jQuery.proxy(this._performHeightChanges,this));}if(this.getAutoAdjustHeight()||this.getFullScreen()){jQuery.sap.delayedCall(500,this,function(){t._performHeightChanges();});}var v=this.getSelectedContent()&&this.getSelectedContent().getContent()instanceof sap.viz.ui5.controls.VizFrame;this._oScrollEnablement=new sap.ui.core.delegate.ScrollEnablement(this,this.getId()+"-wrapper",{horizontal:!v,vertical:!v});this._firstTime=false;};
sap.suite.ui.commons.ChartContainer.prototype.onBeforeRendering=function(){var o=function(e,d){d.icon.firePress({controlReference:e.getSource()});};if(this._chartContentChange||this._firstTime){this._chartChange();}if(this.getAggregation("customIcons")&&this.getAggregation("customIcons").length>0){if(this._customIconsAll.length===0){for(var i=0;i<this.getAggregation("customIcons").length;i++){var I=this.getAggregation("customIcons")[i];var b=new sap.m.OverflowToolbarButton({icon:I.getSrc(),text:I.getTooltip(),tooltip:I.getTooltip(),type:sap.m.ButtonType.Transparent,width:"3rem"});b.attachPress({icon:I},o);this._customIconsAll.push(b);}}}else{this._customIconsAll=[];}this._adjustDisplay();};
sap.suite.ui.commons.ChartContainer.prototype.exit=function(){sap.ui.Device.media.detachHandler(this._handleMediaChange,this,sap.ui.Device.media.RANGESETS.SAP_STANDARD);if(this._oFullScreenButton){this._oFullScreenButton.destroy();this._oFullScreenButton=undefined;}if(this._oPopup){this._oPopup.destroy();this._oPopup=undefined;}if(this._oShowLegendButton){this._oShowLegendButton.destroy();this._oShowLegendButton=undefined;}if(this._oPersonalizationButton){this._oPersonalizationButton.destroy();this._oPersonalizationButton=undefined;}if(this._oActiveChartButton){this._oActiveChartButton.destroy();this._oActiveChartButton=undefined;}if(this._oChartSegmentedButton){this._oChartSegmentedButton.destroy();this._oChartSegmentedButton=undefined;}if(this._oSelectedContent){this._oSelectedContent.destroy();this._oSelectedContent=undefined;}if(this._oToolBar){this._oToolBar.destroy();this._oToolBar=undefined;}if(this._dimSelectorsAll){for(var i=0;i<this._dimSelectorsAll.length;i++){if(this._dimSelectorsAll[i]){this._dimSelectorsAll[i].destroy();}}this._dimSelectorsAll=undefined;}if(this._oScrollEnablement){this._oScrollEnablement.destroy();this._oScrollEnablement=undefined;}if(jQuery.device.is.desktop&&this.sResizeListenerId){sap.ui.core.ResizeHandler.deregister(this.sResizeListenerId);this.sResizeListenerId=null;}else{sap.ui.Device.orientation.detachHandler(this._performHeightChanges,this);sap.ui.Device.resize.detachHandler(this._performHeightChanges,this);}if(this._oZoomInButton){this._oZoomInButton.destroy();this._oZoomInButton=undefined;}if(this._oZoomOutButton){this._oZoomOutButton.destroy();this._oZoomOutButton=undefined;}};
sap.suite.ui.commons.ChartContainer.prototype._toggleFullScreen=function(){var f,I,h,c,o;f=this.getProperty("fullScreen");if(f){c=this.getAggregation("content");this._closeFullScreen();this.setProperty("fullScreen",false,true);for(var i=0;i<c.length;i++){o=c[i].getContent();o.setWidth("100%");h=this._mOriginalVizFrameHeights[o.getId()];if(h){o.setHeight(h);}}this.invalidate();}else{this._openFullScreen();this.setProperty("fullScreen",true,true);}var s=(f?"sap-icon://full-screen":"sap-icon://exit-full-screen");this._oFullScreenButton.setIcon(s);this._oFullScreenButton.focus();};
sap.suite.ui.commons.ChartContainer.prototype._openFullScreen=function(){this.$content=this.$();if(this.$content){this.$tempNode=jQuery("<div></div>");this.$content.before(this.$tempNode);this._$overlay=jQuery("<div id='"+jQuery.sap.uid()+"'></div>");this._$overlay.addClass("sapSuiteUiCommonsChartContainerOverlay");this._$overlay.append(this.$content);this._oPopup.setContent(this._$overlay);}else{jQuery.sap.log.warn("Overlay: content does not exist or contains more than one child");}this._oPopup.open(200,null,jQuery("body"));};
sap.suite.ui.commons.ChartContainer.prototype._closeFullScreen=function(){if(this._oScrollEnablement!==null){this._oScrollEnablement.destroy();this._oScrollEnablement=null;}this.$tempNode.replaceWith(this.$content);this._oToolBar.setDesign(sap.m.ToolbarDesign.Auto);this._oPopup.close();this._$overlay.remove();};
sap.suite.ui.commons.ChartContainer.prototype._performHeightChanges=function(){var $,c,t,T,n,e,i;if(this.getAutoAdjustHeight()||this.getFullScreen()){$=this.$();if(($.find('.sapSuiteUiCommonsChartContainerToolBarArea').children()[0])&&($.find('.sapSuiteUiCommonsChartContainerChartArea').children()[0])){c=$.height();t=$.find('.sapSuiteUiCommonsChartContainerToolBarArea').children()[0].clientHeight;T=Math.round(parseFloat($.find('.sapSuiteUiCommonsChartContainerToolBarArea').children().css("border-bottom")));if(isNaN(T)){T=0;}n=c-t-T;e=$.find('.sapSuiteUiCommonsChartContainerChartArea').children()[0].clientHeight;i=this.getSelectedContent().getContent();if((i instanceof sap.viz.ui5.controls.VizFrame)||(sap.chart&&sap.chart.Chart&&i instanceof sap.chart.Chart)){if(n>0&&n!==e){this._rememberOriginalHeight(i);i.setHeight(n+"px");}}else if(i.getDomRef().offsetWidth!==this.getDomRef().clientWidth){this.rerender();}}}};
sap.suite.ui.commons.ChartContainer.prototype._rememberOriginalHeight=function(c){var i,h;i=c.getId();if(jQuery.isFunction(c.getHeight)){h=c.getHeight();}else{h=0;}this._mOriginalVizFrameHeights[i]=h;};
sap.suite.ui.commons.ChartContainer.prototype._onLegendButtonPress=function(){if(this.getSelectedContent()){var s=this.getSelectedContent().getContent();if(jQuery.isFunction(s.getLegendVisible)){var l=s.getLegendVisible();s.setLegendVisible(!l);this.setShowLegend(!l);}else{this.setShowLegend(!this.getShowLegend());}}else{this.setShowLegend(!this.getShowLegend());}};
sap.suite.ui.commons.ChartContainer.prototype._oPersonalizationPress=function(){this.firePersonalizationPress();};
sap.suite.ui.commons.ChartContainer.prototype._switchChart=function(c){var C=this._findChartById(c);this._setSelectedContent(C);this.fireContentChange({selectedItemId:c});this.rerender();};
sap.suite.ui.commons.ChartContainer.prototype._chartChange=function(){var c=this.getContent();this._destroyButtons(this._aChartIcons);this._aChartIcons=[];if(this.getContent().length===0){this._oChartSegmentedButton.removeAllButtons();this._setDefaultOnSegmentedButton();this.switchChart(null);}if(c){for(var i=0;i<c.length;i++){var a=c[i].getContent();if(!c[i].getVisible()){continue;}if(a.setVizProperties){a.setVizProperties({legend:{visible:this.getShowLegend()},sizeLegend:{visible:this.getShowLegend()}});}if(a.setWidth){a.setWidth("100%");}if(jQuery.isFunction(a.setHeight)&&this._mOriginalVizFrameHeights[a.getId()]){a.setHeight(this._mOriginalVizFrameHeights[a.getId()]);}var b=new sap.m.Button({icon:c[i].getIcon(),type:sap.m.ButtonType.Transparent,width:"3rem",tooltip:c[i].getTitle(),customData:[new sap.ui.core.CustomData({key:'chartId',value:a.getId()})],press:jQuery.proxy(function(e){var C=e.getSource().getCustomData()[0].getValue();this._switchChart(C);},this)});this._aChartIcons.push(b);if(i===0){this._setSelectedContent(c[i]);this._oActiveChartButton=b;}}}this._chartContentChange=false;};
sap.suite.ui.commons.ChartContainer.prototype._setSelectedContent=function(o){if(o===null){this._oShowLegendButton.setVisible(false);return;}var c=o.getContent();var C=c.getId();var r=null;for(var i=0;!r&&i<this._aChartIcons.length;i++){if(this._aChartIcons[i].getCustomData()[0].getValue()===C&&c.getVisible()===true){r=this._aChartIcons[i];this._oChartSegmentedButton.setSelectedButton(r);break;}}var s=(c instanceof sap.viz.ui5.controls.VizFrame)||(jQuery.isFunction(c.setLegendVisible));if(this.getShowLegendButton()){this._oShowLegendButton.setVisible(s);}var S=(this.getShowZoom())&&(sap.ui.Device.system.desktop)&&(c instanceof sap.viz.ui5.controls.VizFrame);this._oZoomInButton.setVisible(S);this._oZoomOutButton.setVisible(S);this._oSelectedContent=o;};
sap.suite.ui.commons.ChartContainer.prototype._findChartById=function(a){var o=this.getAggregation("content");if(o){for(var i=0;i<o.length;i++){if(o[i].getContent().getId()===a){return o[i];}}}return null;};
sap.suite.ui.commons.ChartContainer.prototype._adjustIconsDisplay=function(){for(var i=0;i<this._customIconsAll.length;i++){this._oToolBar.addContent(this._customIconsAll[i]);}if(!this._firstTime){this._oChartSegmentedButton.removeAllButtons();}var l=this._aChartIcons.length;if(l>1){for(var i=0;i<l;i++){this._oChartSegmentedButton.addButton(this._aChartIcons[i]);}this._oToolBar.addContent(this._oChartSegmentedButton);}if(this.getShowLegendButton()){this._oToolBar.addContent(this._oShowLegendButton);}if(this.getShowPersonalization()){this._oToolBar.addContent(this._oPersonalizationButton);}if(this.getShowZoom()&&(sap.ui.Device.system.desktop)){this._oToolBar.addContent(this._oZoomInButton);this._oToolBar.addContent(this._oZoomOutButton);}if(this.getShowFullScreen()){this._oToolBar.addContent(this._oFullScreenButton);}};
sap.suite.ui.commons.ChartContainer.prototype._setDefaultOnSegmentedButton=function(){if(!this._bSegmentedButtonSaveSelectState){this._oChartSegmentedButton.setSelectedButton(null);}this._bSegmentedButtonSaveSelectState=false;};
sap.suite.ui.commons.ChartContainer.prototype._adjustSelectorDisplay=function(){var d=this.getDimensionSelectors();if(d.length===0){this._oChartTitle.setVisible(true);this._oToolBar.addContent(this._oChartTitle);return;}for(var i=0;i<d.length;i++){if(jQuery.isFunction(d[i].setAutoAdjustWidth)){d[i].setAutoAdjustWidth(true);}this._oToolBar.insertContent(d[i],i);}};
sap.suite.ui.commons.ChartContainer.prototype._adjustDisplay=function(){this._oToolBar.removeAllContent();this._adjustSelectorDisplay();this._oToolBar.addContent(new sap.m.ToolbarSpacer());this._adjustIconsDisplay();};
sap.suite.ui.commons.ChartContainer.prototype._handleMediaChange=function(e){this._currentRangeName=sap.ui.Device.media.getCurrentRange(sap.ui.Device.media.RANGESETS.SAP_STANDARD).name;this._adjustDisplay();};
sap.suite.ui.commons.ChartContainer.prototype._zoom=function(z){var c=this.getSelectedContent().getContent();if(c instanceof sap.viz.ui5.controls.VizFrame){if(z){c.zoom({"direction":"in"});}else{c.zoom({"direction":"out"});}}if(z){this.fireCustomZoomInPress();}else{this.fireCustomZoomOutPress();}};
sap.suite.ui.commons.ChartContainer.prototype._destroyButtons=function(b){b.forEach(function(B){B.destroy();});};