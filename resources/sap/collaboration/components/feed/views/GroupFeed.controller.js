/*
* ! @copyright@
*/
sap.ui.define(["jquery.sap.global","sap/ui/core/mvc/Controller","sap/suite/ui/commons/TimelineItem","sap/m/MessageBox","sap/collaboration/components/utils/LanguageBundle","sap/collaboration/components/utils/DateUtil","sap/collaboration/components/controls/FeedEntryEmbedded","sap/collaboration/components/controls/ReplyPopover","sap/collaboration/components/controls/SocialTextArea","sap/collaboration/components/controls/FilterPopover","sap/collaboration/components/utils/CommonUtil","sap/collaboration/components/feed/ModeFactory"],function(q,C,T,M,L,D,F,R,S,a,b,c){"use strict";var s="sap.collaboration.components.feed.views.GroupFeed";var j="/sap/bc/ui2/smi/rest_tunnel/Jam/api/v1/OData";var d="/sap/opu/odata/sap/SM_INTEGRATION_V2_SRV";var g=C.extend(s,{onInit:function(){this._initializeUtilities();this._initializeRequestStateData();this._initializeSystemData();this._initializeModels();this._initializeTimeline();},onBeforeRendering:function(){if(!this.isJamConfigured()){this.displayErrorMessage();}},onAfterRendering:function(){},onExit:function(){this._abortAllPendingRequests();this.byId("filter_popover").destroy();this.byId("addPost_popover").destroy();this._stopAutoCheckingForNewUpdates();},_initializeUtilities:function(){this._oCommonUtil=new b();this._oLogger=new q.sap.log.getLogger(s);this._oLanguageBundle=new L();this._oDateUtil=new D();},_initializeSystemData:function(){this._oModes={};this._mCurrentUser;},_initializeRequestStateData:function(){this._oNextLinks={"feedEntriesNextLink":"","repliesNextLink":""};this._oPendingRequests={"loadingFeedEntriesRequest":undefined,"loadingRepliesRequest":undefined,"loadingSuggestionsRequest":undefined,"loadingFeedAtMentions":undefined,"refreshingSecurityToken":undefined};this._oPostRequestData={"path":undefined,"payload":undefined,"parameters":undefined};},_initializeModels:function(){var i=this._oLanguageBundle.createResourceModel();this.getView().setModel(i,"i18n");this._i18nModel=i;var o=new sap.ui.model.odata.ODataModel(d,true);this.getView().setModel(o,"smi");this._oSMIModel=o;var J=new sap.ui.model.odata.v2.ODataModel(j);J.attachMetadataFailed(this._onMetadataFailed,this);J.attachRequestCompleted(this._onJamRequestCompleted,this);J.attachRequestFailed(this._onJamRequestFailed,this);J.attachRequestSent(this._onJamRequestSent,this);J.attachBatchRequestCompleted(this._onBatchCompleted,this);J.attachBatchRequestFailed(this._onBatchFailed,this);J.attachBatchRequestSent(this._onBatchSent,this);this.getView().setModel(J,"jam");this._oJamModel=J;var v=new sap.ui.model.json.JSONModel();v.setData({"feedSources":undefined,"axisOrientation":undefined,"enableSocial":true,"enableScroll":true,"forceGrowing":false,"growingThreshold":20,"groupSelectorEnabled":false,"groupSelected":{},"groups":[],"filterEnabled":false,"filter":[],"filterMessage":"","feedEndpoint":undefined,"addPostButtonEnabled":false,});v.bindProperty("/feedSources").attachChange(this._onFeedSourcesChange,this);v.bindProperty("/feedEndpoint").attachChange(this._onFeedEndpointChange,this);v.bindProperty("/filterMessage").attachChange(this._onFilterMessageChange,this);this.getView().setModel(v);this._oViewDataModel=v;},_initializeTimeline:function(){var t=this.byId("timeline");t.setContent([]);this._modifyHeaderBar();this._createSocialProfile();},_modifyHeaderBar:function(){var h=this.byId("timeline").getHeaderBar();h.removeAllContent();var G=this._createGroupSelector();h.insertContent(G,0);var o=new sap.m.ToolbarSpacer(this.createId("header_spacer"));h.insertContent(o,1);var f=this._createFilterButton();h.insertContent(f,2);var A=this._createAddPostButton();h.insertContent(A,3);},_createGroupSelector:function(){var G=new sap.m.Button(this.createId("groupSelect_button"),{icon:"sap-icon://slim-arrow-down",iconFirst:false,text:"{/groupSelected/Name}",width:"20em",enabled:"{/groupSelectorEnabled}",type:sap.m.ButtonType.Transparent,press:[this.onGroupSelectorButtonPress,this]});G.setModel(this._oViewDataModel);return G;},_createFilterButton:function(){if(!this.byId("filter_popover")){var o=sap.ui.xmlfragment("sap.collaboration.components.feed.fragments.CustomListItem",this);new a(this.createId("filter_popover"),{title:this._oLanguageBundle.getText("ST_FILTER_HEADER"),}).setModel(this._oViewDataModel).bindItems("/filter",o);}var f=new sap.m.Button(this.createId("filter_button"),{enabled:"{/filterEnabled}",visible:"{/filterEnabled}",icon:"sap-icon://filter",type:sap.m.ButtonType.Transparent,press:[function(){this.byId("filter_popover").openBy(this.byId("filter_button"));},this]}).setModel(this._oViewDataModel);return f;},_createAddPostButton:function(){if(this.byId("addPost_popover")===undefined){new sap.m.ResponsivePopover(this.createId("addPost_popover"),{placement:sap.m.PlacementType.Auto,title:this._oLanguageBundle.getText("ST_ADD_POST_TITLE"),contentWidth:"25rem",contentHeight:"10rem",content:new S(this.createId("social_TextArea"),{height:"10rem",width:"100%",liveChange:[function(e){e.getParameter("value").trim()!==""?this.byId("addPost_postButton").setEnabled(true):this.byId("addPost_postButton").setEnabled(false);},this],suggest:[this.onSuggest,this],afterSuggestionClose:[function(){this._oPendingRequests.loadingSuggestionsRequest&&this._oPendingRequests.loadingSuggestionsRequest.abort();},this]}),endButton:new sap.m.Button(this.createId("addPost_postButton"),{text:this._oLanguageBundle.getText("ST_ADD_POST_BUTTON"),enabled:false,press:[this.onAddPost,this],}),}).setInitialFocus(this.byId("social_TextArea"));if(!sap.ui.Device.system.phone){this.byId("addPost_popover").setBeginButton(new sap.m.Button(this.createId("addPost_atMentionButton"),{text:"@",press:[function(){this.byId("social_TextArea").atMentionsButtonPressed();},this]}));}}var A=new sap.m.Button(this.createId("addPost_button"),{enabled:"{/addPostButtonEnabled}",icon:"sap-icon://add",type:sap.m.ButtonType.Transparent,press:[function(){this.byId("addPost_popover").openBy(this.byId("addPost_button"));},this]});A.setModel(this._oViewDataModel);return A;},_clearTimeline:function(){var t=this.byId("timeline");t.destroyContent();},_createTimelineItem:function(f){var o=new sap.ui.model.json.JSONModel(f);var e=new F(this.createId(f.Id+"_embedded"),{"feedEntry":"{/}","serviceUrl":j,"expandCollapseClick":[function(){this.byId("timeline").adjustUI();},this],"atMentionClick":[this.onAtMentionClicked,this],"previewLoad":[function(h){this.byId('timeline').adjustUI();},this]});var r=new R(this.createId("replyPostPopover_"+f.Id),{socialTextArea:new S({height:"80px",width:"100%",suggestionPlacement:sap.m.PlacementType.Top,suggest:[this.onSuggest,this],afterSuggestionClose:[function(){this._oPendingRequests.loadingSuggestionsRequest&&this._oPendingRequests.loadingSuggestionsRequest.abort();},this]}),postReplyPress:[this.onPostReplyPress,this],moreRepliesPress:[function(E){var t=E.getSource().getParent();this._getReplies(undefined,t.getModel().getData().Replies.__next,t);},this],afterClose:[function(){if(this._oPendingRequests.loadingRepliesRequest){this._oPendingRequests.loadingRepliesRequest.abort();}this._bReplyPopoverIsOpen=false;},this]});r.getSocialTextArea().attachLiveChange(function(E){E.getParameter("value").trim()!==""?this.enableButton(true):this.enableButton(false);}.bind(r));var m=new sap.ui.core.CustomData({key:"1",value:this._oLanguageBundle.getText("ST_MORE_CUSTOM_ACTION")});var t=new T(this.createId(f.Id),{"dateTime":"{/CreatedAt}","userName":"{/Creator/FullName}","title":"{/Action}","text":"{/Text}","icon":"sap-icon://post","userNameClickable":this._oViewDataModel.getProperty("/enableSocial"),"userNameClicked":[this.onUserNameClicked,this],"userPicture":{path:"/Creator/Id",formatter:this._buildThumbnailImageURL.bind(this)},"replyCount":"{/RepliesCount}","embeddedControl":e,"customReply":r,"replyListOpen":[this.onReplyListOpen,this],"customAction":m,"customActionClicked":[this.onMoreClicked,this]});t.setModel(o);return t;},_addFeedEntriesToTimeline:function(f){var t=this.byId("timeline");f.forEach(function(o){var e=this._createTimelineItem(o);t.addContent(e);},this);},_processFeedEntries:function(f){if(f.length>0){this._addFeedEntriesToTimeline(f);}else{this._oViewDataModel.setProperty("/forceGrowing",false);}this._setTimelineToNotBusy();},_processAtMentions:function(){if(this._oPendingRequests.loadingFeedAtMentions&&this._oPendingRequests.loadingFeedAtMentions.state("pending")){this._oPendingRequests.loadingFeedAtMentions.abort();}var t=this;var p;var P={"async":true,"success":function(o,r){e.resolveWith(t,[o,r]);},"error":function(E){t._oLogger.error('Failed to retrieve the @mentions.');e.rejectWith(t,[E]);}};if(this._oAtMention.atMentionsNextLink){p="/"+this._oAtMention.atMentionsNextLink;P.urlParameters=this._extractUrlParams(decodeURIComponent(this._oAtMention.atMentionsNextLink));}else{p="/FeedEntries("+q.sap.encodeURL("'"+this._oAtMention.feedId+"'")+")/AtMentions";}var e=q.Deferred();e.done(function(o,r){t._oAtMention.atMentionsNextLink=o.__next;t._oAtMention.aAtMentions=t._oCommonUtil.getODataResult(o).concat(t._oAtMention.aAtMentions);if(t._oAtMention.atMentionsNextLink){t._processAtMentions();}else{var f={openingControl:t._oAtMention.oUserNameLink,memberId:t._oAtMention.aAtMentions[t._oAtMention.placeholderIndex].Email};t._oSocialProfile.setSettings(f);t._oSocialProfile.open();}});this._oPendingRequests.loadingFeedAtMentions=e.promise(this._oJamModel.read(p,P));},_createSocialProfile:function(){this._oSocialProfile=new sap.ui.getCore().createComponent("sap.collaboration.components.socialprofile");return this._oSocialProfile;},_setTimelineToBusy:function(){var t=this.byId("timeline");t.setBusyIndicatorDelay(0).setBusy(true);},_setTimelineToNotBusy:function(){var t=this.byId("timeline");t.setBusyIndicatorDelay(0).setBusy(false);},_showFeedUpdatesInTimeline:function(n){var t=this.byId("timeline");var m=t.getMessageStrip();if(n>0){if(!this.byId("refreshLink")){var r=new sap.m.Link(this.createId("refreshLink"),{text:this._oLanguageBundle.getText("GF_REFRESH_FEED"),press:[function(){var f=this._oViewDataModel.getProperty("/feedEndpoint");this._initialLoadFeedEntries(f);},this]});m.setLink(r);m.setType(sap.ui.core.MessageType.Information);m.setShowIcon(true);}n==1?m.setText(this._oLanguageBundle.getText("GF_NEW_FEED_UPDATE")):m.setText(this._oLanguageBundle.getText("GF_NEW_FEED_UPDATES",n));m.setVisible(true);t.rerender();}},_hideFeedUpdatesInTimeline:function(){var m=this.byId("timeline").getMessageStrip();m.close();},onGrow:function(e){if(!this._oPendingRequests.loadingFeedEntriesRequest||!this._oPendingRequests.loadingFeedEntriesRequest.state()!="pending"){var f=this._oViewDataModel.getProperty("/feedEndpoint");this._loadFeedEntries(f).done(this._loadFeedEntriesSuccess.bind(this));}},onGroupSelectorButtonPress:function(e){this._oMode.displayFeedSourceSelectorPopover(e.getSource());},onAddPost:function(e){this.byId("addPost_popover").close();this._getLoggedInUser();var f=this.byId("social_TextArea").convertTextWithFullNamesToEmailAliases();if(f&&f.trim()!==""){this._setTimelineToBusy();var h=function(k,r){this.byId("social_TextArea").clearText();this.byId("addPost_postButton").setEnabled(false);this._setTimelineToNotBusy();var l=this._oCommonUtil.getODataResult(k);l.Creator=this._mCurrentUser;var t=this._createTimelineItem(l);this.byId("timeline").insertContent(t,0);};var i=function(E){this._oLogger.error("Error occured when adding a post.",E.stack);};var A=this._oMode.addPost(f);this._oPostRequestData={"path":A.path,"payload":A.payload};this._oPostRequestData.parameters={success:h,error:i};var o=A.promise;o.then(h.bind(this),i.bind(this));}else{this._oLogger.info('Posting an empty comment is not allowed, no feed entry will be created.');}},onReplyListOpen:function(e){var o=e.getSource().getCustomReply();o.getTextArea().focus();if(!this._bReplyPopoverIsOpen){this._bReplyPopoverIsOpen=true;var t=e.getSource();var f=t.getModel().getProperty("/Id");this._getReplies(f,undefined,t);}},onPostReplyPress:function(e){var t=this;var v=e.getParameter("value");var o=e.getSource().getParent();var f=o.getCustomReply();var h=o.getModel().getData().Id;var p="/FeedEntries('"+q.sap.encodeURL(h)+"')/Replies";var i={"Text":v};this._getLoggedInUser();var P={"async":true,"success":function(k,r){f.getTextArea().clearText();f.enableButton(false);f.setBusy(false);var J=t._oCommonUtil.getODataResult(k);var l={"CreatedAt":t._oDateUtil.formatDateToString(J.CreatedAt),"Text":J.Text,"Creator":t._mCurrentUser};l.Creator.ThumbnailImage=t._buildThumbnailImageURL(t._mCurrentUser.Id);f.addReply(l);o.getModel().setProperty("/RepliesCount",o.getModel().getProperty("/RepliesCount")+1);},"error":function(E){t._oLogger.error("Failed to post reply: "+E.statusText,E.stack);}};f.getTextArea().focus();f.setBusyIndicatorDelay(0).setBusy(true);this._oPostRequestData={"path":p,"payload":i,"parameters":P};this._oJamModel.create(p,i,P);},onSuggest:function(e){var t=this;if(this._oPendingRequests.loadingSuggestionsRequest){this._oPendingRequests.loadingSuggestionsRequest.abort();}var o=e.getSource();var v=e.getParameter("value");if(v.trim()===""){o.showSuggestions([]);}else{var p="/Members_Autocomplete";var G=this._oViewDataModel.getProperty("/groupSelected/Id");var P={"async":true,"urlParameters":{"Query":"'"+v+"'","GroupId":"'"+G+"'","$top":"4"},"success":function(h,r){f.resolveWith(t,[h,r]);},"error":function(E){t._oLogger.error("Failed to get suggestions: "+E.statusText);f.rejectWith(t,[E]);}};var f=q.Deferred();f.done(function(h,r){var J=t._oCommonUtil.getODataResult(h);if(J.length===0){o.closeSuggestionPopover();}else{var k=[];var l=J.length;for(var i=0;i<l;i++){k.push({fullName:J[i].FullName,email:J[i].Email,userImage:t._buildThumbnailImageURL(J[i].Id)});}o.showSuggestions(k);}});this._oPendingRequests.loadingSuggestionsRequest=f.promise(this._oJamModel.read(p,P));}},onUserNameClicked:function(o){var t=o.getSource();var e=t.getModel();var f={openingControl:t._userNameLink,memberId:e.getProperty("/Creator/Email")};this._oSocialProfile.setSettings(f);this._oSocialProfile.open();},onMoreClicked:function(o){var f=o.getSource().getModel().getProperty("/WebURL");var e=o.getSource().getModel().getProperty("/Id");var h=o.getSource().getParent().getModel().getProperty("/groupSelected/Name");var i=o.getSource().getParent().getModel().getProperty("/groupSelected/WebURL");var m=this.byId(this.createId("moreListPopover_"+e));if(m===undefined){var k=new sap.m.List(this.createId("moreList_"+e),{});var G=new sap.m.Link(this.createId("groupNameLink_"+e),{text:this._oLanguageBundle.getText("ST_GROUP_NAME_LINK",h),target:"_blank",href:i,width:"15em"}).addStyleClass("sapCollaborationCustomLinkPadding");var l=new sap.m.CustomListItem(this.createId(e+"_groupNameLinkListItem"),{content:G});k.addItem(l);var n=new sap.m.Link(this.createId("feedEntryLink_"+e),{text:this._oLanguageBundle.getText("ST_FEED_ENTRY_LINK"),target:"_blank",href:f,width:"15em"}).addStyleClass("sapCollaborationCustomLinkPadding");var p=new sap.m.CustomListItem(this.createId("feedEntryLinkListItem_"+e),{content:n});k.addItem(p);var r=false;if(sap.ui.Device.system.phone){r=true;}m=new sap.m.ResponsivePopover(this.createId("moreListPopover_"+e),{content:k,showHeader:r,title:this._oLanguageBundle.getText("ST_MORE_CUSTOM_ACTION"),showCloseButton:true,placement:sap.m.PlacementType.VerticalPreferedBottom,contentWidth:"15em"});var t=function(){this.close();};G.attachPress(t.bind(m));n.attachPress(t.bind(m));}m.openBy(o.getParameter("linkObj"));},onAtMentionClicked:function(o){var f=o.getSource().getModel().getProperty("/Id");var u=o.getParameter("link");var p=u.getModel().getProperty("/placeholderIndex");this._oAtMention={"feedId":f,"oUserNameLink":u,"placeholderIndex":p,"aAtMentions":[],"atMentionsNextLink":undefined};this._processAtMentions();},_onFeedEndpointChange:function(e){var f=e.getSource().getValue();this._initialLoadFeedEntries(f);},_onFeedSourcesChange:function(e){var E;var f=e.getSource().getValue();if(Array.isArray(f)){f={mode:sap.collaboration.FeedType.GroupIds,data:f};}if(this._oMode){this._oMode.stop();}if(this._oCommonUtil.isString(f.mode)){if(this._oModes[f.mode]===undefined){this._oModes[f.mode]=c.getInstance().createMode(f.mode,this);}}else{E="The mode must be a string.";this.logError(E);this.byId("timeline").destroy();throw new Error(E);}this._oMode=this._oModes[f.mode];this._oMode.start(f.data);},_onFilterMessageChange:function(e){var t=e.getSource().getValue();this.byId("timeline").setCustomMessage(t);this.byId("timeline").rerender();},_onMetadataFailed:function(e){switch(e.oSource.sServiceUrl){case j:this._oLogger.error("Failed to load Jam metadata.");this._displayJamConnectionErrorMessage();break;case d:this._oLogger.error("Failed to load SMIv2 metadata.");this.displayErrorMessage();break;}this.disableGroupFeed();},_onJamRequestCompleted:function(e){var m=e.getParameter("method");if(e.success&&m==="POST"){this._oPendingRequests.refreshingSecurityToken=undefined;}},_onJamRequestFailed:function(e){this._setTimelineToNotBusy();var m=e.getParameter("method");var i=parseInt(e.getParameter("response").statusCode,10);var f=e.getParameter("feedEndpoint");if(!f){f=e.getParameter("url");}if(/ExternalObjects_FindByExidAndObjectType/.test(f)){this.disableGroupFeed();return;}switch(i){case 403:if(m==="POST"){if(this._oPendingRequests.refreshingSecurityToken===undefined){this._refreshSecurityToken().done(function(o,r){this._oJamModel.create(this._oPostRequestData.path,this._oPostRequestData.payload,this._oPostRequestData.parameters);});}else{this._oPendingRequests.refreshingSecurityToken=undefined;this.displayErrorMessage(this._oLanguageBundle.getText('JAM_NO_ACCESS_TO_POST_TO_GROUP'));}}else{this.displayErrorMessage(this._oLanguageBundle.getText('JAM_FORBIDDEN_ACCESS'));}break;case 404:if(/Groups\(.*\)\/FeedEntries/.test(f)){this.displayErrorMessage(this._oLanguageBundle.getText('JAM_NO_ACCESS_TO_GROUP'));this.disableGroupFeed();}else if(/Groups\(.*\)/.test(f)){this.displayErrorMessage(this._oLanguageBundle.getText('JAM_NO_ACCESS_TO_GROUP'));this.disableGroupFeed();}else if(/GroupExternalObject_FeedLatestCount|Group_FeedLatestCount/.test(f)){this._stopAutoCheckingForNewUpdates();}else{this.displayErrorMessage();}break;case 500:case 503:this._displayJamConnectionErrorMessage();break;default:this.displayErrorMessage();}},_onJamRequestSent:function(e){},_onBatchCompleted:function(e){this._oJamModel.setUseBatch(false);this._oMode.onBatchCompleted(e);},_onBatchFailed:function(e){},_onBatchSent:function(e){},_abortAllPendingRequests:function(){if(this._oPendingRequests.loadingFeedEntriesRequest){this._oPendingRequests.loadingFeedEntriesRequest.abort();}if(this._oPendingRequests.loadingRepliesRequest){this._oPendingRequests.loadingRepliesRequest.abort();}if(this._oPendingRequests.loadingSuggestionsRequest){this._oPendingRequests.loadingSuggestionsRequest.abort();}},isJamConfigured:function(){var o=this.getView().getModel("smi");if(this._bIsJamConfigured===undefined){var t=this;var p="/GetJamConfigurationStatus";var P={"async":false,"success":function(e,r){t._bIsJamConfigured=true;},"error":function(e){t._bIsJamConfigured=false;t._oLogger.error("Error in the Social Media Integration configuration for the connection to SAP Jam.");t.disableGroupFeed();}};o.read(p,P);}return this._bIsJamConfigured;},_refreshSecurityToken:function(){var t=this;var r=q.Deferred();return this._oPendingRequests.refreshingSecurityToken=r.promise(this._oJamModel.refreshSecurityToken(function(o,e){t._oLogger.info("Security token refreshed");r.resolveWith(t,[o,e]);},function(o){t._oLogger.error("Security token error: "+o.statusText);r.rejectWith([o],t);}));},_getLoggedInUser:function(){if(!this._mCurrentUser){var t=this;var p="/Self";var P={"success":function(o,r){t._mCurrentUser=t._oCommonUtil.getODataResult(o);},"error":function(e){t._oLogger.error('Failed to get the logged in user',e.stack);}};this._oJamModel.read(p,P);}},_loadFeedEntries:function(f){var e=undefined;if(!this.isJamConfigured()){return;}this._setTimelineToBusy();var n=this._oNextLinks.feedEntriesNextLink;if(n!==""){n=decodeURIComponent(n);e=this._extractUrlParams(n).$skiptoken;}return this._oPendingRequests.loadingFeedEntriesRequest=this._oMode.getFeedEntries(f,e);},_loadFeedEntriesSuccess:function(o,r){this._oNextLinks.feedEntriesNextLink=o.__next;var f=this._oCommonUtil.getODataResult(o);this._processFeedEntries(f);},_initialLoadFeedEntries:function(f){if(this._oPendingRequests.loadingFeedEntriesRequest){this._oPendingRequests.loadingFeedEntriesRequest.abort();}this._initializeRequestStateData();this._oViewDataModel.setProperty("/forceGrowing",true);this._hideFeedUpdatesInTimeline();this._stopAutoCheckingForNewUpdates();this._loadFeedEntries(f).done([this._clearTimeline.bind(this),this._loadFeedEntriesSuccess.bind(this),this._startAutoCheckingForNewUpdates.bind(this)]);},_getReplies:function(f,n,t){var e=this;var p;var P={"async":true,"urlParameters":{'$orderby':'CreatedAt desc','$expand':'Creator'},"success":function(i,r){e._oLogger.info("Replies were successfully retrieved.");h.resolveWith(e,[i,r]);},"error":function(E){e._oLogger.error("Failed to retrieve replies: "+E.statusText);h.rejectWith(e,[E]);}};var o=t.getCustomReply();if(n){p="/"+n;P.urlParameters=this._extractUrlParams(decodeURIComponent(n));P.urlParameters.$orderby=P.urlParameters.$orderby.replace("+"," ");}else{p="/FeedEntries('"+q.sap.encodeURL(f)+"')/Replies";}var h=q.Deferred();h.done(function(i,r){var k=e._oCommonUtil.getODataResult(i).reverse();k.forEach(function(l){l.Creator.ThumbnailImage=e._buildThumbnailImageURL(l.Creator.Id);l.CreatedAt=e._oDateUtil.formatDateToString(l.CreatedAt);});o.addReplies({data:k,more:i.__next?true:false});t.getModel().getData().Replies.__next=i.__next;}).always(function(){o.setBusy(false);}).fail(function(){o._oReplyPopover.close();});o.setBusyIndicatorDelay(0).setBusy(true);this._oPendingRequests.loadingRepliesRequest=h.promise(this._oJamModel.read(p,P));},logError:function(e){this._oLogger.error(e);},getModel:function(n){return this.getView().getModel(n);},getLanguageBundle:function(){return this._oLanguageBundle;},displayErrorMessage:function(e){var m=e||this._oLanguageBundle.getText("SYSTEM_ERROR_MESSAGEBOX_GENERAL_TEXT");M.error(m);},_displayJamConnectionErrorMessage:function(){var m=this._oLanguageBundle.getText("JAM_CONNECTION_ERROR_MESSAGEBOX_TEXT");M.error(m);},disableGroupFeed:function(){this._abortAllPendingRequests();var t=this.byId("timeline");if(!q.isEmptyObject(t)){t.setBusyIndicatorDelay(0).setBusy(false);this._clearTimeline();this._oViewDataModel.setProperty("/groupSelectorEnabled",false);this._oViewDataModel.setProperty("/addPostButtonEnabled",false);this._oViewDataModel.setProperty("/forceGrowing",false);}},enableGroupFeed:function(){var t=this.byId("timeline");if(!q.isEmptyObject(t)){t.setBusyIndicatorDelay(0).setBusy(false);this._oViewDataModel.setProperty("/groupSelectorEnabled",true);this._oViewDataModel.setProperty("/addPostButtonEnabled",true);this._oViewDataModel.setProperty("/forceGrowing",true);}},_startAutoCheckingForNewUpdates:function(){this._iNewFeedUpdatesCheckerTimeDelay=120000;this._sNewFeedUpdatesCheckerTimeoutId=q.sap.delayedCall(this._iNewFeedUpdatesCheckerTimeDelay,this,this._checkForNewFeedUpdates);},_stopAutoCheckingForNewUpdates:function(){q.sap.clearDelayedCall(this._sNewFeedUpdatesCheckerTimeoutId);},_checkForNewFeedUpdates:function(){var f=function(o,r){this._showFeedUpdatesInTimeline(o);this._sNewFeedUpdatesCheckerTimeoutId=q.sap.delayedCall(this._iNewFeedUpdatesCheckerTimeDelay,this,this._checkForNewFeedUpdates);};var e=function(E){this._oLogger.error("Failed to check for new feed updates.");this._sNewFeedUpdatesCheckerTimeoutId=q.sap.delayedCall(this._iNewFeedUpdatesCheckerTimeDelay,this,this._checkForNewFeedUpdates);};this._oMode.getFeedUpdatesLatestCount().done(f.bind(this)).fail(e.bind(this));},_extractUrlParams:function(u){var U=u.slice(u.indexOf("?")+1);var e=U.split("&");var m={};e.forEach(function(f){var i=f.indexOf("=");m[f.slice(0,i)]=f.slice(i+1);});return m;},_buildThumbnailImageURL:function(u){return this._oJamModel.sServiceUrl+"/Members('"+q.sap.encodeURL(u)+"')/ThumbnailImage/$value";}});return g;},true);
