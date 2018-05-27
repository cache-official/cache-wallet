import nem from 'nem-sdk';
import Helpers from '../../../utils/helpers';

class ApostilleHistoryCtrl {

    /**
     * Initialize dependencies and properties
     *
     * @params {services} - Angular services to inject
     */
    constructor(Wallet, Alert, Nty) {
        'ngInject';

        //// Module dependencies region ////

        this._Wallet = Wallet;
        this._Alert = Alert;
        this._Nty = Nty;

        //// End dependencies region ////

        //// Module properties region ////

        // Get sink depending of network
        this.sink = nem.model.sinks.apostille[this._Wallet.network].toUpperCase().replace(/-/g, '');

        // User's apostilles pagination properties
        this.currentPage = 0;
        this.pageSize = 5;

        //// End properties region ////

        // Load nty Data from local storage if any
        this._Nty.set();
    }

    //// Module methods region ////

    /**
     * Trigger file uploading for nty
     */
    uploadNty() {
        document.getElementById("uploadNty").click();
    }

    /**
     * Save nty in Wallet service and local storage
     */
    loadNty($fileContent) {
        this._Nty.setInLocalStorage(JSON.parse($fileContent));
        if (this._Wallet.ntyData !== undefined) {
            this._Alert.ntyFileSuccess();
        }
    }

    /**
     * Trigger download of the nty file
     */
    download() {
        if (this._Wallet.ntyData !== undefined) {
            // Wallet object string to word array
            let wordArray = nem.crypto.js.enc.Utf8.parse(angular.toJson(this._Wallet.ntyData));
            // Word array to base64
            let base64 = nem.crypto.js.enc.Base64.stringify(wordArray);
            // Set download element attributes
            $("#downloadNty").attr('href', 'data:plain/text,' + angular.toJson(this._Wallet.ntyData));
            $("#downloadNty").attr('download', "Nty-file-" + Helpers.toShortDate(new Date()) + ".nty");
            // Simulate click to trigger download
            document.getElementById("downloadNty").click();
        }
    }

    /**
     * Purge nty data from local storage
     */
    purge() {
        return this._Nty.purgeLocalStorage();
    }

    //// End methods region ////

}

export default ApostilleHistoryCtrl;