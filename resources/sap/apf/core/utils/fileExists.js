/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
jQuery.sap.declare('sap.apf.core.utils.fileExists');jQuery.sap.require('sap.apf.core.utils.checkForTimeout');(function(){'use strict';sap.apf.core.utils.FileExists=function(){var f={};this.check=function(u){if(f[u]!==undefined){return f[u];}var F=false;jQuery.ajax({url:u,type:"HEAD",success:function(d,s,j){var m=sap.apf.core.utils.checkForTimeout(j);if(m===undefined){F=true;}else{F=false;}},error:function(){F=false;},async:false});f[u]=F;return F;};};}());
