/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2016 SAP SE. All rights reserved
 */
sap.ui.define(['sap/ui/fl/Utils','jquery.sap.global','sap/ui/fl/changeHandler/Base'],function(U,q,B){"use strict";var R=function(){};R.prototype=q.sap.newObject(B.prototype);R.prototype.applyChange=function(c,g){var C=c.getDefinition();if(C.texts&&C.texts.groupLabel&&this._isProvided(C.texts.groupLabel.value)){if(g&&g.setLabel){g.unbindProperty("label");g.setLabel(C.texts.groupLabel.value);}else{throw new Error("no Group provided for renaming");}}else{U.log.error("Change does not contain sufficient information to be applied: ["+C.layer+"]"+C.namespace+"/"+C.fileName+"."+C.fileType);}};R.prototype.completeChangeContent=function(c,s){var C=c.getDefinition();if(this._isProvided(s.groupLabel)){this.setTextInChange(C,"groupLabel",s.groupLabel,"XFLD");}else{throw new Error("oSpecificChangeInfo.groupLabel attribute required");}};R.prototype._isProvided=function(s){return typeof(s)==="string";};return R;},true);
