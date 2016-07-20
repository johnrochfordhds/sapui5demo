jQuery.sap.declare("sap.apf.utils.parseTextPropertyFile");jQuery.sap.require("sap.ui.core.format.DateFormat");jQuery.sap.require("sap.apf.core.constants");(function(){'use strict';sap.apf.utils.parseTextPropertyFile=function(t,a){var m=a.instance.messageHandler;var d=sap.ui.core.format.DateFormat.getDateTimeInstance({pattern:"yyyy/MM/dd HH:mm:ss"});var D;var l=t.split(/\r?\n/);var b=l.length;var i;var c=-1;var e=-1;var f;var g,h,j;var A=false;var p={Application:undefined,TextElements:[],Messages:[]};function k(v,w){var x=m.createMessageObject({code:v,aParameters:[w]});p.Messages.push(x);}function n(v){k(11013,v);}function o(v){k(11011,v);}function q(v,w){var x=sap.apf.utils.isValidGuid(v);if(!x){k(11012,w);return false;}return true;}function r(v){k(11015,v);}function s(v){k(11012,v);}for(i=0;i<b;i++){if(!A){var u=/^\#\s*ApfApplicationId=[0-9A-F]+\s*$/.exec(l[i]);if(u!==null){p.Application=l[i].split('=')[1];if(!sap.apf.utils.isValidGuid(p.Application)){p.Application="";n(i);}A=true;continue;}}if(l[i]===""){continue;}if(e===i&&/^\#\s*LastChangeDate/.exec(l[i])){j=l[i].split('=');if(j.length===2){D=d.parse(j[1]);if(!D){r(i);f.LastChangeUTCDateTime="";}else{f.LastChangeUTCDateTime='/Date('+D.getTime()+')/';}p.TextElements.push(f);}else{r(i);}f=null;continue;}if(c===i){j=l[i].split('=');if(j.length===2){if(q(j[0],i)){f.TextElement=j[0];f.TextElementDescription=j[1];}else{s(i);}}else{o(i);}continue;}g=/^\#(X|Y)[A-Z]{3},[0-9]+:/.exec(l[i]);if(g){if(c===i){o(i);}f={};f.Language=sap.apf.core.constants.developmentLanguage;f.Application=p.Application;f.TextElementType=l[i].match(/(X|Y)[A-Z]{3}/)[0];f.MaximumLength=l[i].match(/,[0-9]+/);f.MaximumLength=parseInt(f.MaximumLength[0].substring(1),10);f.TranslationHint=l[i].match(/:\s*[0-9a-zA-Z\s]+$/);f.TranslationHint=f.TranslationHint[0].substring(1);c=i+1;e=i+2;}else{h=/^\#(X|Y)[A-Z]{3},[0-9]+/.exec(l[i]);if(h){if(c===i){o(i);}f={};f.Language=sap.apf.core.constants.developmentLanguage;f.Application=p.Application;f.TextElementType=l[i].match(/(X|Y)[A-Z]{3}/)[0];f.MaximumLength=l[i].match(/,[0-9]+/);f.MaximumLength=parseInt(f.MaximumLength[0].substring(1),10);f.TranslationHint="";c=i+1;e=i+2;}}}if(!A){k(11010,0);}return p;};}());