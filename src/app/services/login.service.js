import nem from 'nem-sdk';

/** Service storing Login utility functions. */
class Login {

    /**
     * Initialize dependencies and properties
     *
     * @params {services} - Angular services to inject
     */
    constructor($location, Wallet, DataBridge) {
        'ngInject';

        // Service dependencies region //

        this._location = $location;
        this._Wallet = Wallet;
        this._DataBridge = DataBridge;

        // End dependencies region //

        // Service properties region //

        // End properties region //
    }

    // Service methods region //

    /**
     * Log into the application
     *
     * @param {object} common - A common object
     * @param {object} wallet - A wallet object
     */
    login(common, wallet) {
        // Set wallet to use and connect
        if (!this._Wallet.login(common, wallet)) {
            return false;
        }

        // Connect to node
        this._DataBridge.connect();
        // Redirect to dashboard
        this._location.path('/dashboard');

        return true;
    }

    // End methods region //

}

export default Login;