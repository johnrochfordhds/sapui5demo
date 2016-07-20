/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
jQuery.sap.declare("sap.apf.core.path");(function(){'use strict';sap.apf.core.Path=function(I){this.type="path";var m=I.messageHandler;var c=I.coreApi;var t=this;var s=[];var a=[];var n=0;this.destroy=function(){a=[];s.forEach(function(f){f.destroy();});s=[];t=undefined;};this.getSteps=function(){return jQuery.extend(true,[],s);};this.addStep=function(S,f){s.push(S);t.update(f);};this.makeStepActive=function(S){var f=this.stepIsInPath(S);m.check(f,"An unknown step can't be an active step.",sap.apf.core.constants.message.code.errorCheckWarning);if(f){if(this.stepIsActive(S)===false){a.push(S);}}};this.makeStepInactive=function(S){var f=this.stepIsActive(S);m.check(f,"Only an active step can be removed from the active steps.",sap.apf.core.constants.message.code.errorCheckWarning);if(f){var i=jQuery.inArray(S,a);a.splice(i,1);}};this.stepIsActive=function(S){var i=jQuery.inArray(S,a);if(i>=0){return true;}return false;};this.stepIsInPath=function(S){var i=jQuery.inArray(S,s);if(i>=0){return true;}return false;};this.getActiveSteps=function(){return jQuery.extend(true,[],a);};this.getCumulativeFilterUpToActiveStep=function(){var f=jQuery.Deferred();c.getCumulativeFilter().done(function(C){var o=C.copy();var i,l=s.length;for(i=0;i<l;i++){o=o.addAnd(s[i].getFilter());if(t.stepIsActive(s[i])){f.resolve(o);return;}}f.resolve(o);});return f.promise();};this.moveStepToPosition=function(S,f,h){var i=jQuery.inArray(S,s);var j=f;m.check(typeof f==="number"&&f>=0&&f<s.length,"Path: moveStepToPosition invalid argument for nPosition");m.check(i>=0&&i<s.length,"Path: moveStepToPosition invalid step");if(i===f){return;}s.splice(i,1);s.splice(j,0,S);this.update(h);};this.removeStep=function(S,f){var h=this.stepIsInPath(S);var i=this.stepIsActive(S);var j=jQuery.inArray(S,s);m.check(h,"Path: remove step - invalid step");s.splice(j,1);if(i){this.makeStepInactive(S);}this.update(f);S.destroy();};this.update=function(S){if(!s[0]){return;}var f;var C=s[0];c.getCumulativeFilter().done(function(o){var h=o.copy();n++;f=n;C.update(h,i);function i(r,k){var l=jQuery.inArray(C,s);var M;if(f===n){if(r instanceof Error){var p=l+1;M=m.createMessageObject({code:"5002",aParameters:[p],callingObject:C});M.setPrevious(r);m.putMessage(M);C.setData({data:[],metadata:undefined},h);S(C,true);l++;C=s[l];while(C){C.setData({data:[],metadata:undefined},h);S(C,true);l++;C=s[l];}return;}if(!k){C.setData(r,h);}S(C,!k);if(f!==n){return;}C.determineFilter(h.copy(),j);}}function j(F){var k=jQuery.inArray(C,s);h.addAnd(F);C=s[k+1];if(C){C.update(h,i);}else{h=undefined;}}});};this.serialize=function(){return{path:{steps:b(),indicesOfActiveSteps:g()}};};this.deserialize=function(S){d(S.path.steps,this);e(S.path.indicesOfActiveSteps,this);};function g(){var f=[];for(var i=0;i<s.length;i++){for(var j=0;j<a.length;j++){if(s[i]===a[j]){f.push(i);}}}return f;}function b(){var S=[];for(var i=0;i<s.length;i++){S.push(s[i].serialize());}return S;}function d(S,C){var f=C.update;C.update=function(){};var i=0;for(i=0;i<S.length;i++){c.createStep(S[i].stepId);}for(i=0;i<s.length;i++){s[i].deserialize(S[i]);}C.update=f;}function e(f,C){for(var i=0;i<f.length;i++){var h=f[i];C.makeStepActive(s[h]);}}};}());
