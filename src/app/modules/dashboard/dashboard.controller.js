import nem from 'nem-sdk';

class DashboardCtrl {

    /**
     * Initialize dependencies and properties
     *
     * @params {services} - Angular services to inject
     */
    constructor(Wallet, Alert, $scope, $timeout, DataStore) {
        'ngInject';

        //// Module dependencies region ////

        this._Alert = Alert;
        this._Wallet = Wallet;
        this._$timeout = $timeout;
        this._DataStore = DataStore;

        //// End dependencies region ////

        //// Module properties region ////

        // Store blocks height as chart labels
        this.labels = [];

        // Store fee in blocks
        this.valuesInFee = [];

        // Indicate if chart is empty (no blocks with fee above 0 to show)
        this.chartEmpty = true;

        // Default tab on confirmed transactions
        this.tabConfirmed = true;

        // Current page for confirmed transactions pagination
        this.currentPage = 0;

        // Current page for unconfirmed transactions pagination
        this.currentPageUnc = 0;

        // Current page for harvested blocks pagination
        this.currentPageHb = 0;

        // Page size for all paginated elements
        this.pageSize = 5;

        //// End properties region ////

        /**
         * Watch harvested blocks in DataStore service for the chart
         */
        $scope.$watch(() => this._DataStore.account.harvesting.blocks, (val) => {
            if (!val) return;
            this.labels = [];
            this.valuesInFee = [];
            for (let i = 0; i < val.length; ++i) {
                // If fee > 0 we push the block as label and the fee as data for the chart
                if (val[i].totalFee / 1000000 > 0) {
                    this.labels.push(val[i].height)
                    this.valuesInFee.push(val[i].totalFee / 1000000);
                }
            }
            // If nothing above 0 XEM show message
            if (!this.valuesInFee.length) {
                this.chartEmpty = true;
            } else {
                this.chartEmpty = false;
            }
        });
    }

}

export default DashboardCtrl;