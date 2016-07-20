/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2014-2016 SAP SE. All rights reserved
 */
sap.ui.define(["sap/ui/fl/Change","sap/ui/fl/DefaultVariant","sap/ui/fl/Utils","jquery.sap.global","sap/ui/fl/LrepConnector","sap/ui/fl/Cache"],function(C,d,U,$,L,a){"use strict";var P=function(c,s){this._oControl=c;this._bHasLoadedChangesFromBackend=false;this._sStableIdPropertyName=s||'id';this._sStableId=this._getStableId();this._sComponentName=U.getComponentClassName(c);if(!this._sComponentName){U.log.error("The Control does not belong to a SAPUI5 component. Variants and Changes for this control might not work as expected.");}this._oAppDescriptor=U.getAppDescriptor(c);this._sSiteId=U.getSiteId(c);this._oChanges={};this._oMessagebundle={};this._oConnector=this._createLrepConnector();};P.prototype.getComponentName=function(){return this._sComponentName;};P.prototype.setComponentName=function(c){this._sComponentName=c;};P.prototype._createLrepConnector=function(){var x,p;x=U.getXSRFTokenFromControl(this._oControl);p={XsrfToken:x};return L.createConnector(p);};P.prototype._getStableId=function(){if(!this._oControl){return undefined;}if((this._sStableIdPropertyName)&&(this._sStableIdPropertyName!=='id')){var s;try{s=this._oControl.getProperty(this._sStableIdPropertyName);}catch(e){s="";}return s;}if(typeof this._oControl.getId!=='function'){return undefined;}return this._oControl.getId();};P.prototype._existVendorLayerChange=function(){var e=false;jQuery.each(this._oChanges,function(c,o){var O=o._oOriginDefinition;if(O.layer==="VENDOR"){e=true;return false;}});return e;};P.prototype._getOwnerComponentOfControl=function(c){if(!c){return undefined;}var o=sap.ui.core.Component.getOwnerIdFor(c);if(o){var O=sap.ui.component(o);return O;}return this._getOwnerComponentOfControl(c.getParent());};P.prototype._checkForMessagebundleBinding=function(){if(this._existVendorLayerChange()){var o=this._getOwnerComponentOfControl(this._oControl);if(o&&!o.getModel("i18nFlexVendor")){var m=new sap.ui.model.json.JSONModel(this._oMessagebundle);o.setModel(m,"i18nFlexVendor");}}};P.prototype.getChanges=function(){var t=this;var c=this._sComponentName;var p={appDescriptor:this._oAppDescriptor,siteId:this._sSiteId};if(this._bHasLoadedChangesFromBackend===true){if(this._oMessagebundle){this._checkForMessagebundleBinding();}return Promise.resolve(this._oChanges);}return a.getChangesFillingCache(this._oConnector,c,p).then(t._resolveFillingCacheWithChanges.bind(t));};P.prototype._resolveFillingCacheWithChanges=function(f){this._fillRelevantChanges(f);if(f&&f.changes&&f.changes.messagebundle){this._oMessagebundle=f.changes.messagebundle;this._checkForMessagebundleBinding();}this._bHasLoadedChangesFromBackend=true;return this._oChanges;};P.prototype.getComponentChanges=function(){var t=this;var p={appDescriptor:this._oAppDescriptor,siteId:this._sSiteId};return a.getChangesFillingCache(this._oConnector,this._sComponentName,p).then(function(f){var n=true;t._fillRelevantChanges(f,n);return t._oChanges;});};P.prototype._fillRelevantChanges=function(f,n){var c,l,o,s,b,j,e;var t=this;var g=function(k,h){U.log.error("key : "+k+" and text : "+h.value);};var A=function(i,v){if(n===true&&o.fileType==='change'||t._sStableId===v){b=new C(o);b.attachEvent(C.events.markForDeletion,t._onDeleteChange.bind(t));e=b.getId();if(b.isValid()){if(t._oChanges[e]&&b.isVariant()){U.log.error("Id collision - two or more variant files having the same id detected: "+e);jQuery.each(b.getDefinition().texts,g);U.log.error("already exists in variant : ");jQuery.each(t._oChanges[e].getDefinition().texts,g);}t._oChanges[e]=b;}return false;}};if(f&&f.changes&&f.changes.changes){c=f.changes.changes;l=c.length;for(j=0;j<l;j++){o=c[j];s=o.selector;if(s){jQuery.each(s,A);}}}};P.prototype.getChange=function(c){if(!c){U.log.error("sap.ui.fl.Persistence.getChange : sChangeId is not defined");return undefined;}return this._oChanges[c];};P.prototype.addChange=function(p){var f,i,I,c;if(!p){return undefined;}if(!p.type){U.log.error("sap.ui.fl.Persistence.addChange : type is not defined");}if(!p.ODataService){U.log.error("sap.ui.fl.Persistence.addChange : ODataService is not defined");}var s=jQuery.type(p.content);if(s!=='object'&&s!=='array'){U.log.error("mParameters.content is not of expected type object or array, but is: "+s,"sap.ui.fl.Persistence#addChange");}I={};if(typeof(p.texts)==="object"){jQuery.each(p.texts,function(e,t){I[e]={value:t,type:"XFLD"};});}var A=U.getAppDescriptor(this._oControl);var b=this._sComponentName;if(A&&A["sap.app"]){b=A["sap.app"].componentName||A["sap.app"].id;}i={changeType:p.type,service:p.ODataService,texts:I,content:p.content,reference:this._sComponentName,componentName:b,isVariant:p.isVariant,packageName:p.packageName,isUserDependent:p.isUserDependent};i.selector=this._getSelector();f=C.createInitialFileContent(i);if(p.id){f.fileName=p.id;}c=this.addChangeFile(f);return c.getId();};P.prototype.addChangeFile=function(c){var o,s;o=new C(c);o.attachEvent(C.events.markForDeletion,this._onDeleteChange.bind(this));s=o.getId();this._oChanges[s]=o;return o;};P.prototype.removeChangeFromPersistence=function(c){if(c.getPendingAction()!=='NEW'){return;}var s=c.getId();delete this._oChanges[s];};P.prototype.putChange=function(c){c.attachEvent(C.events.markForDeletion,this._onDeleteChange.bind(this));var s=c.getId();this._oChanges[s]=c;};P.prototype._getSelector=function(){var s;s={};if(this._sStableIdPropertyName){s[this._sStableIdPropertyName]=this._sStableId;}return s;};P.prototype.getDefaultVariantId=function(){return this.getChanges().then(function(c){return d.getDefaultVariantId(c);});};P.prototype.getDefaultVariantIdSync=function(){return d.getDefaultVariantId(this._oChanges);};P.prototype.setDefaultVariantIdSync=function(D){var p,c;var s={};s[this._sStableIdPropertyName]=this._sStableId;p={defaultVariantId:D,reference:this._sComponentName,selector:s};c=d.updateDefaultVariantId(this._oChanges,D);if(c){return c;}c=d.createChangeObject(p);c.attachEvent(C.events.markForDeletion,this._onDeleteChange.bind(this));var b=c.getId();this._oChanges[b]=c;return c;};P.prototype.setDefaultVariantId=function(D){var p,c;var t=this;return this.getChanges().then(function(o){var s={};s[t._sStableIdPropertyName]=t._sStableId;p={defaultVariantId:D,reference:t._sComponentName,selector:s};c=d.updateDefaultVariantId(o,D);if(c){return c;}c=d.createChangeObject(p);c.attachEvent(C.events.markForDeletion,t._onDeleteChange.bind(t));o[c.getId()]=c;return c;});};P.prototype.saveAll=function(){var p=[];var t=this;jQuery.each(this._oChanges,function(i,c){switch(c.getPendingAction()){case"NEW":p.push(t._oConnector.create(c.getDefinition(),c.getRequest(),c.isVariant()).then(function(r){c.setResponse(r.response);if(a.isActive()){a.addChange(c.getComponent(),r.response);}return r;}));break;case"UPDATE":p.push(t._oConnector.update(c.getDefinition(),c.getId(),c.getRequest(),c.isVariant()).then(function(r){c.setResponse(r.response);if(a.isActive()){a.updateChange(c.getComponent(),r.response);}return r;}));break;case"DELETE":p.push(t._oConnector.deleteChange({sChangeName:c.getId(),sLayer:c.getLayer(),sNamespace:c.getNamespace(),sChangelist:c.getRequest()},c.isVariant()).then(function(r){var s=c.getId();var m={id:s};c.fireEvent(C.events.markForDeletion,m);if(a.isActive()){a.deleteChange(c.getComponent(),c.getDefinition());}return r;}));break;default:break;}});return Promise.all(p);};P.prototype._onDeleteChange=function(e){var c;c=e.getParameter("id");var o=this.getChange(c);if(o.getPendingAction()==="DELETE"){delete this._oChanges[c];}};P.prototype.isVariantDownport=function(){var l,i;l=U.getCurrentLayer();i=U.isHotfixMode();return((l==='VENDOR')&&(i));};return P;},true);