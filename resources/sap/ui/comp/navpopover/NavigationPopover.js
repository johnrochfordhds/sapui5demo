/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2016 SAP SE. All rights reserved
 */
sap.ui.define(['jquery.sap.global','sap/m/CustomListItem','sap/m/Link','sap/m/Popover','sap/ui/core/Title','sap/ui/layout/form/SimpleForm','sap/m/VBox','sap/m/PopoverRenderer'],function(q,C,L,P,T,S,V,a){"use strict";var N=P.extend("sap.ui.comp.navpopover.NavigationPopover",{metadata:{library:"sap.ui.comp",properties:{title:{type:"string",group:"Misc",defaultValue:null},semanticObjectName:{type:"string",group:"Misc",defaultValue:null},semanticAttributes:{type:"object",group:"Misc",defaultValue:null},appStateKey:{type:"string",group:"Misc",defaultValue:null},mainNavigationId:{type:"string",group:"Misc",defaultValue:null}},aggregations:{availableActions:{type:"sap.ui.comp.navpopover.LinkData",multiple:true,singularName:"availableAction"},mainNavigation:{type:"sap.ui.comp.navpopover.LinkData",multiple:false},ownNavigation:{type:"sap.ui.comp.navpopover.LinkData",multiple:false}},associations:{source:{type:"sap.ui.core.Control",multiple:false},extraContent:{type:"sap.ui.core.Control",multiple:false},component:{type:"sap.ui.core.Element",multiple:false}},events:{targetsObtained:{},navigate:{}}},renderer:a.render});N.prototype.init=function(){P.prototype.init.call(this);this.addStyleClass("navigationPopover");this.setContentWidth("380px");this.setHorizontalScrolling(false);this.setPlacement(sap.m.PlacementType.Auto);this._oHeaderForm=new S({maxContainerCols:1,visible:true});this._oMainNavigationText=new T();this._oMainNavigationLink=new L();this._oMainNavigationLink.attachPress(q.proxy(this._onLinkPress,this));this._oHeaderForm.addContent(this._oMainNavigationText);this._oHeaderForm.addContent(this._oMainNavigationLink);this._oForm=new S({maxContainerCols:1,visible:false});this._oNavigationLinkContainer=new V();this._oForm.addContent(new T({text:sap.ui.getCore().getLibraryResourceBundle("sap.ui.comp").getText("POPOVER_LINKLIST_TEXT")}));this._oForm.addContent(this._oNavigationLinkContainer);this.addContent(this._oHeaderForm);this.addContent(this._oForm);};N.prototype.addAvailableAction=function(l){this.addAggregation("availableActions",l);};N.prototype._getSemanticObjectValue=function(){var s=this.getSemanticAttributes();if(s){var b=this.getSemanticObjectName();return s[b];}return null;};N.prototype._createLinks=function(){var i;var l;var v;var h;var o;var c=this._getComponent();var x=this._getNavigationService();this._oNavigationLinkContainer.removeAllItems();v=this.getMainNavigationId();if(!v){var s=this._getSourceControl();if(s){if(s.getSemanticObjectValue){v=s.getSemanticObjectValue();}else{v=this._getSemanticObjectValue();}}}this._oMainNavigationText.setText(v);var m=this.getMainNavigation();if(m){h=m.getHref();if(h){this._oHeaderForm.removeStyleClass("navpopoversmallheader");this._oMainNavigationLink.setText(m.getText());if(x){h=x.hrefForExternal({target:{shellHash:h}},c);}this._oMainNavigationLink.setHref(h);this._oMainNavigationLink.setTarget(m.getTarget());this._oMainNavigationLink.setVisible(true);}else{this._oHeaderForm.addStyleClass("navpopoversmallheader");this._oMainNavigationLink.setText("");this._oMainNavigationLink.setVisible(false);}}var A=this.getAvailableActions();if(A){for(i=0;i<A.length;i++){l=new L();o=A[i];if(o){l.setText(o.getText());l.attachPress(q.proxy(this._onLinkPress,this));h=o.getHref();if(x&&h){h=x.hrefForExternal({target:{shellHash:h}},c);}l.setHref(h);l.setTarget(o.getTarget());}this._oNavigationLinkContainer.addItem(l);}}this._setListVisibility();};N.prototype.insertAvailableAction=function(l,i){this.insertAggregation("availableActions",l,i);};N.prototype.removeAvailableAction=function(l){var i;if(typeof(l)==="number"){i=l;}else{i=this.getAvailableActions().indexOf(l);}if(i>=0){this._oNavigationLinkContainer.removeItem(i);}var r=this.removeAggregation("availableActions",l);this._setListVisibility();return r;};N.prototype.removeAllAvailableActions=function(){this._oNavigationLinkContainer.removeAllItems();this.removeAllAggregation("availableActions");this._setListVisibility();};N.prototype._setListVisibility=function(){var A=this.getAvailableActions().length;this._oForm.setVisible(A>0);};N.prototype._onLinkPress=function(e){var s=e.getSource();this.fireNavigate({text:s.getText(),href:s.getHref()});};N.prototype.setSemanticObjectName=function(s){this.setProperty("semanticObjectName",s);this.removeAllAvailableActions();this.setMainNavigation(null);};N.prototype._getNavigationService=function(){return sap.ushell&&sap.ushell.Container&&sap.ushell.Container.getService("CrossApplicationNavigation");};N.prototype._getUrlService=function(){return sap.ushell&&sap.ushell.Container&&sap.ushell.Container.getService("URLParsing");};N.prototype.retrieveNavTargets=function(){var s=this.getSemanticObjectName();var m=this.getSemanticAttributes();var A=this.getAppStateKey();this._retrieveNavTargets(s,m,A);};N.prototype._retrieveNavTargets=function(s,m,A){var t=this;this.setMainNavigation(null);this.removeAllAvailableActions();var x=this._getNavigationService();if(!x){q.sap.log.error("Service 'CrossApplicationNavigation' could not be obtained");this.fireTargetsObtained();return;}var I=false;var c=this._getComponent();var p=x.getSemanticObjectLinks(s,m,I,c,A);p.fail(q.proxy(function(){q.sap.log.error("'getSemanticObjectLinks' failed");},this));p.done(q.proxy(function(l){var i,b,d;var u,o;var e;var h=false;if(l&&l.length){u=t._getUrlService();var f=x.hrefForExternal();if(f&&f.indexOf("?")!==-1){f=f.split("?")[0];}for(i=0;i<l.length;i++){b=l[i].intent;d=l[i].text;e=new sap.ui.comp.navpopover.LinkData({text:d,href:b});if(b.indexOf(f)===0){this.setOwnNavigation(e);continue;}o=u.parseShellHash(b);if(o.action&&(o.action==='displayFactSheet')&&!h){e.setText(sap.ui.getCore().getLibraryResourceBundle("sap.ui.comp").getText("POPOVER_FACTSHEET"));t.setMainNavigation(e);h=true;}else{t.addAvailableAction(e);}}}t.fireTargetsObtained();},this));};N.prototype._getComponent=function(){var c=this.getComponent();if(typeof c==="string"){c=sap.ui.getCore().getComponent(c);}return c;};N.prototype.show=function(){var s=this._getSourceControl();if(!s){q.sap.log.error("no source assigned");return;}var m=this.getMainNavigation();var A=this.getAvailableActions();if(!(m&&(m.getHref()))&&!(A&&(A.length>0))){q.sap.log.error("no navigation targets found");if(!this.getExtraContent()){q.sap.log.error("NavigationPopover is empty");q.sap.require("sap.m.MessageBox");var M=sap.ui.require("sap/m/MessageBox");M.show(sap.ui.getCore().getLibraryResourceBundle("sap.ui.comp").getText("POPOVER_DETAILS_NAV_NOT_POSSIBLE"),{icon:M.Icon.ERROR,title:sap.ui.getCore().getLibraryResourceBundle("sap.ui.comp").getText("POPOVER_MSG_NAV_NOT_POSSIBLE"),styleClass:(this.$()&&this.$().closest(".sapUiSizeCompact").length)?"sapUiSizeCompact":""});return;}}this._createLinks();this.openBy(s);};N.prototype._getSourceControl=function(){var s=null;var c=this.getSource();if(c){s=sap.ui.getCore().byId(c);}return s;};N.prototype.setExtraContent=function(c){var o=this.getExtraContent();if(o&&c&&o===c.getId()){return;}if(o){var O=sap.ui.getCore().byId(o);this.removeContent(O);}this.setAssociation("extraContent",c);if(c){this.insertContent(c,1);}};return N;},true);
