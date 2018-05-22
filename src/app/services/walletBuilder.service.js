import CryptoHelpers from '../utils/CryptoHelpers';
import nem from 'nem-sdk';
import Helpers from '../utils/helpers';

/** Service to build wallets */
class WalletBuilder {

    /**
     * Initialize dependencies and properties
     *
     * @params {services} - Angular services to inject
     */
    constructor(Alert, $timeout, $localStorage) {
        'ngInject';

        //// Service dependencies region ////

        this._Alert = Alert;
        this._$timeout = $timeout;
        this._storage = $localStorage;

        //// End dependencies region ////

        //// Service properties region ////

        // Get wallets from local storage or create empty array
        this._storage.wallets = this._storage.wallets || [];

        //// End properties region ////
    }

    //// Service methods region ////

    /**
     * Create a PRNG wallet object
     *
     * @param {string} walletName - A wallet name
     * @param {string} walletPassword - A wallet password
     * @param {string} entropy - An entropy seed
     * @param {number} network - A network id
     *
     * @return {object|promise} - A PRNG wallet object or a rejected promise
     */
    createWallet(walletName, walletPassword, entropy, network) {
        return new Promise((resolve, reject) => {
            // Check parameters
            if (!walletName || !walletPassword || !entropy || !network) {
                this._Alert.missingFormData();
                return reject(true);
            }
            // Check if wallet already loaded
            if (Helpers.haveWallet(walletName, this._storage.wallets)) {
                this._Alert.walletNameExists();
                return reject(true);
            }

            // Create random bytes
            let r = nem.utils.convert.ua2hex(nem.crypto.nacl.randomBytes(32));
            // Create entropy seed
            let seed = this.processEntropy(entropy, walletPassword);
            // Derive private key from random bytes + entropy seed
            let privateKey = nem.crypto.helpers.derivePassSha(r + seed, 1000).priv;
            // Create KeyPair
            let k = nem.crypto.keyPair.create(privateKey);
            // Create address from public key
            let addr = nem.model.address.toAddress(k.publicKey.toString(), network);
            // Encrypt private key using password
            let encrypted = nem.crypto.helpers.encodePrivKey(privateKey, walletPassword);
            // Create bip32 remote amount using generated private key
            return resolve(CryptoHelpers.generateBIP32Data(privateKey, walletPassword, 0, network).then((data) => {
                // Construct the wallet object
                let wallet = this.buildWallet(walletName, addr, true, "pass:bip32", encrypted, network, data.publicKey);
                return wallet;
            },
            (err) => {
                this._$timeout(() => {
                    this._Alert.createWalletFailed(err);
                    return false;
                }, 0)
            }));
        });
    }

    /**
     * Create a brain wallet object
     *
     * @param {string} walletName - A wallet name
     * @param {string} walletPassword - A wallet password
     * @param {number} network - A network id
     *
     * @return {object|promise} - A Brain wallet object or a rejected promise
     */
    createBrainWallet(walletName, walletPassword, network) {
        return new Promise((resolve, reject) => {
            // Check parameters
            if (!walletName || !walletPassword || !network) {
                this._Alert.missingFormData();
                return reject(true);
            }
            // Check if wallet already loaded
            if (Helpers.haveWallet(walletName, this._storage.wallets)) {
                this._Alert.walletNameExists();
                return reject(true);
            }
            // Derive private key from password
            let r = nem.crypto.helpers.derivePassSha(walletPassword, 6000).priv;
            // Create bip32 remote account using derived private key
            return resolve(CryptoHelpers.generateBIP32Data(r, walletPassword, 0, network).then((data) => {
                // Construct the wallet object
                let wallet = nem.model.wallet.createBrain(walletName, walletPassword, network);
                // Add child account to wallet
                wallet.accounts[0].child = data.publicKey;
                return wallet;
            },
            (err) => {
                this._$timeout(() => {
                    this._Alert.createWalletFailed(err);
                    return false;
                }, 0)
            }));
        });
    }

    /**
     * Create a private key wallet object
     *
     * @param {string} walletName - A wallet name
     * @param {string} walletPassword - A wallet password
     * @param {string} privateKey - The account private key
     * @param {number} network - A network id
     *
     * @return {object|promise} - A private key wallet object or a rejected promise
     */
    createPrivateKeyWallet(walletName, walletPassword, privateKey, network) {
        return new Promise((resolve, reject) => {
            // Check parameters
            if (!walletName || !walletPassword || !privateKey || !network) {
                this._Alert.missingFormData();
                return reject(true);
            }
            // Check the private key
            if (!nem.utils.helpers.isPrivateKeyValid(privateKey)) {
                this._Alert.invalidPrivateKey();
                return reject(true);
            }
            // Check if wallet already loaded
            if (Helpers.haveWallet(walletName, this._storage.wallets)) {
                this._Alert.walletNameExists();
                return reject(true);
            }
            // Create bip32 remote account using provided private key
            return resolve(CryptoHelpers.generateBIP32Data(privateKey, walletPassword, 0, network).then((data) => {
               // Construct the wallet object
                let wallet = nem.model.wallet.importPrivateKey(walletName, walletPassword, privateKey, network);
                wallet.accounts[0].child = data.publicKey;
                return wallet;
            }, (err) => {
                this._$timeout(() => {
                    this._Alert.createWalletFailed(err);
                    return false;
                }, 0);
            }));
        });
    }

    /**
     * Create a wallet object
     *
     * @param {string} walletName - The wallet name
     * @param {string} addr - The main account address
     * @param {boolean} brain - Is brain or not
     * @param {string} algo - The wallet algorithm
     * @param {object} encrypted - The encrypted private key object
     * @param {number} network - The network id
     * @param {string} child - The public key of the account derived from seed
     *
     * @return {object} - A wallet object
     */
    buildWallet(walletName, addr, brain, algo, encrypted, network, child) {
        let wallet = {
            "name": walletName,
            "accounts": {
                "0": {
                    "brain": brain,
                    "algo": algo,
                    "encrypted": encrypted.ciphertext || "",
                    "iv": encrypted.iv || "",
                    "address": addr.toUpperCase().replace(/-/g, ''),
                    "label": 'Primary',
                    "network": network,
                    "child": child
                }
            }
        };
        return wallet;
    }

    /**
     * Create a seed from entropy data, a timestamp and a password
     *
     * @param {string} entropy - A string from any source of entropy
     * @param {string} password - A password
     *
     * @return {string} seed - An 16 bytes entropy seed
     */
    processEntropy(entropy, password) {
        // Derive movement entropy
        let data = nem.crypto.helpers.derivePassSha(entropy, 1000).priv;
        // Derive password
        let pass = nem.crypto.helpers.derivePassSha(password, 1000).priv;
        // Derive seed
        let seed = nem.crypto.helpers.derivePassSha(data + pass, 1000).priv;
        // Return 16 bytes seed
        return seed.substring(seed.length - 32);
    }

    //// End methods region ////
}

export default WalletBuilder;