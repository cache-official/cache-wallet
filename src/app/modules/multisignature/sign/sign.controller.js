import nem from 'nem-sdk';

class SignMultisigCtrl {

    /**
     * Initialize dependencies and properties
     *
     * @params {services} - Angular services to inject
     */
    constructor(Wallet, Alert, $timeout) {
        'ngInject';

        //// Module dependencies region ////

        this._Alert = Alert;
        this._Wallet = Wallet;
        this._$timeout = $timeout;

        //// End dependencies region ////

        //// Module properties region ////

        // Store unconfirmed txes
        this.unconfirmed = [];

        // Unconfirmed txes pagination properties
        this.currentPage = 0;
        this.pageSize = 5;

        //// End properties region ////

        // Get unconfirmed transactions
        this.getUnconfirmedTransactions();

    }

    //// Module methods region ////

    /**
     * Fetch unconfirmed transactions for the current account
     */
    getUnconfirmedTransactions() {
        // Reset to initial page
        this.currentPage = 0;
        // 
        nem.com.requests.account.transactions.unconfirmed(this._Wallet.node, this._Wallet.currentAccount.address).then((res) => {
            this._$timeout(() => {
                this.unconfirmed = res.data;
                for (let i = 0; i < res.data.length; i++) {
                    this.unconfirmed[i].meta.innerHash = {
                        "data": res.data[i].meta.data
                    }
                    this.unconfirmed[i].meta.height = 9007199254740991;
                }
            });
        },
        (err) => {
            this._$timeout(() => {
                if(err.code < 0) {
                    this._Alert.connectionError();
                }  else {
                    this._Alert.errorGetTransactions(err.data.message);
                }
            });
        });
    }

    //// End methods region ////

}

export default SignMultisigCtrl;