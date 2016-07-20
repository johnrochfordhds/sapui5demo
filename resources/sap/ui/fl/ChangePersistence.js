/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2014-2016 SAP SE. All rights reserved
 */
sap.ui.define(["sap/ui/fl/Change","sap/ui/fl/Utils","jquery.sap.global","sap/ui/fl/LrepConnector","sap/ui/fl/Cache"],function(C,U,$,L,a){"use strict";var b=function(c,l){this._sComponentName=c;if(!this._sComponentName){U.log.error("The Control does not belong to a SAPUI5 component. Personalization and changes for this control might not work as expected.");throw new Error("Missing component name.");}this._oConnector=l||this._createLrepConnector();this._aDirtyChanges=[];};b.prototype.getComponentName=function(){return this._sComponentName;};b.prototype._createLrepConnector=function(){return L.createConnector();};b.prototype.getChangesForComponent=function(p){return a.getChangesFillingCache(this._oConnector,this._sComponentName,p).then(function(w){this._bHasLoadedChangesFromBackend=true;if(!w.changes||!w.changes.changes){return[];}var e=w.changes.changes;return e.filter(d).map(c);}.bind(this));function c(o){return new C(o);}function d(o){if(o.fileType!=='change'){return false;}if(o.changeType==='defaultVariant'){return false;}if(!o.selector||!o.selector.id){return false;}return true;}};b.prototype.getChangesForView=function(v,p){return this.getChangesForComponent(p).then(function(d){return d.filter(c);});function c(o){var s=o.getSelector().id;var S=s.slice(0,s.lastIndexOf('--'));return S===v;}};b.prototype.addChange=function(c){var n;if(c instanceof C){n=c;}else{n=new C(c);}this._aDirtyChanges.push(n);return n;};b.prototype.saveDirtyChanges=function(){var d=this._aDirtyChanges.slice(0);var D=this._aDirtyChanges;var r=this._getRequests(d);var p=this._getPendingActions(d);if(p.length===1&&r.length===1&&p[0]==='NEW'){var R=r[0];var P=this._prepareDirtyChanges(D);return this._oConnector.create(P,R).then(this._massUpdateCacheAndDirtyState(D,d));}else{return d.reduce(function(s,o){var c=s.then(this._performSingleSaveAction(o).bind(this));c.then(this._updateCacheAndDirtyState(D,o));return c;}.bind(this),Promise.resolve());}};b.prototype._performSingleSaveAction=function(d){return function(){if(d.getPendingAction()==='NEW'){return this._oConnector.create(d.getDefinition(),d.getRequest());}if(d.getPendingAction()==='DELETE'){return this._oConnector.deleteChange({sChangeName:d.getId(),sLayer:d.getLayer(),sNamespace:d.getNamespace(),sChangelist:d.getRequest()});}};};b.prototype._updateCacheAndDirtyState=function(d,D){var t=this;return function(){if(D.getPendingAction()==='NEW'){a.addChange(t._sComponentName,D.getDefinition());}if(D.getPendingAction()==='DELETE'){a.deleteChange(t._sComponentName,D.getDefinition());}var i=d.indexOf(D);if(i>-1){d.splice(i,1);}};};b.prototype._massUpdateCacheAndDirtyState=function(d,D){var t=this;jQuery.each(D,function(i,o){t._updateCacheAndDirtyState(d,o)();});};b.prototype._getRequests=function(d){var r=[];jQuery.each(d,function(i,c){var R=c.getRequest();if(r.indexOf(R)===-1){r.push(R);}});return r;};b.prototype._getPendingActions=function(d){var p=[];jQuery.each(d,function(i,c){var P=c.getPendingAction();if(p.indexOf(P)===-1){p.push(P);}});return p;};b.prototype._prepareDirtyChanges=function(d){var c=[];jQuery.each(d,function(i,o){c.push(o.getDefinition());});return c;};b.prototype.getDirtyChanges=function(){return this._aDirtyChanges;};b.prototype.deleteChange=function(c){var i=this._aDirtyChanges.indexOf(c);if(i>-1){if(c.getPendingAction()==='DELETE'){return;}this._aDirtyChanges.splice(i,1);return;}c.markForDeletion();this._aDirtyChanges.push(c);};return b;},true);