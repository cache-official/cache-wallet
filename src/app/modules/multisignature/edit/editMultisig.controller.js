import nem from 'nem-sdk';

class EditMultisigCtrl {

    /**
     * Initialize dependencies and properties
     *
     * @params {services} - Angular services to inject
     */
    constructor(Wallet, Alert, DataStore, Recipient, $timeout) {
        'ngInject';

        //// Module dependencies region ////

        this._Wallet = Wallet;
        this._Alert = Alert;
        this._DataStore = DataStore;
        this._Recipient = Recipient;
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
        // Form is a multisig agregate modification transaction object
        this.formData = nem.model.objects.get("multisigAggregateModification");
        // Modification is always multisig
        this.formData.isMultisig = true;
        // Set first multisig account if any
        this.formData.multisigAccount = this._DataStore.account.metaData.meta.cosignatoryOf.length == 0 ? '' : this._DataStore.account.metaData.meta.cosignatoryOf[0];
        // Cosignatory to add
        this.cosignatoryToAdd = '';
        // Cosignatory public key
        this.cosignatoryPubKey = '';
        // No min cosignatory modification by default
        this.formData.relativeChange = null;
        // Store info about the multisig account to show balance, cosigs and min signatures
        this.multisigInfoData = undefined;
        // Prevent user to click twice on send when already processing
        this.okPressed = false;
        // Modifications list pagination properties
        this.currentPage = 0;
        this.pageSize = 5;
        // Object to contain our password & private key data
        this.common = nem.model.objects.get("common");
        // Store the prepared transaction
        this.preparedTransaction = {};
        // Get data of default multisig account
        this.processMultisigInput();
        // Init fees
        this.prepareTransaction();
    }

    /**
     * Calculate the minimum signature change needed
     */
    calculateMinSignaturesChange() {
        // If no modifications, change is null
        if (!this.formData.modifications.length) return this.formData.relativeChange = null;
        // Default number of account deleted
        let numberDeleted = 0;
        // Default number of account added
        let numberAdded = 0;
        // Increment above properties depending of type
        for (let i = 0; i < this.formData.modifications.length; i++) {
            if (this.formData.modifications[i].modificationType === 2) {
                numberDeleted++;
            } else {
                numberAdded++;
            }
        }
        // Update min cosigs if total cosignatories - deleted accounts + added accounts is < min cosig number
        if (this.multisigInfoData.cosignatories.length - numberDeleted + numberAdded < this.multisigInfoData.minCosigs) {
            // Calculate the number to add or remove of min signatures
            let sigs = this.multisigInfoData.cosignatories.length - numberDeleted - this.multisigInfoData.minCosigs + numberAdded;
            this.formData.relativeChange = sigs;
        } else if(this.isMinSignaturesValid(false)) {
            this.formData.relativeChange = null;
        } else {
            this._Alert.errorMultisigMinSignatureInvalid();
        }
    }

    /**
     * Process multisig account input and get data from network
     */
    processMultisigInput() {
        if (!this.formData.multisigAccount) return;
        // Reset recipient data
        this.resetMultisigData();
        //
        return this._Recipient.getAccount(this.formData.multisigAccount.address).then((res) => {
            this._$timeout(() => {
                //
                this.setMultisigData(res);
                return;
            });
        },
        (err) => {
            this._$timeout(() => {
                // Reset recipient data
                this.resetMultisigData();
                return;
            });
        });
    }

    /**
     * Set data received from Recipient service
     *
     * @param {object} data - An [AccountInfo]{@link http://bob.nem.ninja/docs/#accountInfo} object
     */
    setMultisigData(data) {
        // Store data
        this.multisigInfoData = {
            'minCosigs': data.account.multisigInfo.minCosignatories,
            'cosignatories': data.meta.cosignatories
        }
        return;
    }

    /**
     * Prepare the transaction
     */
    prepareTransaction() {
        let entity = nem.model.transactions.prepare("multisigAggregateModificationTransaction")(this.common, this.formData, this._Wallet.network);
        this.isMinSignaturesValid(false);
        this.preparedTransaction = entity;
        return entity;
    }

    /**
     * Reset data stored and properties for multisig account
     */
    resetMultisigData() {
        this.multisigInfoData = undefined;
        // Reset modifications array
        this.formData.modifications = [];
        // Reset relativeChange
        this.formData.relativeChange = null;
    }

    /**
     * Remove a cosignatory from the modifications list
     *
     * @param {array} array - A modification array
     * @param {object} elem - An object to remove from the array
     */
    removeCosignFromList(array, elem) {
        // If the deleted element is the elem 0 and length of array mod 5 gives 0 (means it is the last object of the page), 
        // we return a page behind unless it is page 1.
        if (array.indexOf(elem) === 0 && this.currentPage + 1 > 1 && (array.length - 1) % 5 === 0) {
            this.currentPage = this.currentPage - 1;
        }
        array.splice(array.indexOf(elem), 1);
        // Calculate min signatures change
        this.calculateMinSignaturesChange();
        // Update the fee
        this.prepareTransaction();
    }

    /**
     * Push cosignatory to array with add or delete type
     *
     * @param {number} type - modification type (1 to add or 2 to remove)
     */
    addCosig(type) {
        // Cosignatory needs a public key
        if (!this.cosignatoryPubKey) return this._Alert.cosignatoryhasNoPubKey();
        // Check if removal already present in modifications array
        if (type === 2) {
            for (let i = 0; i < this.formData.modifications.length; i++) {
                if (this.formData.modifications[i].modificationType === 2) return this._Alert.cosignatoryRemovalLimit();
            }
        }
        if (nem.utils.helpers.haveCosig(this.cosignatoryPubKey, this.formData.modifications)) {
            // Alert
            this._Alert.cosignatoryAlreadyPresentInList();
        } else {
            this.formData.modifications.push(nem.model.objects.create("multisigCosignatoryModification")(type, this.cosignatoryPubKey));
            // Calculate min signatures change
            this.calculateMinSignaturesChange();
            // Update the fee
            this.prepareTransaction();
        }
    }

    /**
     * Check if multisig account has at least one minimum signature remaining after change
     *
     * @param {boolean} isSend - True if the check is in send button, false otherwise 
     * Without the boolean the check in send button will trigger infinite digest cycles for the alert
     */
    isMinSignaturesValid(isSend) {
        if (undefined !== this.multisigInfoData && null !== this.formData.relativeChange) {
            if(isNaN(this.formData.relativeChange)) return false;
            let sigs = this.formData.relativeChange + this.multisigInfoData.minCosigs;
            // If number of sigs is below one and if there is not only one cosignatory
            if (sigs < 1 && this.multisigInfoData.cosignatories.length > 1) {
                if(!isSend) {
                    this._$timeout(() => {
                        this._Alert.errorMultisigMinSignature();
                    });
                }
                return false;
            } else {
                return true;
            }
        } else {
            return true;
        }
    }

    /**
     * Build and broadcast the transaction to the network
     */
    send() {
        // Disable send button;
        this.okPressed = true;

        // Get account private key for preparation or return
        if (!this._Wallet.decrypt(this.common)) return this.okPressed = false;

        // Prepare the transaction
        let entity = this.prepareTransaction();

        // Use wallet service to serialize and send
        this._Wallet.transact(this.common, entity).then(() => {
            this._$timeout(() => {
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

export default EditMultisigCtrl;