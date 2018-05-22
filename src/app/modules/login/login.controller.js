import nem from 'nem-sdk';

class LoginCtrl {

    /**
     * Initialize dependencies and properties
     *
     * @params {services} - Angular services to inject
     */
    constructor($localStorage, Wallet, Login, $timeout) {
        'ngInject';

        //// Module dependencies region ////

        this._storage = $localStorage;
        this._Wallet = Wallet;
        this._Login = Login;
        this._$timeout = $timeout;

        //// End dependencies region ////

        //// Module properties region ////

        // Selected wallet
        this.selectedWallet = undefined;

        // Get wallets from local storage or set an empty array
        this._storage.wallets = this._storage.wallets || [];

        // Common object to contain our password & private key data.
        this.common = nem.model.objects.get("common");

        //// End properties region ////

        // Hide trezor button if using chrome builds
        if (typeof nw !== 'undefined') this.hideTrezor = true;
    }

    //// Module methods region ////

    /**
     * Load a wallet in browser local storage
     *
     * @param {string} data - Base 64 string from .wlt file
     * @param {boolean} isNCC - True if NCC wallet, false otherwise
     */
    loadWallet(data, isNCC) {
        this._Wallet.load(data, isNCC);
        return;
    }

    /**
     * Log into the application if no need to upgrade
     *
     * @param {object} wallet - A wallet object
     */
    login(wallet) {
        // Check if wallet needs upgrade
        if (this._Wallet.needsUpgrade(wallet)) {
            this.needsUpgrade = true;
            return;
        }

        if (this._Login.login(this.common, wallet)) {
            // Clean common object
            this.common = nem.model.objects.get("common");
        }
    }

    /**
     * Derive a child account using bip32 for each accounts of the selected wallet
     */
    upgradeWallet() {
        // Lock button
        this.okPressed = true;
        // Upgrade
        return this._Wallet.upgrade(this.common, this.selectedWallet).then(()=> {
            this._$timeout(() => {
                // Unlock button
                this.okPressed = false;
                // Clean common object
                this.common = nem.model.objects.get("common");
                // Prepare wallet download link
                this._Wallet.prepareDownload(this.selectedWallet);
                // Store base64 format for safety protocol
                this.rawWallet = this._Wallet.base64Encode(this.selectedWallet);
                //
                this.needsUpgrade = false;
                this.showSafetyMeasure = true;
            });
        }, 
        (err) => {
            this._$timeout(() => {
                // Unlock button
                this.okPressed = false;
                // Clean common object
                this.common = nem.model.objects.get("common");
            });
        })
    }

    //// End methods region ////

}

export default LoginCtrl;
