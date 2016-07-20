/**
 * Created by i060586 on 11/25/14.
 */

sap.ui.define(['jquery.sap.global'],

    function(jQuery) {
        "use strict";

        /**
         * Button renderer.
         * @namespace
         */
        var ObjectStreamRenderer = {
        };

        /**
         * Renders the HTML for the given control, using the provided
         * {@link sap.ui.core.RenderManager}.
         *
         * @param {sap.ui.core.RenderManager} oRm
         *            the RenderManager that can be used for writing to
         *            the Render-Output-Buffer
         * @param {sap.ui.core.Control} oButton
         *            the button to be rendered
         */
        ObjectStreamRenderer.render = function(oRm, oControl) {

            if (!oControl.getVisible()) {
                return;
            }

            oRm.write("<div");
            oRm.writeControlData(oControl);
            oRm.writeAccessibilityState(undefined, {role: "dialog"});
            oRm.writeAccessibilityState(oControl, {label: oControl.getTitle()});
            oRm.addClass("sapOvpObjectStream");
            oRm.writeClasses();
            oRm.write(">");

            /*header*/
            oRm.write("<div");
            oRm.addClass("sapOvpObjectStreamHeader");
            oRm.writeAccessibilityState(undefined, {role: "heading"});
            oRm.writeClasses();
            oRm.write(">" + oControl.getTitle() + "</div>");
            oRm.write('<div tabindex="0" ');
            oRm.addClass("sapOvpObjectStreamClose");
            oRm.writeAccessibilityState(undefined, {role: "button"});
            oRm.writeAccessibilityState(oControl, {label: "close"});
            oRm.writeClasses();
            oRm.write(">");
            oRm.renderControl(oControl._closeIcon);
            oRm.write("</div>");
            /*header*/

            oRm.write('<div id="' + oControl.getId() + '-cont" class="sapOvpObjectStreamCont"');
            oRm.write(">");
            oRm.write('<div id="' + oControl.getId() + '-scroll"');
            oRm.writeAccessibilityState(undefined, {role: "list"});
            oRm.addClass("sapOvpObjectStreamScroll");

            oRm.writeClasses();
            oRm.write(">");


            var aContent = oControl.getContent();

            aContent.forEach(function(control, i) {
                oRm.write("<div class='sapOvpObjectStreamItem' ");
                if (i == 0) {
                    oRm.write("tabindex='0' ");
                } else {
                    oRm.write("tabindex='-1' ");
                }
                oRm.writeAccessibilityState(undefined, {role: "listitem"});
                oRm.write("aria-setsize = " + (aContent.length + 1) + " aria-posinset = " + (i + 1));
                oRm.write(">");
                oRm.renderControl(control);
                oRm.write("</div>");
            });

            var placeHolder = oControl.getPlaceHolder();
            if (placeHolder){
                oRm.write("<div class='sapOvpObjectStreamItem' ");
                if (!aContent.length) {
                    oRm.write("tabindex='0'");
                } else {
                    oRm.write("tabindex='-1'");
                }
                oRm.writeAccessibilityState(undefined, {role: "listitem"});
                oRm.write("aria-setsize = " + (aContent.length + 1) + " aria-posinset = " + (aContent.length + 1));
                oRm.write(">");
                oRm.renderControl(placeHolder);
                oRm.write("</div>");
            }

            oRm.write("</div>"); // scroll

            oRm.write('<div id="' + oControl.getId() + '-leftedge" class="sapOvpOSEdgeLeft">');
            oRm.renderControl(new sap.ui.core.Icon({src: "sap-icon://slim-arrow-left", useIconTooltip:false}));
            oRm.write('</div>');
            oRm.write('<div id="' + oControl.getId() + '-rightedge" class="sapOvpOSEdgeRight">');
            oRm.renderControl(new sap.ui.core.Icon({src: "sap-icon://slim-arrow-right", useIconTooltip:false}));
            oRm.write('</div>');

            oRm.write("</div>"); // cont
            oRm.write("</div>"); // root

        };

        ObjectStreamRenderer.renderFooterContent = function(oRm, oControl) {

            // overrides this function
        };

        return ObjectStreamRenderer;

    }, /* bExport= */ true);
