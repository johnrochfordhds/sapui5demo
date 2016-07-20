/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2014-2016 SAP SE. All rights reserved
 */
sap.ui.define(["jquery.sap.global","sap/ui/fl/changeHandler/Base","sap/ui/fl/Utils"],function(q,B,F){"use strict";var P=function(){};P.prototype=q.sap.newObject(B.prototype);P.prototype.applyChange=function(c,C){try{var d=c.getDefinition();var p=d.content.property;var a=C.getMetadata().getAllProperties()[p];var b=a._sMutator;C[b](d.content.newValue);}catch(e){throw new Error("Applying property changes failed: "+e);}};P.prototype.completeChangeContent=function(c,s){var C=c.getDefinition();if(s.content){C.content=s.content;}else{throw new Error("oSpecificChangeInfo attribute required");}};return P;},true);
