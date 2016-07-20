/*!
 * @copyright@
 */

/*************************************************************
* Message queue utility class to manager user messages
* 
**************************************************************/

jQuery.sap.require("sap.m.MessageBox");
jQuery.sap.require("sap.m.MessageToast");

jQuery.sap.declare("sap.collaboration.components.utils.MessageQueueUtil");

sap.ui.base.Object.extend("sap.collaboration.components.utils.MessageQueueUtil",{
	
	/* Constants for MessageQueueUtil class*/
	messageTypes: {
		messageToast : "MToast",
		messageBox : "MBox"
	},
	
	/*Queue to hold messages*/
	aMessageQueue: [],

	/**
	 * Adds the message to the queue and checks if this is the only message in the queue. If so, then the message is displayed immediately.
	 * The method afterMessageClose() is attached to oOptions and passed to the options parameter in the message. If there is more than 1 message in the queue,
	 * it is displayed only after the previous message is completed. This check is done in the afterMessageClose() method.
	 * @public
	 */
	displayMessage: function(sMessage, oOptions, sTypeOfMessage) {
		var oLocalOptions = oOptions;
		
		oLocalOptions.onClose = this.afterMessageClose();
		
		this.addMessageToQueue(sMessage, oLocalOptions, sTypeOfMessage);
		
		if(this.aMessageQueue.length == 1){
			if(this.aMessageQueue[0].type == this.messageTypes.messageBox){
				sap.m.MessageBox.show(this.aMessageQueue[0].message, this.aMessageQueue[0].options);
			}
			else if(this.aMessageQueue[0].type == this.messageTypes.messageToast){
				sap.m.MessageToast.show(this.aMessageQueue[0].message, this.aMessageQueue[0].options);
			}
		}
	},
	
	/**
	 * Add message to the queue
	 * @private
	 */
	addMessageToQueue: function(sMessage, oLocalOptions, sTypeOfMessage){
		this.aMessageQueue.push({message: sMessage, options: oLocalOptions, type: sTypeOfMessage});
	},
	
	/**
	 * Method to be executed after the message is closed. This method is attached to oOptions and passed to the message.
	 * It checks if there are messages in the queue and if so, then displays the message. This only occurs after the previous message is closed.
	 * @private
	 */
	afterMessageClose: function(){
		var self = this;
		return function(){
			self.aMessageQueue.shift();
		
			if(self.aMessageQueue.length != 0){
				if(self.aMessageQueue[0].type == self.messageTypes.messageBox){
					sap.m.MessageBox.show(self.aMessageQueue[0].message, self.aMessageQueue[0].options);
				}
				else if(self.aMessageQueue[0].type == self.messageTypes.messageToast){
					sap.m.MessageToast.show(self.aMessageQueue[0].message, self.aMessageQueue[0].options);
				}
			}
		};
	}
});