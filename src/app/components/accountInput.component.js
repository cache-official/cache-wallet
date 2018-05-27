import nem from "nem-sdk";

class AccountInputCtrl {

    /**
     * Initialize dependencies and properties
     *
     * @params {services} - Angular services to inject
     */
    constructor($timeout, Wallet, Recipient, $state, $scope) {
        'ngInject';

        // Initialize when component is ready
        this.$onInit = () => {

            //// Component dependencies region ////

            this._$timeout = $timeout;
            this._Wallet = Wallet;
            this._Recipient = Recipient;

            //// End dependencies region ////

            //// Component properties region ///

            // The account bound to the input
            this.accountView = this.account || "";
            // The alias
            this.alias  = "";
            // Show / Hide contact list
            this.showContacts = false;
            // Show title of input according to current page
            this.isCosignatory = $state.router.globals.current.name === 'app.transferTransaction' ? false : true;

            //// End properties region ////

            // If an account is pre-set, we get it's data
            if (this.account) this.processInput(false);

            // Watch account binding
            $scope.$watch(() => this.account, (val) => {
                if (!val) {
                    this.resetData();
                    this.accountView = "";
                }
            }, true);
        }

    }

    //// Component methods region ////

    /**
     * Process input and get account data from network
     *
     * @param {boolean} isAlias - True is is alias, false otherwise
     */
    processInput(isAlias) {
        this.resetData();
        // Get alias data
        if (isAlias) return this._Recipient.getAlias(this.accountView).then((res) => {
            this._$timeout(() => {
                return this.setData(res);
            });
        }, (err) => {
            this._$timeout(() => { 
                return this.resetData();
            });
        });
        // Get account data if address length is okay
        if (this.accountView.length === 40 || this.accountView.length === 46) return this._Recipient.getAccount(this.accountView).then((res) => {
            this._$timeout(() => {
                return this.setData(res);
            });
        }, (err) => { 
            this._$timeout(() => {
                return this.resetData();
            });
        });
    }

    /**
     * Set data received from Recipient service
     *
     * @param {object} - An [AccountInfo]{@link http://bob.nem.ninja/docs/#accountInfo} object
     */
    setData(data) {
        // Arrange for alias
        if (this.isAlias(this.accountView)) {
            this.alias = this.accountView.substring(1);
        }
        this.accountView = data.account.address;
        // Store account public key
        this.publicKey = data.account.publicKey;
        // Store clean address
        this.account = data.account.address;
        return;
    }

    /**
     * Reset data stored for account
     */
    resetData() {
        this.alias = "";
        this.publicKey = "";
        this.account = "";
        return;
    }

    /**
     * Show / Hide address book <select> and clean data
     */
    showHideAddressBook() {
        this.showContacts = this.showContacts ? this.showContacts = false : this.showContacts = true;
        this.accountView = undefined;
        this.resetData();
    }

    /**
     * Check if an input is an alias
     *
     * @param {string} input - A text string to check
     *
     * @return {boolean} - True if alias, false otherwise
     */
    isAlias(input) {
        if (!input) return false;
        return input.lastIndexOf("@", 0) === 0;
    }

    /**
     * Validate account input
     */
    isValid(input) {
        if (!input) return true;
        if (this.isAlias(input)) return true;
        if (input.length !== 40 && input.length !== 46) return false;
        if (!nem.model.address.isValid(input)) return false;
        if (!nem.model.address.isFromNetwork(input, this._Wallet.network)) return false;
        return true;
    }

    //// End methods region ////

}

// AccountInput config
let AccountInput = {
    controller: AccountInputCtrl,
    templateUrl: 'layout/partials/accountInput.html',
    bindings: {
        account: '=account',
        publicKey: '=publicKey'
    }
};

export default AccountInput;