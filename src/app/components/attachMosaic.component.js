import nem from "nem-sdk";
import Helpers from "../utils/helpers";

class AttachMosaicCtrl {

    /**
     * Initialize dependencies and properties
     *
     * @params {services} - Angular services to inject
     */
    constructor($filter, $timeout, Wallet, DataStore) {
        'ngInject';

        // Initialize when component is ready
        this.$onInit = () => {

            //// Component dependencies region ////

            this._$filter = $filter;
            this._Helpers = Helpers;
            this._$timeout = $timeout;
            this._Wallet = Wallet;
            this._DataStore = DataStore;

            //// End dependencies region ////

            //// Component properties region ///

           this.counter = 0;
           this.mosaicsMetaData = this._DataStore.mosaic.metaData;

            //// End properties region ////

        }

    }

    //// Component methods region ////

    /**
     * Get selected mosaic and push it in mosaics array
     */
    attachMosaic() {
        // increment counter 
        this.counter++;
        // Get current account
        let acct = this.formData.isMultisig ? this.formData.multisigAccount.address : this._Wallet.currentAccount.address;

        // Get the data of selected mosaic
        let mosaic = this._DataStore.mosaic.ownedBy[acct][this.selectedMosaic];

        // Check if mosaic already present in mosaics array
        let elem = $.grep(this.formData.mosaics, function(w) {
            return nem.utils.format.mosaicIdToName(mosaic.mosaicId) === nem.utils.format.mosaicIdToName(w.mosaicId);
        });

        // If not present, update the array
        if (elem.length === 0) {
            this.formData.mosaics.push({
                'mosaicId': mosaic['mosaicId'],
                'quantity': 0,
                'gid': 'mos_id_' + this.counter
            });
            // Update fee
            this.updateCtrl();
        }
    }

    /**
     * Remove a mosaic from mosaics array
     * 
     * @param {number} index - Index of the mosaic object in the array 
     */
    removeMosaic(index) {
        this.formData.mosaics.splice(index, 1);
        // Update the fee
        this.updateCtrl();
        return;
    }

    /**
     * Return an array of sorted keys
     * 
     * @param {object} obj - An object of objects with a key
     *
     * @return {array} keys - An array of sorted keys or default array
     */
    toSortedKeys(obj) {
        let keys = Object.keys(obj).sort(); 
        if (!keys.length) return ["nem:xem"];
        return keys;
    }

    //// End methods region ////

}

// AttachMosaic config
let AttachMosaic = {
    controller: AttachMosaicCtrl,
    templateUrl: 'layout/partials/attachMosaic.html',
    bindings: {
        formData: '=formData',
        selectedMosaic: '=selectedMosaic',
        accountMosaics: '=accountMosaics',
        updateCtrl: '&'
    }
};

export default AttachMosaic;