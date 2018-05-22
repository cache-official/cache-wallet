import nem from "nem-sdk";
import Helpers from '../utils/helpers';

class MarketDataCtrl {

    /**
     * Initialize dependencies and properties
     *
     * @params {services} - Angular services to inject
     */
    constructor(DataStore, Alert, $timeout, $scope) {
        'ngInject';

        //// Component dependencies region ////
        
        this._DataStore = DataStore;
        this._Alert = Alert;
        this._$timeout = $timeout;
        this._Helpers = Helpers;

        //// End dependencies region ////

        this.selectedMarket = this._DataStore.market.selected;

        //// Component properties region ////

         //// End properties region ////

        // Watch selected market
        $scope.$watch(() => this._DataStore.market.selected, (val) => {
            if (!val) return;
            this.selectedMarket = (val === 'XEM' || val === 'BTC') ? 'USD' : val;
        });

    }

    //// Component methods region ////

	/**
	 * Refresh market information
	 */
	refreshMarketInfo() {
	    // Gets btc-xem market
	    nem.com.requests.market.xem().then((data) => {
	        this._$timeout(() => {
	            this._DataStore.market.xem = data["BTC_XEM"];
	        });
	    },
	    (err) => {
	        this._$timeout(() => {
	            this._Alert.errorGetMarketInfo(); 
	        });
	    });
	    // Gets btc-usd market
	    nem.com.requests.market.btc().then((data) => {
	        this._$timeout(() => {
	            this._DataStore.market.btc = data;
	        });
	     },
	    (err) => {
	        this._$timeout(() => {
	            this._Alert.errorGetBtcPrice();
	        });
	    });
	}

    //// End methods region ////

}

// MarketData config
let MarketData = {
    controller: MarketDataCtrl,
    templateUrl: 'layout/partials/marketData.html'
};

export default MarketData;