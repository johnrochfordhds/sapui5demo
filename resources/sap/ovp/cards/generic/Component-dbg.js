(function () {
    "use strict";
    /*global jQuery, sap */

    jQuery.sap.declare("sap.ovp.cards.generic.Component");
    jQuery.sap.require("sap.ui.core.UIComponent");
    jQuery.sap.require("sap.ovp.cards.AnnotationHelper");

    sap.ui.core.UIComponent.extend("sap.ovp.cards.generic.Component", {
        // use inline declaration instead of component.json to save 1 round trip
        metadata: {
            properties: {
                "contentFragment": {
                    "type": "string"
                },
                "headerExtensionFragment": {
                    "type": "string"
                },
                "contentPosition": {
                    "type": "string",
                    "defaultValue": "Middle"
                },
                "footerFragment": {
                    "type": "string"
                },
                "identificationAnnotationPath":{
                    "type": "string",
                    "defaultValue": "com.sap.vocabularies.UI.v1.Identification"
                },
                "selectionAnnotationPath":{
                    "type": "string"
                },
                "filters": {
                    "type": "object"
                },
                "addODataSelect": {
                    "type": "boolean",
                    "defaultValue": false
                }
            },
            version: "1.36.12",

            library: "sap.ovp",

            includes: [],

            dependencies: {
                libs: [ "sap.m" ],
                components: []
            },
            config: {}
        },

        /**
         * Default "abstract" empty function.
         * In case there is a need to enrich the default preprocessor which provided by OVP, the extended Component should provide this function and return a preprocessor object.
         * @public
         * @returns {Object} SAPUI5 preprocessor object
         */
        getCustomPreprocessor: function () {},

        getPreprocessors : function(ovplibResourceBundle) {
            var oComponentData = this.getComponentData(),
                oSettings = oComponentData.settings,
                oModel = oComponentData.model,
                oMetaModel,
                oEntityTypeContext,
                oEntitySetContext;

            //Backwards compatibility to support "description" property
            if (oSettings.description && !oSettings.subTitle) {
                oSettings.subTitle = oSettings.description;
            }
            if (oModel){
                var oMetaModel = oModel.getMetaModel();
                var oEntitySet = oMetaModel.getODataEntitySet(oSettings.entitySet);
                var sEntitySetPath = oMetaModel.getODataEntitySet(oSettings.entitySet, true);
                var oEntityType = oMetaModel.getODataEntityType(oEntitySet.entityType);

                oEntitySetContext = oMetaModel.createBindingContext(sEntitySetPath);
                oEntityTypeContext = oMetaModel.createBindingContext(oEntityType.$path);
            }

            var oCardProperties = this._getCardPropertyDefaults();

            oCardProperties = jQuery.extend(true, {metaModel: oMetaModel, entityType: oEntityType}, oCardProperties, oSettings);

            var oOvpCardPropertiesModel = new sap.ui.model.json.JSONModel(oCardProperties);
            var ovplibResourceBundle = this.getOvplibResourceBundle();

            var oDefaultPreprocessors = {
                xml: {
                    bindingContexts: {entityType: oEntityTypeContext, entitySet: oEntitySetContext},
                    models: {entityType: oMetaModel, entitySet:oMetaModel, ovpMeta: oMetaModel, ovpCardProperties: oOvpCardPropertiesModel, ovplibResourceBundle: ovplibResourceBundle},
                    ovpCardProperties: oOvpCardPropertiesModel,
                    dataModel: oModel,
                    _ovpCache: {}
                }
            };

            return jQuery.extend(true, {}, this.getCustomPreprocessor(), oDefaultPreprocessors);
        },

        _getCardPropertyDefaults: function(){
            var oCardProperties = {};
            var oPropsDef = this.getMetadata().getAllProperties();
            var oPropDef;
            for (var propName in oPropsDef){
                oPropDef = oPropsDef[propName];
                if (oPropDef.defaultValue !== undefined){
                    oCardProperties[oPropDef.name] = oPropDef.defaultValue;
                }
            }
            return oCardProperties;
        },

        getOvplibResourceBundle: function(){
            if (!this.ovplibResourceBundle){
                var oResourceBundle = sap.ui.getCore().getLibraryResourceBundle("sap.ovp");
                this.ovplibResourceBundle = oResourceBundle ? new sap.ui.model.resource.ResourceModel({bundleUrl: oResourceBundle.oUrlInfo.url}) : null;
            }
            return this.ovplibResourceBundle;
        },

        createContent: function () {
            var oComponentData = this.getComponentData && this.getComponentData();
            var oModel = oComponentData.model;
            var oPreprocessors = this.getPreprocessors();

            var oView;
            oView = sap.ui.view({
                preprocessors: oPreprocessors,
                type: sap.ui.core.mvc.ViewType.XML,
                viewName: "sap.ovp.cards.generic.Card"
            });

            oView.setModel(oModel);
            // check if i18n model is available and then add it to card view
            if (oComponentData.i18n) {
                oView.setModel(oComponentData.i18n, "@i18n");
            }
            oView.setModel(oPreprocessors.xml.ovpCardProperties, "ovpCardProperties");
            oView.setModel(this.getOvplibResourceBundle(), "ovplibResourceBundle");

            return oView;
        }
    });
})();
