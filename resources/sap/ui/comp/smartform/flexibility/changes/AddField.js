/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2016 SAP SE. All rights reserved
 */
sap.ui.define(['jquery.sap.global','sap/ui/fl/Utils','sap/ui/fl/changeHandler/Base'],function(q,U,B){"use strict";var A=function(){};A.prototype=q.sap.newObject(B.prototype);A.prototype.applyChange=function(c,g){var C=c.getDefinition();if(C.texts&&C.texts.fieldLabel&&C.texts.fieldLabel.value&&C.content&&C.content.field&&C.content.field.id&&C.content.field.jsType&&C.content.field.value&&C.content.field.valueProperty){q.sap.require("sap.ui.comp.smartform.GroupElement");var G=new sap.ui.comp.smartform.GroupElement(C.content.field.id);if(G.setLabel){G.setLabel(C.texts.fieldLabel.value);}var V=this._getControlClass(C.content.field.jsType);var v=new V();if(v){if(C.content.field.entitySet&&v.setEntitySet){v.setEntitySet(C.content.field.entitySet);}G.addElement(v);v.bindProperty(C.content.field.valueProperty,C.content.field.value);}if(g&&g.insertGroupElement){g.insertGroupElement(G,C.content.field.index);}else{throw new Error("no parent group provided for adding the field");}}else{U.log.error("Change does not contain sufficient information to be applied: ["+C.layer+"]"+C.namespace+"/"+C.fileName+"."+C.fileType);}};A.prototype.completeChangeContent=function(c,s){var C=c.getDefinition();if(s.fieldLabel){this.setTextInChange(C,"fieldLabel",s.fieldLabel,"XFLD");}else{throw new Error("oSpecificChangeInfo.fieldLabel attribute required");}if(!C.content){C.content={};}if(!C.content.field){C.content.field={};}if(s.fieldValue){C.content.field.value=s.fieldValue;}else{throw new Error("oSpecificChangeInfo.fieldValue attribute required");}if(s.valueProperty){C.content.field.valueProperty=s.valueProperty;}else{throw new Error("oSpecificChangeInfo.valueProperty attribute required");}if(s.newControlId){C.content.field.id=s.newControlId;}else{throw new Error("oSpecificChangeInfo.newControlId attribute required");}if(s.jsType){C.content.field.jsType=s.jsType;}else{throw new Error("oSpecificChangeInfo.jsType attribute required");}if(s.index===undefined){throw new Error("oSpecificChangeInfo.index attribute required");}else{C.content.field.index=s.index;}if(s.entitySet){C.content.field.entitySet=s.entitySet;}};A.prototype._getControlClass=function(j){var r;q.sap.require(j);var s=j.split(".");var J=window;q.each(s,function(i,S){J=J[S];});if(typeof(J)=="function"){r=J;}return r;};A.prototype.getControlIdFromChangeContent=function(c){var C;if(c&&c._oDefinition){C=c._oDefinition.content.field.id;}return C;};return A;},true);
