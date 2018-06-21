import Languages from '../utils/languages';
import {Actions} from '../services/actions';
const shell = window.require('electron').remote.shell;

class AppHeaderCtrl {

    /**
     * Initialize dependencies and properties
     *
     * @params {services} - Angular services to inject
     */
    constructor(Alert, $localStorage, $translate, Wallet, $location, DataBridge, DataStore) {
        'ngInject';
        //// Module dependencies region ////
        this._storage = $localStorage;
        this._Alert = Alert;
        this._$translate = $translate;
        this._Wallet = Wallet;
        this._DataBridge = DataBridge;
        this._$location = $location;
        this._DataStore = DataStore;

        //// End dependencies region ////

        //// Module properties region ////

        // Available languages
        this.languages = Languages.data;

        //// End properties region ////

        /**
         * Fix dropdown closing if click on select
         */
        $(document).on('click', '.navbar .container-fluid li .dropdown-menu', function(e) {
            e.stopPropagation();
        });

    }

    getCacheBalance() {
        if (this._DataStore.account.metaData === undefined) { return 0; }
        let address = this._DataStore.account.metaData.account.address;
        if (undefined === this._DataStore.mosaic.ownedBy[address]) return;
        if (undefined === this._DataStore.mosaic.ownedBy[address]['cache:cache']) {
            return 0
        }
        Actions.setCurrentAddress(address.substr(address.length - 4));
        let supply = this._DataStore.mosaic.ownedBy[address]['cache:cache'].quantity;
        return supply / 1000000;
    }

    openWebsite(url) {
        shell.openExternal(url);
    }

    //// Module methods region ////

    /**
     * Delete current wallet stored in Wallet service and redirect to home logged out
     */
    logout() {
        // Redirect to home
        this._$location.path('/login');
        // Close connector
        this._DataBridge.connector.close();
        // Set connection status to false
        this._DataStore.connection.status = false;
        // Show success alert
        this._Alert.successLogout();
        // Reset data in DataBridge service
        this._DataBridge.reset();
        // Reset data in Wallet service
        this._Wallet.reset();
        Actions.setLoginStatus(false);
        return;
    }

    /**
     * Change language
     *
     * @param {string} key - The language key
     */
    changeLanguage(key) {
        this._$translate.use(key.toString());
        this._storage.lang = key.toString();
        return;
    };

    //// End methods region ////

}

// Header config
let AppHeader = {
    controller: AppHeaderCtrl,
    templateUrl: 'layout/header.html'
};

export default AppHeader;