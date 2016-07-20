/*
 * @copyright@
 */
jQuery.sap.require("sap.ui.base.Object");jQuery.sap.declare("sap.collaboration.components.socialtimeline.annotations.Metadata");sap.ui.base.Object.extend("sap.collaboration.components.socialtimeline.annotations.Metadata",{constructor:function(o){this._oIncludedSchemaAliasMap={};this._oSchemaAliasMap={};this._oODataMetadata=o;this._parseODataMetadata();},_parseODataMetadata:function(){this._parseReferenceElements(this._oODataMetadata.extensions);this._parseDataServicesElement(this._oODataMetadata.dataServices);},_parseReferenceElements:function(r){for(var R in r){this._parseReferenceElement(r[R]);}},_parseReferenceElement:function(r){for(var R in r.children){this._parseReferenceElementChild(r.children[R]);}},_parseReferenceElementChild:function(r){if(r.name==="Include"){this._parseIncludeElement(r);}else{return;}},_parseIncludeElement:function(i){var I=null;var s=null;for(var a in i.attributes){if(i.attributes[a].name==="Namespace"){I=i.attributes[a].value;}else{s=i.attributes[a].value;}}this._oIncludedSchemaAliasMap[I]=s;},_parseDataServicesElement:function(d){this._parseSchemaElements(d.schema);},_parseSchemaElements:function(s){for(var S in s){this._parseSchemaElement(s[S]);}},_parseSchemaElement:function(s){if(s.alias===undefined){this._oSchemaAliasMap[s.namespace]=null;}else{this._oSchemaAliasMap[s.namespace]=s.alias;}this._parseEntityTypeElements(s.entityType);},_parseEntityTypeElements:function(e){for(var E in e){this._parseEntityTypeElement(e[E]);}},_parseEntityTypeElement:function(){},isSchemaIncluded:function(n){return(this._oIncludedSchemaAliasMap[n]!==undefined);}});
