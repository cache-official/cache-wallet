import Helpers from '../../utils/helpers';

class PortalCtrl {

    /**
     * Initialize dependencies and properties
     *
     * @params {services} - Angular services to inject
     */
    constructor(Wallet, DataStore) {
        'ngInject';

        //// Module dependencies region ////

        this._Wallet = Wallet;
        this._DataStore = DataStore;
        this._Helpers = Helpers;

        //// End dependencies region ////
    }

}

export default PortalCtrl;