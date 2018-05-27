import nem from 'nem-sdk';
import Helpers from '../../../utils/helpers';

class RenewNamespacesCtrl {

    /**
     * Initialize dependencies and properties
     *
     * @params {services} - Angular services to inject
     */
    constructor(Wallet, Alert, DataStore, $timeout) {
        'ngInject';

        //// Module dependencies region ////

        this._Alert = Alert;
        this._Wallet = Wallet;
        this._DataStore = DataStore;
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
        // Set the sink account for view
        this.formData.rentalFeeSink = nem.model.sinks.namespace[this._Wallet.network];
        // Set first multisig account if any
        this.formData.multisigAccount = this._DataStore.account.metaData.meta.cosignatoryOf.length == 0 ? '' : this._DataStore.account.metaData.meta.cosignatoryOf[0];
        // Prevent user to click twice on send when already processing
        this.okPressed = false;
        // Show / hide ns dropdown
        this.needRenew = false;
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
     * Get current account namespaces & mosaic names
     *
     * @note: Used in view (ng-update) on multisig changes
     */
    updateCurrentAccountNS() {
        //
        this.needRenew = false;
        // Get current account
        let acct = this.formData.isMultisig ? this.formData.multisigAccount.address : this._Wallet.currentAccount.address;
        // Set current account mosaics names if namespaceOwned is not undefined
        if (undefined !== this._DataStore.namespace.ownedBy[acct]) {
            this.namespaceOwned = this._DataStore.namespace.ownedBy[acct];
            for (let i = 0; i < Object.keys(this.namespaceOwned).length; i++) {
                if (this.namespaceOwned[Object.keys(this.namespaceOwned)[i]].height + 525600 - this._DataStore.chain.height <= 43200 && this.namespaceOwned[Object.keys(this.namespaceOwned)[i]].fqn.indexOf('.') === -1) {
                    this.formData.namespaceName = this.namespaceOwned[Object.keys(this.namespaceOwned)[i]].fqn;
                    this.needRenew = true;
                    this.prepareTransaction();
                    return;
                }
            }
            this.resetNamespaceData();
        } else {
            this.resetNamespaceData();
        }
        this.prepareTransaction();
    }

    /**
     * Reset namespace data
     */
    resetNamespaceData() {
        this.namespaceOwned = {};
        this.formData.namespaceName = '';
        this.formData.namespaceParent = '';
    }

    /**
     * Get array of namespaces expiring in less than a month
     *
     * @param {array} elem - An array of namespaces
     *
     * @return {array} - An array of namespaces
     */
    getExpiringNamespaces(elem) {
        if (undefined === elem) return;
        let array = [];
        for (let i = 0; i < Object.keys(elem).length; i++) {
            if (elem[Object.keys(elem)[i]].height + 525600 - this._DataStore.chain.height <= 43200 && elem[Object.keys(elem)[i]].fqn.indexOf('.') === -1) {
                array.push(elem[Object.keys(elem)[i]]);
            }
        }
        return array;
    };

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

export default RenewNamespacesCtrl;