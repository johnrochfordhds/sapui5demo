/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP SE. All rights reserved
 */
jQuery.sap.declare("sap.apf.ui.representations.utils.UI5ChartHelper");
sap.apf.ui.representations.utils.UI5ChartHelper=function(a,p){var s=this;this.parameter=p;this.classifiedData=[];this.extendedDataSet=[];this.fieldKeysLookup={};this.displayNameLookup={};this.fieldNameLookup={};this.filterLookup={};this.datasetObj={};this.cachedSelection=[];this.filterValues=[];this.dataAlreadySorted=false;this.init=function(D,m,i,o,f){this.metadata=m;this.formatter=f;b.bind(this)(m,D);c.bind(this)(D);d.bind(this)(i,o);if(this.parameter.requiredFilters!==undefined&&this.parameter.requiredFilters.length!==0){v();}};var v=function(){s.filterValues=s.filterValues.filter(function(f){for(var i=0;i<s.extendedDataResponse.length;i++){var h=0;for(var j=0;j<s.parameter.requiredFilters.length;j++){if(f[j]===s.extendedDataResponse[i][s.parameter.requiredFilters[j]]){h=h+1;}}if(h===s.parameter.requiredFilters.length){return true;}else if(i===s.extendedDataResponse.length-1){return false;}}});s.cachedSelection=e();};var b=function(m,D){var f=this.parameter.dimensions.concat(this.parameter.measures);var r=[];var h=function(l){var n=0;for(var i=0;i<f.length;i++){if(f[i].fieldName===l){n++;}}return(n===0?false:true);};if(this.parameter.requiredFilters){this.parameter.requiredFilters.forEach(function(l){if(!h(l)){var n={fieldName:l};r.push(n);}});}if(r.length!==0){f=f.concat(r);}for(var i=0;i<f.length;i++){var j=f[i];var k=j.fieldName;this.displayNameLookup[k]={};if(m!==undefined){if(m.getPropertyMetadata(k)["aggregation-role"]==="dimension"){this.displayNameLookup[k].DISPLAY_NAME=m.getPropertyMetadata(k).label||m.getPropertyMetadata(k).name;this.displayNameLookup[k].VALUE="formatted_"+k;}else{this.displayNameLookup[k].DISPLAY_NAME=m.getPropertyMetadata(k).label||m.getPropertyMetadata(k).name;this.displayNameLookup[k].VALUE=k;}if(j.fieldDesc!==undefined&&a.getTextNotHtmlEncoded(j.fieldDesc).length){this.displayNameLookup[k].DISPLAY_NAME=a.getTextNotHtmlEncoded(j.fieldDesc);}if(m.getPropertyMetadata(k).unit!==undefined){var u=m.getPropertyMetadata(k).unit;var U;if(D!==undefined&&D.length!==0){U=D[0][u];this.displayNameLookup[k].DISPLAY_NAME=this.displayNameLookup[k].DISPLAY_NAME+' ('+U+')';}}}this.fieldNameLookup[this.displayNameLookup[k].DISPLAY_NAME]={};this.fieldNameLookup[this.displayNameLookup[k].DISPLAY_NAME].FIELD_NAME=k;this.fieldNameLookup[this.displayNameLookup[k].DISPLAY_NAME].VALUE=this.displayNameLookup[k].VALUE;}};var c=function(D){function f(w){var x=this.parameter.dimensions,y;for(y=0;y<x.length;y++){if(x[y].fieldName===w){return x[y].labelDisplayOption;}}}function h(l){var n=this.metadata.getPropertyMetadata(l).text;if(this.extendedDataResponse[i][n]){var T={text:this.extendedDataResponse[i][n],key:this.extendedDataResponse[i][l]};return this.formatter.getFormattedValueForTextProperty(l,T);}return this.formatter.getFormattedValue(l,this.extendedDataResponse[i][l]);}this.extendedDataResponse=jQuery.extend([],true,D);var i,j,k;if(this.extendedDataResponse.length!==0){for(i=0;i<this.extendedDataResponse.length;i++){for(k=0;k<this.parameter.measures.length;k++){if(this.extendedDataResponse[i][this.parameter.measures[k].fieldName]!==null){this.extendedDataResponse[i][this.parameter.measures[k].fieldName]=parseFloat(this.extendedDataResponse[i][this.parameter.measures[k].fieldName]);}}for(j=0;j<Object.keys(this.displayNameLookup).length;j++){var l=Object.keys(this.displayNameLookup)[j];var m=(this.displayNameLookup[l].VALUE.search('formatted_')!==-1);if(m){var L=f.call(this,l);var t=this.metadata.getPropertyMetadata(l).hasOwnProperty('text');if(L===sap.apf.core.constants.representationMetadata.labelDisplayOptions.TEXT){var n=this.metadata.getPropertyMetadata(l).text;this.extendedDataResponse[i][this.displayNameLookup[l].VALUE]=this.extendedDataResponse[i][n]||"";}if((!t&&L===undefined)||L===sap.apf.core.constants.representationMetadata.labelDisplayOptions.KEY){this.extendedDataResponse[i][this.displayNameLookup[l].VALUE]=this.formatter.getFormattedValue(l,this.extendedDataResponse[i][l]);}if((t&&L===undefined)||L===sap.apf.core.constants.representationMetadata.labelDisplayOptions.KEY_AND_TEXT){this.extendedDataResponse[i][this.displayNameLookup[l].VALUE]=h.call(this,l);}}}var o="";for(j=0;j<this.parameter.dimensions.length;j++){var q=this.displayNameLookup[this.parameter.dimensions[j].fieldName].VALUE;this.extendedDataResponse[i][q]=this.extendedDataResponse[i][q]===null?this.extendedDataResponse[i][q]:this.extendedDataResponse[i][q].toString();o=o+this.extendedDataResponse[i][q];this.filterLookup[o]=[];if(this.parameter.requiredFilters){for(k=0;k<this.parameter.requiredFilters.length;k++){var r={};r.id=this.extendedDataResponse[i][this.parameter.requiredFilters[k]];r.text=this.extendedDataResponse[i][this.displayNameLookup[this.parameter.requiredFilters[k]].VALUE];this.filterLookup[o].push(r);}}}}}else{var u={};for(k=0;k<this.parameter.measures.length;k++){u[s.displayNameLookup[this.parameter.measures[k].fieldName].VALUE]=undefined;}for(j=0;j<this.parameter.dimensions.length;j++){u[s.displayNameLookup[this.parameter.dimensions[j].fieldName].VALUE]=undefined;}this.extendedDataResponse.push(u);}};var d=function(I,D){var o=this.extendedDataResponse;var m=new sap.ui.model.json.JSONModel();m.setData({data:o});var i;for(i=0;i<this.parameter.dimensions.length;i++){this.parameter.dimensions[i].name=this.displayNameLookup[this.parameter.dimensions[i].fieldName].DISPLAY_NAME;this.parameter.dimensions[i].value='{'+this.displayNameLookup[this.parameter.dimensions[i].fieldName].VALUE+'}';this.parameter.dimensions[i].kind=this.parameter.dimensions[i].kind?this.parameter.dimensions[i].kind:undefined;}s.measureAxisType=I;for(i=0;i<this.parameter.measures.length;i++){this.parameter.measures[i].name=this.displayNameLookup[this.parameter.measures[i].fieldName].DISPLAY_NAME;this.parameter.measures[i].value='{'+this.displayNameLookup[this.parameter.measures[i].fieldName].VALUE+'}';this.parameter.measures[i].kind=this.parameter.measures[i].kind?this.parameter.measures[i].kind:undefined;}var P={dimensions:this.parameter.dimensions,measures:this.parameter.measures};var f=D.getDataset(P);if(this.metadata!==undefined){for(i=0;i<this.parameter.dimensions.length;i++){var M=this.metadata.getPropertyMetadata(this.parameter.dimensions[i].fieldName);if(M.isCalendarYearMonth==="true"){if(this.parameter.dimensions.length>1){f.data.sorter=new sap.ui.model.Sorter(this.parameter.dimensions[0].fieldName,false);}}}}this.datasetObj=f;};this.getDataset=function(){return new sap.viz.ui5.data.FlattenedDataset(this.datasetObj);};this.getModel=function(){var o=this.extendedDataResponse;var m=new sap.ui.model.json.JSONModel();m.setData({data:o});return m;};this.getFilterCount=function(){return this.filterValues.length;};this.getFilters=function(){var f=Object.keys(this.filterLookup);var F=[];var s=this;var h=function(k){for(var i=0;i<f.length;i++){var l={};var m=f[i];for(var j=0;j<s.filterLookup[m].length;j++){if(k===s.filterLookup[m][j].id){l.id=k;l.text=s.filterLookup[m][j].text;F.push(l);return;}}}};for(var i=0;i<this.filterValues.length;i++){h(this.filterValues[i][0]);}return F;};this.getSelectionFromFilter=function(){if(this.parameter.requiredFilters===undefined||this.parameter.requiredFilters.length===0){return[];}var h=e();return h;};this.getHighlightPointsFromSelectionEvent=function(f){var h=[];var n=[];h=g(f,this.cachedSelection);for(var i=0;i<h.length;i++){var k=h[i];if(this.parameter.measures.length===1){var m=this.displayNameLookup[this.parameter.measures[0].fieldName].DISPLAY_NAME;if(k.data[m]===undefined||k.data[m]===null){continue;}}var l="";for(var j=0;j<this.parameter.dimensions.length;j++){var o=this.displayNameLookup[this.parameter.dimensions[j].fieldName].DISPLAY_NAME;l=l+k.data[o];}var q=this.filterLookup[l];var r=this.filterValues.filter(function(t){var u=0;for(var i=0;i<s.parameter.requiredFilters.length;i++){if(t[i]===q[i].id){u=u+1;}else{break;}}if(u===s.parameter.requiredFilters.length){return true;}else if(i===s.parameter.requiredFilters.length){return false;}});if(r.length===0){var M=q.map(function(t){return t.id;});this.filterValues.push(M);}}n=e();this.cachedSelection=n;return n;};var g=function(f,n){var h=f.filter(function(k){for(var i=0;i<n.length;i++){var l=0;for(var j=0;j<Object.keys(k.data).length;j++){if(n[i].data[Object.keys(k.data)[j]]===k.data[Object.keys(k.data)[j]]){l=l+1;}else{break;}}if(l===Object.keys(k.data).length){return false;}else if(j===Object.keys(k.data).length){return true;}}return true;});return h;};this.getFilterFromSelection=function(n){var r=[];var i;for(i=0;i<s.filterValues.length;i++){r.push(s.filterValues[i][0]);}if(n&&n.length>0){n.forEach(function(j){s.filterValues.push([j]);});r=r.concat(n);}var f=a.createFilter();var E=f.getOperators().EQ;var F;var A=f.getTopAnd().addOr('exprssionOr');for(i=0;i<r.length;i++){var h=this.metadata.getPropertyMetadata(s.parameter.requiredFilters[0]).dataType.type;if(h==="Edm.Int32"){r[i]=r[i]===null?r[i]:parseFloat(r[i]);}F={id:r[i],name:s.parameter.requiredFilters[0],operator:E,value:r[i]};A.addExpression(F);}return f;};var e=function(){var r=[];r[0]=[];var i,j,k,l;for(i=0;i<s.filterValues.length;i++){r[0].push(s.filterValues[i][0]);}var n=[];for(i=0;i<s.extendedDataResponse.length;i++){var f=s.extendedDataResponse[i];for(j=0;j<r[0].length;j++){var h=0;for(k=0;k<r.length;k++){if(f[s.parameter.requiredFilters[k]]===r[k][j]){h=h+1;}}if(h===r.length){var m={data:{}};var o;var q;for(k=0;k<s.parameter.dimensions.length;k++){var t=s.parameter.dimensions[k].name;var u=s.fieldNameLookup[t].VALUE;m.data[t]=f[u];}if(!s.measureAxisType){var w;var x;for(l=0;l<s.parameter.measures.length;l++){var y=jQuery.extend(true,{},m);w=s.parameter.measures[l].name;x=s.fieldNameLookup[w].VALUE;y.data[w]=f[x]===null?f[x]:parseFloat(f[x]);n.push(y);}}else{for(k=0;k<s.parameter.measures.length;k++){o=s.parameter.measures[k].name;q=s.fieldNameLookup[o].VALUE;m.data[o]=f[q]===null?f[q]:parseFloat(f[q]);}n.push(m);}}}}return n;};this.getHighlightPointsFromDeselectionEvent=function(f){var i,j;var h=g(this.cachedSelection,f);for(i=0;i<h.length;i++){var k=h[i];var l="";for(j=0;j<this.parameter.dimensions.length;j++){var m=this.displayNameLookup[this.parameter.dimensions[j].fieldName].DISPLAY_NAME;l=l+k.data[m];}var n=this.filterLookup[l];this.filterValues=this.filterValues.filter(function(q,r){var t=0;for(var i=0;i<n.length;i++){if(n[i].id===q[i]){t=t+1;}}if(t===n.length){return false;}else{return true;}});}var o=e();this.cachedSelection=o;return o;};this.destroy=function(){if(s.formatter){s.formatter.destroy();s.formatter=null;}s.metadata=null;s.extendedDataResponse=null;};};
