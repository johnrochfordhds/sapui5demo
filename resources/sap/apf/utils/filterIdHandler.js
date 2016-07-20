/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
jQuery.sap.declare('sap.apf.utils.filterIdHandler');(function(){'use strict';sap.apf.utils.FilterIdHandler=function(i){var m=i.instance.messageHandler;var u=1;var a=[];var f={};this.add=function(d){if(!c(d)){m.putMessage(m.createMessageObject({code:'5301'}));}f[u]=g(d);a.push(u);i.functions.setRestrictionByProperty(d);return u++;};this.update=function(d,e){if(d&&typeof d=='number'){m.check((d>0&&d<u),'Passed unknown numeric identifier during update of path context handler');if(!(d>0&&d<u)){return;}}else if(!d||typeof d!='string'){m.check(false,'Passed false identifier during update of path context handler');return;}if(!c(e)){m.putMessage(m.createMessageObject({code:'5301'}));}i.functions.setRestrictionByProperty(e);f[d]=g(e);};this.get=function(d){switch(typeof d){case'number':m.check((d>0&&d<u),'Passed unknown numeric identifier during get from path context handler');break;case'string':m.check(f[d],'Passed unknown string identifier during get from path context handler');break;default:m.check(false,"Filter Id handler - wrong type of the id parameter in get");}return i.functions.getRestrictionByProperty(f[d]);};this.getAllInternalIds=function(d){return jQuery.sap.extend(true,[],a);};this.serialize=function(){return jQuery.extend(true,{},f);};this.deserialize=function(d){u=1;var p;for(p in d){if(typeof b(p)==='number'){u++;}}f=jQuery.extend(true,{},d);};function g(d){return d.getInternalFilter().getProperties()[0];}function b(p){if(isNaN(Number(p))){return p;}return Number(p);}function c(d){var e=d.getInternalFilter();var h=e.getProperties();if(h.length>1){return false;}var v=new V();e.traverse(v);return v.isAccepted();function V(){var j=this;var k=false;var l=false;var n=true;this.isAccepted=function(){return n;};this.processEmptyFilter=function(){return;};this.processTerm=function(t){var o=t.getOp();if(!l&&!k){if(o==='GE'||o==='LE'||o==='EQ'){return;}}if(l&&(o==='GE'||o==='LE')){return;}if(k&&o==='EQ'){return;}n=false;};this.processAnd=function(o,F){if(F&&F.length>0){l=true;}this.process(o);F.forEach(function(d){j.process(d);});};this.processOr=function(o,F){if(F&&F.length>0){k=true;}this.process(o);F.forEach(function(d){j.process(d);});};this.process=function(d){if(k&&l){n=false;}if(!n){return;}d.traverse(this);};}}};}());