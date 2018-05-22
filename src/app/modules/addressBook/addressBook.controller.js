import nem from 'nem-sdk';
import Helpers from '../../utils/helpers';

class AddressBookCtrl {

    /**
     * Initialize dependencies and properties
     *
     * @params {services} - Angular services to inject
     */
    constructor(Wallet, Alert, $state, AddressBook) {
        'ngInject';

        //// Module dependencies region ////

        this._Wallet = Wallet;
        this._Alert = Alert;
        this._$state = $state;
        this._AddressBook = AddressBook;
        this._Helpers = Helpers;

        //// End dependencies region ////

        //// Module properties region ////

        this.formData = {};
        this.formData.label = '';
        this.formData.address = '';
        this.is_edit = false;
        this.editElem = {};
        this.removeElem = {};

        // Sort
        this.revers = false;
        this.propertyName = 'label';

        // Contact list
        this.contacts = this._AddressBook.getContacts(this._Wallet.current);

        // Needed to prevent user to click twice on send when already processing
        this.okPressed = false;

        // Contacts to address book pagination properties
        this.currentPage = 0;
        this.pageSize = 10;

        //// End properties region ////
    }

    //// Module methods region ////

    /**
     * Sort contacts by label
     *
     * @param {object} propertyName - The property for filter
     */
    sortBy(propertyName) {
        this.revers = (this.propertyName === propertyName) ? !this.revers : false;
        this.propertyName = propertyName;
    };

    /**
     * Open modal in "add" mode
     */
    showAddContact() {
        this.is_edit = false;
        this.cleanData();
        $('#contactModal').modal('show');
    }

    /**
     * Add new contact to address book
     */
    add() {
        // Disable send button;
        this.okPressed = true;

        // Check address
        if(!this.checkAddress()) return;
        // Check presence
        if(this.checkPresence()) return;

        this.contacts.push({
            "label": this.formData.label,
            "address": nem.utils.format.address(this.formData.address)
        });

        // Save data to locale storage
        this.saveAddressBook();

        // Reset data
        this.cleanData();

        $('#contactModal').modal('hide');

        // Enable send button;
        this.okPressed = false;
    }

    /**
     * Open modal in "edit" mode
     *
     * @param {object} elem - The object to edit
     */
    showEditContact(elem) {
        this.is_edit = true;
        this.editElem = elem;
        this.formData.label = elem.label;
        this.formData.address = elem.address;
        $('#contactModal').modal('show');
    }

    /**
     * Save new values contact
     */
    edit() {
        // Disable send button;
        this.okPressed = true;

        // Check address
        if(!this.checkAddress()) return;

        var indexOfElem = this.contacts.indexOf(this.editElem);
        this.contacts[indexOfElem].label = this.formData.label;
        this.contacts[indexOfElem].address = nem.utils.format.address(this.formData.address);

        // Save data to locale storage
        this.saveAddressBook();

        // Reset data
        this.cleanData();

        $('#contactModal').modal('hide');

        // Enable send button;
        this.okPressed = false;
    }

    /**
     * Check if contact address is valid
     */
    checkAddress() {
        // Check address
        if(nem.model.address.clean(this.formData.address).length !== 40 || !nem.model.address.isValid(this.formData.address) || !nem.model.address.isFromNetwork(this.formData.address, this._Wallet.network)) {
            this._Alert.invalidAddress();
            this.okPressed = false;
            return false;
        }
        return true; 
    }

    /**
     * Check if contact address and label already exists
     */
    checkPresence() {
        for (let i = 0; i < this.contacts.length; i++) {
            if (nem.model.address.clean(this.contacts[i].address) === nem.model.address.clean(this.formData.address) || this.contacts[i].label === this.formData.label) {
                this._Alert.contactAlreadyInAddressBook();
                this.okPressed = false;
                return true;
            }
        }
        return false;
    }

    /**
     * Remove a contact from address book array
     *
     * @param {object} elem - The object to delete
     */
    removeContact(elem) {
        this.removeElem = elem;
        $('#removeContactModal').modal('show');
    }

    /**
     * Remove a contact
     */
    remove() {
        // Disable send button;
        this.okPressed = true;

        // If the deleted element is the elem 0 and length of array mod 5 gives 0 (means it is the last object of the page),
        // we return a page behind unless it is page 1.
        if (this.contacts.indexOf(this.removeElem) === 0 && this.currentPage + 1 > 1 && (this.contacts.length - 1) % 5 === 0) {
            this.currentPage = this.currentPage - 1;
        }

        this.contacts.splice(this.contacts.indexOf(this.removeElem), 1);
        this.removeElem = {};

        this.saveAddressBook();

        $('#removeContactModal').modal('hide');

        // Enable send button;
        this.okPressed = false;
    }

    /**
     * Save data to locale storage
     */
    saveAddressBook() {
        return this._AddressBook.save(this._Wallet.current, this.contacts);
    }

    /**
     * Clean temp data
     */
    cleanData() {
        this.formData.label = "";
        this.formData.address = "";
        this.editElem = {};
    }

    /**
     * Export address book to .adb file
     */
    exportAddressBook() {
        let wordArray = nem.crypto.js.enc.Utf8.parse(angular.toJson(this.contacts));
        // Word array to base64
        let base64 = nem.crypto.js.enc.Base64.stringify(wordArray);
        // Set download element attributes
        $("#exportAddressBook").attr('href', 'data:application/octet-stream,' + base64);
        $("#exportAddressBook").attr('download', this._Wallet.current.name + '.adb');
        // Simulate click to trigger download
        document.getElementById("exportAddressBook").click();
        return;
    }

    /**
     * Trigger for select .adb file
     */
    uploadAddressBook() {
        document.getElementById("uploadAddressBook").click();
    }

    /**
     * Import address book from .adb file
     *
     * @param $fileContent - content file for import
     */
    importAddressBook($fileContent) {
        let contacts = JSON.parse(nem.crypto.js.enc.Utf8.stringify(nem.crypto.js.enc.Base64.parse($fileContent)));

        if (contacts.length) {
            for (var i = 0; i < contacts.length; i++) {
                if (typeof contacts[i].label != 'undefined' && typeof contacts[i].address != 'undefined') {
                    this.contacts.push(contacts[i]);
                }
            }

            $("#uploadAddressBook").val(null);

            // Save data to locale storage
            this.saveAddressBook();

            // Show alert
            this._Alert.addressBookFileSuccess();
        }
    }

    /**
     * Open transfer transaction module with selected contact as recipient
     *
     * @param address - account address
     */
    transferTransaction(address) {
        this._$state.go("app.transferTransaction", {address: address});
        return;
    }

    //// End methods region ////

}

export default AddressBookCtrl;