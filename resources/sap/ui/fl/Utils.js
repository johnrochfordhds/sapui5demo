/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2014-2016 SAP SE. All rights reserved
 */
sap.ui.define(["jquery.sap.global","sap/ui/core/Component"],function(q,C){"use strict";var U={log:{error:function(m,d,c){q.sap.log.error(m,d,c);},warning:function(m,d,c){q.sap.log.warning(m,d,c);}},getXSRFTokenFromControl:function(c){var m;if(!c){return"";}if(c&&typeof c.getModel==="function"){m=c.getModel();return U._getXSRFTokenFromModel(m);}return"";},_getXSRFTokenFromModel:function(m){var h;if(!m){return"";}if(typeof m.getHeaders==="function"){h=m.getHeaders();if(h){return h["x-csrf-token"];}}return"";},getComponentClassName:function(c){var o=null,v=null;if(c){o=this._getAppComponentForControl(c);if(o){v=this._getComponentStartUpParameter(o,"sap-app-id");if(v){return v;}}}return U._getComponentName(o);},getAppDescriptor:function(c){var m=null,o=null,a=null;if(c){o=this._getAppComponentForControl(c);if(o&&o.getMetadata){a=o.getMetadata();if(a&&a.getManifest){m=a.getManifest();}}}return m;},getSiteId:function(c){var s=null,o=null;if(c){o=this._getAppComponentForControl(c);if(o){s=this._getComponentStartUpParameter(o,"hcpApplicationId");}}return s;},isAppVariantMode:function(c){return(U.isVendorLayer()&&U.isApplicationVariant(c));},isVendorLayer:function(){if(U.getCurrentLayer(false)==="VENDOR"){return true;}return false;},isApplicationVariant:function(c){var i=false,o=null,v=null;if(c){o=this._getAppComponentForControl(c);if(o){v=this._getComponentStartUpParameter(o,"sap-app-id");if(v){i=true;}}}return i;},_getComponentStartUpParameter:function(c,p){var s=null,o=null;if(p){if(c&&c.getComponentData){o=c.getComponentData();if(o&&o.startupParameters){if(q.isArray(o.startupParameters[p])){s=o.startupParameters[p][0];}}}}return s;},_getComponentName:function(c){var s="";if(c){s=c.getMetadata().getName();}if(s.length>0&&s.indexOf(".Component")<0){s+=".Component";}return s;},_getComponent:function(c){var o;if(c){o=sap.ui.getCore().getComponent(c);}return o;},_getComponentIdForControl:function(c){var s="",i=0;do{i++;s=U._getOwnerIdForControl(c);if(s){return s;}if(c&&typeof c.getParent==="function"){c=c.getParent();}else{return"";}}while(c&&i<100);return"";},getComponentForControl:function(c){return U._getComponentForControl(c);},_getAppComponentForControl:function(c){var o=null;var s=null;o=this._getComponentForControl(c);if(o&&o.getAppComponent){return o.getAppComponent();}if(o&&o.getManifestEntry){s=o.getManifestEntry("sap.app");}else{return o;}if(s&&s.type&&s.type!=="application"){return this._getAppComponentForControl(o);}return o;},_getComponentForControl:function(c){var o=null;var s=null;if(c){s=U._getComponentIdForControl(c);if(s){o=U._getComponent(s);}}return o;},getViewForControl:function(c){return U.getFirstAncestorOfControlWithControlType(c,sap.ui.core.mvc.View);},getFirstAncestorOfControlWithControlType:function(c,a){if(c instanceof a){return c;}if(c&&typeof c.getParent==="function"){c=c.getParent();return U.getFirstAncestorOfControlWithControlType(c,a);}},hasControlAncestorWithId:function(c,a){var o;if(c===a){return true;}o=sap.ui.getCore().byId(c);while(o){if(o.getId()===a){return true;}if(typeof o.getParent==="function"){o=o.getParent();}else{return false;}}return false;},_isView:function(c){return c instanceof sap.ui.core.mvc.View;},_getOwnerIdForControl:function(c){return C.getOwnerIdFor(c);},getCurrentLayer:function(i){var u,l;if(i){return"USER";}u=this._getUriParameters();l=u.mParams["sap-ui-layer"];if(l&&l.length>0){return l[0];}return"CUSTOMER";},doesSharedVariantRequirePackage:function(){var c;c=U.getCurrentLayer(false);if((c==="VENDOR")||(c==="PARTNER")){return true;}if(c==="USER"){return false;}if(c==="CUSTOMER"){return false;}return false;},getClient:function(){var u,c;u=this._getUriParameters();c=u.mParams["sap-client"];if(c&&c.length>0){return c[0];}return undefined;},_getUriParameters:function(){return q.sap.getUriParameters();},isHotfixMode:function(){var u,i,I;u=this._getUriParameters();i=u.mParams["hotfix"];if(i&&i.length>0){I=i[0];}return(I==="true");},convertBrowserLanguageToISO639_1:function(b){if(!b||typeof b!=="string"){return"";}var n=b.indexOf("-");if((n<0)&&(b.length<=2)){return b.toUpperCase();}if(n>0&&n<=2){return b.substring(0,n).toUpperCase();}return"";},getCurrentLanguage:function(){var l=sap.ui.getCore().getConfiguration().getLanguage();return U.convertBrowserLanguageToISO639_1(l);},getControlType:function(c){var m;if(c&&typeof c.getMetadata==="function"){m=c.getMetadata();if(m&&typeof m.getElementName==="function"){return m.getElementName();}}},asciiToString:function(a){var b=a.split(",");var p="";q.each(b,function(i,c){p+=String.fromCharCode(c);});return p;},stringToAscii:function(s){var a="";for(var i=0;i<s.length;i++){a+=s.charCodeAt(i)+",";}a=a.substring(0,a.length-1);return a;},checkControlId:function(c){var i=sap.ui.base.ManagedObjectMetadata.isGeneratedId(c.getId());if(i===true){q.sap.log.error("Generated id attribute found","to offer flexibility a stable control id is needed to assign the changes to, but for this control the id was generated by SAPUI5",c.getId());}return!i;},_getAllUrlParameters:function(){return window.location.search.substring(1);},getUrlParameter:function(p){return q.sap.getUriParameters().get(p);}};return U;},true);
