/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2016 SAP SE. All rights reserved
 */
sap.ui.define(['jquery.sap.global','sap/ui/fl/changeHandler/Base','sap/ui/fl/Utils'],function(q,B,F){"use strict";var M=function(){};M.prototype=q.sap.newObject(B.prototype);M.prototype.applyChange=function(c,g){if(!c){throw new Error("No change instance");}var C=c.getDefinition();if(!C.selector||!C.content||!C.content.moveFields||C.content.moveFields.length===0||Object.keys(C.selector).length!==1){throw new Error("Change format invalid");}if(!g||!g.getGroupElements||!g.getId){throw new Error("No smart form group instance supplied");}var t=g;var T=false;if(C.content.targetId){var s=g.getId();if(s!==C.content.targetId){t=sap.ui.getCore().byId(C.content.targetId);T=true;}}var f=g.getGroupElements();if(!f){return;}var a=f.length;var o={},m={};var b=C.content.moveFields.length;var I,i,j;for(i=0;i<b;i++){m=C.content.moveFields[i];if(!m.id){throw new Error("Change format invalid - moveFields element has no id attribute");}if(typeof(m.index)!=="number"){throw new Error("Change format invalid - moveFields element index attribute is no number");}I=-1;for(j=0;j<a;j++){var d=f[j].getId();if(d===m.id){I=j;break;}}if(T===false&&I===m.index){continue;}if(I===-1){continue;}o=f[I];if(T===true){g.removeGroupElement(o);t.insertGroupElement(o,m.index);continue;}f.splice(I,1);if(T===false){f.splice(m.index,0,o);}}if(T===true){return;}g.removeAllGroupElements();for(i=0;i<a;i++){g.insertGroupElement(f[i],i);}};M.prototype.completeChangeContent=function(c,s){var C=c.getDefinition();if(s.moveFields){var m={};var i,l=s.moveFields.length;if(l===0){throw new Error("MoveFields array is empty");}for(i=0;i<l;i++){m=s.moveFields[i];if(!m.id){throw new Error("MoveFields element has no id attribute");}if(typeof(m.index)!=="number"){throw new Error("Index attribute at MoveFields element is no number");}}if(!C.content){C.content={};}if(!C.content.moveFields){C.content.moveFields=[];}C.content.moveFields=s.moveFields;if(s.targetId){C.content.targetId=s.targetId;}}else{throw new Error("oSpecificChangeInfo.moveFields attribute required");}};return M;},true);
