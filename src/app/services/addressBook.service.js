import nem from 'nem-sdk';

/** Service with relative functions on user address books. */
class AddressBook {

    /**
     * Initialize dependencies and properties
     *
     * @params {services} - Angular services to inject
     */
    constructor($localStorage) {
        'ngInject';

        // Service dependencies region //

        this._storage = $localStorage;

        // End dependencies region //

        // Service properties region //

        /**
         * Get contacts from local storage or set an empty object
         *
         * @type {object}
         */
        this._storage.contacts = this._storage.contacts || {};

        // End properties region //
    }

    // Service methods region //

    /**
     * Add an account to contacts in local storage
     *
     * @param {string} primary - The primary account of the wallet
     * @param {object} account - The account to add (optional)
     *
     * @return {boolean} - True if valid, false otherwise
     */
    addAccount(primary, account) {
        let cleanPrimary = nem.model.address.clean(primary);
        if(undefined === this._storage.contacts[cleanPrimary]) {
            // If not existing, create address book with primary account
            this._storage.contacts[cleanPrimary] = [{
                "label": "Primary",
                "address": nem.utils.format.address(primary)
            }];
            if(undefined !== account) {
                // Push child account into address book
                this._storage.contacts[cleanPrimary].push({
                    "label": account.label,
                    "address": nem.utils.format.address(account.address)
                });
            }
            return true;
        } else {
            if (undefined === account) return false;
            // Check if address already present
            for (let i = 0; i < this._storage.contacts[cleanPrimary].length; i++) {
                if (account.address.toUpperCase().replace(/-/g, '') === nem.model.address.clean(this._storage.contacts[cleanPrimary][i].address)) {
                    return false;
                }
            }
            // Push child account into address book
            this._storage.contacts[cleanPrimary].push({
                "label": account.label,
                "address": nem.utils.format.address(account.address)
            });
            return true;
        }
    }

    /**
     * Save contacts to local storage
     *
     * @param {object} wallet - A wallet object
     * @param {array} contacts - An array of contacts
     *
     * @return -
     */
    save(wallet, contacts) {
        let primary = wallet.accounts[0].address;
        this._storage.contacts[primary] = contacts;
        return;
    }

    /**
     * Gets contacts from local storage
     *
     * @param {object} wallet - A wallet object
     *
     * @return {$localStorage~array} - An array of contacts for the given wallet
     */
    getContacts(wallet) {
        if (!wallet) return [];
        let primary = wallet.accounts[0].address;
        if (undefined === this._storage.contacts) this._storage.contacts = {};
        if (undefined === this._storage.contacts[primary]) this._storage.contacts[primary] = [];
        return this._storage.contacts[primary];
    }

    /**
     * Return contact label for an address
     *
     * @param {object} wallet - A wallet object
     * @param {string} address - The address to look for
     *
     * @return {string|boolean} - The account label or false
     */
    getContact(wallet, address) {
        if (!wallet || !address) return false;
        let primary = wallet.accounts[0].address;
        let _address = address.toUpperCase().replace(/-/g, '');
        if (undefined === this._storage.contacts[primary]) return false;
        for(let i = 0; i < this._storage.contacts[primary].length; i++) {
            let contactAddress = this._storage.contacts[primary][i].address.toUpperCase().replace(/-/g, '');
            if(contactAddress === _address) {
                return this._storage.contacts[primary][i].label;
            }
        }
        return false;
    }

    // End methods region //

}

export default AddressBook;