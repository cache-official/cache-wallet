import Languages from '../utils/languages';

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

    //// Module methods region ////

    /**
     * Delete current wallet stored in Wallet service and redirect to home logged out
     */
    logout() {
        // Redirect to home
        this._$location.path('/');
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