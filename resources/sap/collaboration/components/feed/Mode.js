/*
* ! @copyright@
*/
sap.ui.define(["sap/ui/base/Object","sap/ui/model/Filter","sap/ui/model/FilterOperator","sap/ui/core/Fragment","sap/collaboration/components/utils/CommonUtil"],function(O,F,a,b,C){var M=O.extend("sap.collaboration.components.feed.Mode",{constructor:function(f){this._oCommonUtil=new C();this._oFeedController=f;this._oViewDataModel=this._oFeedController.getModel();this._oJamModel=this._oFeedController.getModel("jam");var g=this._getGroupSelectorFragmentId();sap.ui.xmlfragment(g,"sap.collaboration.components.feed.fragments.GroupSelector",this);this._oGroupSelectPopover=b.byId(g,"responsivePopover");this._oGroupSelectPopover.setModel(this._oFeedController.getModel("i18n"),"i18n");this._oList=b.byId(g,"list");this._oList.setBusyIndicatorDelay(0);this._oListItemTemplate=sap.ui.xmlfragment("sap.collaboration.components.feed.fragments.CustomListItem",this);}});M._nextGroupSelectorFragmentIdIndex=0;M.prototype._getGroupSelectorFragmentId=function(){return this._oFeedController.createId("groupSelectorFragment")+M._nextGroupSelectorFragmentIdIndex++;};M.prototype.getFeedEntries=function(p,s){var l=jQuery.Deferred();var P={"urlParameters":{"$expand":"Creator,TargetObjectReference"},"success":function(d,r){l.resolve(d,r);},"error":function(e){l.reject(e);}};if(s){P.urlParameters.$skiptoken=s;}return l.promise(this._oJamModel.read(p,P));};M.prototype.onGroupSearch=function(e){var f=new F("Name",a.Contains,e.getParameter("newValue"));this._oList.getBinding("items").filter([f]);};M.prototype.addPost=function(c){var p=jQuery.Deferred();var P=this.getAddPostPath();var d={"Text":c};var m={"success":function(D,r){p.resolve(D,r);},"error":function(e){p.reject(e);}};return{"path":P,"payload":d,"promise":p.promise(this._oJamModel.create(P,d,m))};};M.prototype.getFeedUpdatesLatestCount=function(){var g=jQuery.Deferred();var l=this._oFeedController.byId("timeline").getContent()[0];var L=l?l.getModel().getProperty("/TopLevelId"):"";var G=this._oViewDataModel.getProperty("/groupSelected/Id");var p="/Group_FeedLatestCount";var P={"urlParameters":{LatestTopLevelId:L,Id:G},"success":function(d,r){g.resolve(d,r);},"error":function(e){g.reject(e);}};return g.promise(this._oJamModel.callFunction(p,P));};return M;},true);