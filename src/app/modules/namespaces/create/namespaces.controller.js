import nem from 'nem-sdk';
import Helpers from '../../../utils/helpers';

class NamespacesCtrl {

    /**
     * Initialize dependencies and properties
     *
     * @params {services} - Angular services to inject
     */
    constructor(Wallet, Alert, DataStore, $filter, $timeout) {
        'ngInject';

        //// Module dependencies region ////

        this._Alert = Alert;
        this._Wallet = Wallet;
        this._DataStore = DataStore;
        this._$filter = $filter;
        this._$timeout = $timeout;

        //// End dependencies region ////
        
        // Initialization
        this.init();
    }

    //// Module methods region ////

    /**
     * Initialize module properties
     */
    init() {
        // Form is a namespace provision transaction object 
        this.formData = nem.model.objects.get("namespaceProvisionTransaction");
        // Sink account for view
        this.formData.rentalFeeSink = nem.model.sinks.namespace[this._Wallet.network];
        // Set first multisig account if any
        this.formData.multisigAccount = this._DataStore.account.metaData.meta.cosignatoryOf.length == 0 ? '' : this._DataStore.account.metaData.meta.cosignatoryOf[0];
        // Prevent user to click twice on send when already processing
        this.okPressed = false;
        // Object to contain our password & private key data.
        this.common = nem.model.objects.get("common");
        // Default namespaces owned
        this.namespaceOwned = this._DataStore.namespace.ownedBy[this._Wallet.currentAccount.address];
        // Store the prepared transaction
        this.preparedTransaction = {};
        // Update current account namespace
        this.updateCurrentAccountNS();
        // Update the fee in view
        this.prepareTransaction();
    }

    /**
     * Check if a namespace id is level 3
     *
     * @param {object} elem - The element to check
     *
     * @return {boolean} - True if element is not a namespace level 3, false otherwise
     */
    isNotLevel3(elem) {
        return elem.fqn.split('.').length < 3;
    };

    /**
     * Set name to lowercase and check it
     */
    processNamespaceName() {
        // Lowercase namespace name
        this.formData.namespaceName = this._$filter('lowercase')(this.formData.namespaceName);
        // Check namespace validity
        if (!this.namespaceIsValid(this.formData.namespaceName)) return this._Alert.invalidNamespaceName();
    }

    /**
     * Get current account namespaces & mosaic names
     *
     * @note: Used in view (ng-update) on multisig changes
     */
    updateCurrentAccountNS() {
        // Get current account
        let acct = this.formData.isMultisig ? this.formData.multisigAccount.address : this._Wallet.currentAccount.address;
        // Set current account mosaics names if namespaceOwned is not undefined in DataStore service
        if (undefined !== this._DataStore.namespace.ownedBy[acct]) {
            this.namespaceOwned = this._DataStore.namespace.ownedBy[acct];
            this.formData.namespaceParent = this.namespaceOwned[Object.keys(this.namespaceOwned)[0]];
        } else {
            this.namespaceOwned = {};
            this.formData.namespaceParent = "";
        }
        this.prepareTransaction();
    }

    /**
     * Prepare the transaction
     */
    prepareTransaction() {
        let entity = nem.model.transactions.prepare("namespaceProvisionTransaction")(this.common, this.formData, this._Wallet.network);
        // Store the prepared transaction
        this.preparedTransaction = entity;
        return entity;
    }

    /**
     * Check validity of namespace name
     *
     * @param {string} ns - A namespace name
     *
     * @return {boolean} - True if valid, false otherwise
     */
    namespaceIsValid(ns) {
        let isParent = this.formData.namespaceParent ? true : false;
        return Helpers.namespaceIsValid(ns, isParent);
    }

    /**
     * Prepare and broadcast the transaction to the network
     */
    send() {
        // Disable send button
        this.okPressed = true;

        // Get account private key for preparation or return
        if (!this._Wallet.decrypt(this.common)) return this.okPressed = false;

        // Build the entity to serialize
        let entity = this.prepareTransaction(this.common, this.formData);

        // Use wallet service to serialize and send
        this._Wallet.transact(this.common, entity).then(() => {
            this._$timeout(() => {
                // Enable send button
                this.okPressed = false;
                // Reset all
                this.init();
                return;
            });
        }, () => {
            this._$timeout(() => {
                // Delete private key in common
                this.common.privateKey = '';
                // Enable send button
                this.okPressed = false;
                return;
            });
        });
    }

    //// End methods region ////

}

export default NamespacesCtrl;