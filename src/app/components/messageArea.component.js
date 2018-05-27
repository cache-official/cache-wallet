import nem from "nem-sdk";
import Helpers from "../utils/helpers";

class MessageAreaCtrl {

    /**
     * Initialize dependencies and properties
     *
     * @params {services} - Angular services to inject
     */
    constructor($filter, $timeout) {
        'ngInject';

        // Initialize when component is ready
        this.$onInit = () => {

            //// Component dependencies region ////

            this._$filter = $filter;
            this._Helpers = Helpers;
            this._$timeout = $timeout;

            //// End dependencies region ////

            //// Component properties region ///

            this.messagePayload = "";
            // Get the message types
            this.messageTypes = this.translateMessageTypes(nem.model.objects.get("messageTypes"));
            // Create dummy common
            this.common = nem.model.objects.create("common")("", nem.utils.helpers.fixPrivateKey(""));

            //// End properties region ////

            this.updateCharactersLeft();
        }

    }

    //// Component methods region ////

    /**
     * Update the number of characters left for message
     */
    updateCharactersLeft() {
        this._$timeout(() => {
            let total = this.messageType === 0 ? 2048 : 1024;
            let div = this.messageType === 0 ? 1 : 2;
            this.messagePayload = this.message.length ? nem.model.transactions.prepareMessage(this.common, { 
                messageType: this.messageType, 
                recipientPublicKey: nem.crypto.keyPair.create(this.common.privateKey).publicKey.toString(),
                message: this.message
            }) : {
                payload: "" 
            };
            this.charactersLeft = this.messagePayload.payload.length ? total - (this.messagePayload.payload.length / div) : total;
            this.updateCtrl();
        });
    }

    /**
     * Translate message types from nem-sdk
     *
     * @param {array} array - A message types array
     */
    translateMessageTypes(array) {
        array[2].name = this._$filter("translate")("GENERAL_ENCRYPTED");
        array[1].name = this._$filter("translate")("GENERAL_UNENCRYPTED");
        array[0].name = this._$filter("translate")("GENERAL_HEXADECIMAL");
        return array;
    }

    //// End methods region ////

}

// MessageArea config
let MessageArea = {
    controller: MessageAreaCtrl,
    templateUrl: 'layout/partials/messageArea.html',
    bindings: {
        message: '=message',
        messageType: '=messageType',
        charactersLeft: '=charactersLeft',
        updateCtrl: '&'

    }
};

export default MessageArea;