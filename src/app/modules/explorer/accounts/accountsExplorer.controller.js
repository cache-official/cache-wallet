import nem from 'nem-sdk';

class AccountsExplorerCtrl {

    /**
     * Initialize dependencies and properties
     *
     * @params {services} - Angular services to inject
     */
    constructor(Wallet, Alert, $stateParams, $filter, $timeout) {
        'ngInject';

        //// Module dependencies region ////

        this._Wallet = Wallet;
        this._Alert = Alert;
        this._$stateParams = $stateParams;
        this._$filter = $filter;
        this._$timeout = $timeout;

        //// End dependencies region ////

        //// Module properties region ////

        this.rawInput = this._$stateParams.address;
        this.account = "";
        this.accountData = {};
        this.mosaicDefinitionMetaDataPair = {};
        this.transactions = [];

        // Transactions pagination
        this.currentPage = 0;
        this.pageSize = 5;

        //// End properties region ////

        if (this.rawInput.length) this.processRawInput();
    }

    //// Module methods region ////

    /**
     * Process user input
     */
    processRawInput() {
        // Check if value is an alias
        let isAlias = (this.rawInput.lastIndexOf("@", 0) === 0);

        // Return if no value or address is invalid AND it's not an alias
        if (!this.rawInput || !nem.model.address.isValid(this.rawInput) && !isAlias) return;

        // Get recipient data depending of address or alias used
        if (isAlias) {
            // Clean namespace name
            let nsForLookup = this.rawInput.substring(1);
            // Get cosignatory account data from network using @alias
            this.getAccountDataFromAlias(nsForLookup);
        } else {
            // Clean provided address
            let account = this.rawInput.toUpperCase().replace(/-/g, '');
            // Check if address is from network
            if (nem.model.address.isFromNetwork(account, this._Wallet.network)) {
                // Get account data from network
                this.getAccountData(account);
            } else {
                this._Alert.invalidAddressForNetwork(account, this._Wallet.network);
                return;
            }
        }
    }

    /**
     * Get the account data using @alias
     * 
     * @param {string} alias - An alias (@namespace)
     */
    getAccountDataFromAlias(alias) {
        return nem.com.requests.namespace.info(this._Wallet.node, alias).then((data) => {
            this._$timeout(() => {
                // Check if address is from network
                if (nem.model.address.isFromNetwork(data.owner, this._Wallet.network)) {
                    // Get recipient account data from network
                    this.getAccountData(data.owner);
                } else {
                    this._Alert.invalidAddressForNetwork(data.owner, this._Wallet.network);
                    return;
                }
            });
        },
        (err) => {
            this._$timeout(() => {
                this._Alert.getNamespacesByIdError(err.data.message);
            });
        });
    }

    /**
     * Get the account data
     * 
     * @param {string} address - An account address
     */
    getAccountData(address) {
        return nem.com.requests.account.data(this._Wallet.node, address).then((data) => {
            this._$timeout(() => {
                this.accountData = data;
                if (data.account.publicKey === null) {
                    this.accountData.account.publicKey = this._$filter("translate")("GENERAL_UNKNOWN");
                }
                this.getMosaicsDefinitions(data.account.address);
            });
        },
        (err) => {
            this._$timeout(() => {
                this._Alert.getAccountDataError(err.data.message);
            });
        });
    }

    /**
     * Get the account incoming transactions
     * 
     * @param {string|null} hash - The hash up to which transactions are returned, first 25 if null
     */
    getAllTransactions(hash) {
        return nem.com.requests.account.transactions.all(this._Wallet.node, this.accountData.account.address, hash).then((data) => {
            this._$timeout(() => {
                this.transactions = data.data;
            });
        }, 
        (err) => {
            this._$timeout(() => {
                this._Alert.errorGetTransactions(err.data.message);
            });
        });
    }

    /**
     *  Get mosaics definitions of an account
     *
     * @param {string} address - An account address
     */
    getMosaicsDefinitions(address) {
        return nem.com.requests.account.mosaics.allDefinitions(this._Wallet.node, address).then((res) => {
            this._$timeout(() => {
                if(res.data.length) {
                    for (let i = 0; i < res.data.length; ++i) {
                        this.mosaicDefinitionMetaDataPair[nem.utils.format.mosaicIdToName(res.data[i].id)] = {};
                        this.mosaicDefinitionMetaDataPair[nem.utils.format.mosaicIdToName(res.data[i].id)].mosaicDefinition = res.data[i];
                    }
                    this.getAllTransactions(null);
                }
            });
        }, 
        (err) => {
            this._$timeout(() => {
                this._Alert.errorGetMosaicsDefintions(err.data.message);
            });
        });
    }

    //// End methods region ////
}

export default AccountsExplorerCtrl;