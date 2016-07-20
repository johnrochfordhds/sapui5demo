/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2014 SAP SE. All rights reserved
 */
jQuery.sap.declare("sap.apf.modeler.core.step");(function(){'use strict';sap.apf.modeler.core.Step=function(s,a,d){var r,b,c,f,e,g,t,n,k,h,l,j,m,o,p,q,u;u=a.instance.messageHandler;if(!d){r=new a.constructor.elementContainer(s+"-Representation",a.constructor.representation,a);b={};c=new a.constructor.elementContainer("SelectProperty",undefined,a);f=new a.constructor.elementContainer("FilterProperty",undefined,a);e={};g=new a.constructor.elementContainer("SelectPropertyForFilterMapping",undefined,a);t=new a.constructor.elementContainer("TargetPropertyForFilterMapping",undefined,a);k=false;n=new a.constructor.elementContainer("NavigationTarget",undefined,a);}else{r=d.representationContainer;b=d.request;c=d.selectProperties;f=d.filterProperties;e=d.requestForFilterMapping;g=d.selectPropertiesForFilterMapping;t=d.targetPropertiesForFilterMapping;k=d.keepSourceForFilterMapping;n=d.navigationTargets;h=d.titleId;l=d.longTitleId;j=d.leftUpperCornerTextKey;m=d.rightUpperCornerTextKey;o=d.leftLowerCornerTextKey;p=d.rightLowerCornerTextKey;q=d.topNSettings;}this.getId=function(){return s;};this.setTopN=function(i,w){if(w&&w instanceof Array&&w.length>0){this.resetTopN();q={};q.top=i;q.orderby=w;}else{u.putMessage(u.createMessageObject({code:11016}));return;}r.getElements().forEach(function(x){x.setTopN(i);q.orderby.forEach(function(w){x.addOrderbySpec(w.property,w.ascending);});});};this.setTopNValue=function(i){if(!q){q={};}q.top=i;if(q.orderby){v();}};this.setTopNSortProperties=function(i){if(!q){q={};}q.orderby=i;if(q.top){v();}};function v(){r.getElements().forEach(function(i){i.setTopN(q.top);i.removeAllOrderbySpecs();q.orderby.forEach(function(w){i.addOrderbySpec(w.property,w.ascending);});});}this.getTopN=function(){if(q&&q.top>0){if(jQuery.isArray(q.orderby)){var c=this.getSelectProperties();var i;for(i=q.orderby.length-1;i>=0;i--){if(jQuery.inArray(q.orderby[i].property,c)<0){q.orderby.splice(i,1);v();}}}return jQuery.extend({},true,q);}};this.resetTopN=function(){q=undefined;r.getElements().forEach(function(i){if(i.getTopN()){i.setTopN(undefined);}});};this.getService=function(){return b.service;};this.setService=function(i){b.service=i;};this.getEntitySet=function(){return b.entitySet;};this.setEntitySet=function(i){b.entitySet=i;};this.setTitleId=function(i){h=i;};this.getTitleId=function(){return h;};this.setLongTitleId=function(i){l=i;};this.getLongTitleId=function(){return l;};this.getSelectProperties=function(){var i=[];var w=c.getElements();w.forEach(function(x){i.push(x.getId());});return i;};this.addSelectProperty=function(i){c.createElementWithProposedId(undefined,i);};this.removeSelectProperty=function(i){c.removeElement(i);};this.getFilterProperties=function(){var i=[];var w=f.getElements();w.forEach(function(x){i.push(x.getId());});return i;};this.addFilterProperty=function(i){return f.createElementWithProposedId(undefined,i).getId();};this.removeFilterProperty=function(i){f.removeElement(i);};this.setFilterMappingService=function(i){e.service=i;};this.getFilterMappingService=function(){return e.service;};this.setFilterMappingEntitySet=function(i){e.entitySet=i;};this.getFilterMappingEntitySet=function(){return e.entitySet;};this.addFilterMappingTargetProperty=function(i){t.createElementWithProposedId(undefined,i);};this.getFilterMappingTargetProperties=function(){var i=[];var w=t.getElements();w.forEach(function(x){i.push(x.getId());});return i;};this.removeFilterMappingTargetProperty=function(i){t.removeElement(i);};this.addNavigationTarget=function(i){n.createElementWithProposedId(undefined,i);};this.getNavigationTargets=function(){var i=[];var w=n.getElements();w.forEach(function(x){i.push(x.getId());});return i;};this.removeNavigationTarget=function(i){n.removeElement(i);};this.setFilterMappingKeepSource=function(i){k=i;};this.getFilterMappingKeepSource=function(){return k;};this.getRepresentations=r.getElements;this.getRepresentation=r.getElement;this.createRepresentation=function(i){var w=r.createElement(i);if(q&&q.top){w.setTopN(q.top);q.orderby.forEach(function(x){w.addOrderbySpec(x.property,x.ascending);});}return w;};this.removeRepresentation=r.removeElement;this.copyRepresentation=r.copyElement;this.moveRepresentationBefore=function(i,w){return r.moveBefore(i,w);};this.moveRepresentationUpOrDown=function(i,w){return r.moveUpOrDown(i,w);};this.moveRepresentationToEnd=function(i){return r.moveToEnd(i);};this.setLeftUpperCornerTextKey=function(i){j=i;};this.getLeftUpperCornerTextKey=function(){return j;};this.setRightUpperCornerTextKey=function(i){m=i;};this.getRightUpperCornerTextKey=function(){return m;};this.setLeftLowerCornerTextKey=function(i){o=i;};this.getLeftLowerCornerTextKey=function(){return o;};this.setRightLowerCornerTextKey=function(i){p=i;};this.getRightLowerCornerTextKey=function(){return p;};this.copy=function(i){var w={request:b,selectProperties:c,filterProperties:f,requestForFilterMapping:e,selectPropertiesForFilterMapping:g,targetPropertiesForFilterMapping:t,navigationTargets:n,keepSourceForFilterMapping:k,titleId:h,longTitleId:l,leftUpperCornerTextKey:j,rightUpperCornerTextKey:m,leftLowerCornerTextKey:o,rightLowerCornerTextKey:p,topNSettings:q};var d=sap.apf.modeler.core.ConfigurationObjects.deepDataCopy(w);d.representationContainer=r.copy(i+"-Representation");return new sap.apf.modeler.core.Step((i||this.getId()),a,d);};};}());
