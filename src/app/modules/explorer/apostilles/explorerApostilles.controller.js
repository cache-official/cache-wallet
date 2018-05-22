import nem from 'nem-sdk';

class ExplorerApostillesCtrl {

    /**
     * Initialize dependencies and properties
     *
     * @params {services} - Angular services to inject
     */
    constructor(Wallet, Alert, $timeout) {
        'ngInject';

        //// Module dependencies region ////

        this._Wallet = Wallet;
        this._Alert = Alert;
        this._$timeout = $timeout;

        //// End dependencies region ////

        //// Module properties region ////

        // Store sink transactions
        this.sinkData = [];

        // Apostilles pagination properties
        this.currentPage = 0;
        this.pageSize = 5;

        //// End properties region ////

        // Get incoming transactions of the sink account
        this.getSinkTransactions();
    }

    //// Module methods region ////

    /**
     * Get incoming transaction of the sink account
     */
    getSinkTransactions() {
        // Get sink depending of network
        let sink = nem.model.sinks.apostille[this._Wallet.network].toUpperCase().replace(/-/g, '');
        return nem.com.requests.account.transactions.incoming(this._Wallet.node, sink).then((data) => {
            this._$timeout(() => {
                this.sinkData = this.cleanApostilles(data.data);
            });
        }, 
        (err) => {
            this._$timeout(() => {
                this._Alert.errorFetchingIncomingTxes(err.data.message);
            });
        });
    }

    /**
     * Keep only HEX messages in transaction array
     *
     * @param {array} array - An array of transactions
     *
     * @return {object} result - An array of transactions with HEX messages
     */
    cleanApostilles(array) {
        let result = [];
        let checksum = "fe4e5459";
        if(array.length) {
            for (let i = 0; i < array.length; i++){
                if(array[i].transaction.type === 257) {
                    if(!array[i].transaction.message || !array[i].transaction.message.payload || array[i].transaction.message.payload.substring(0, 8) !== checksum) {
                        //console.log("Not an apostille message")
                    } else {
                        result.push(array[i])
                    }
                } else if(array[i].transaction.type === 4100) {
                    if(!array[i].transaction.otherTrans.message|| !array[i].transaction.otherTrans.message.payload || array[i].transaction.otherTrans.message.payload.substring(0, 8) !== checksum) {
                        //console.log("Not an apostille message")
                    } else {
                      result.push(array[i])
                    }
                }
                if(i === array.length - 1) {
                  return result;
                }
            }
        }
    }

    //// End methods region ////
}

export default ExplorerApostillesCtrl;