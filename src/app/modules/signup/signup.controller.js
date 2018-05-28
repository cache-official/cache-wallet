import nem from 'nem-sdk';
import Helpers from '../../utils/helpers';
import zxcvbn from 'zxcvbn';

class SignupCtrl {

    /**
     * Initialize dependencies and properties
     *
     * @params {services} - Angular services to inject
     */
    constructor(AppConstants, $state, Alert, WalletBuilder, $localStorage, $timeout, $scope, Wallet, AddressBook) {
        'ngInject';
        //// Module dependencies region ////
        this._storage = $localStorage;
        this._Alert = Alert;
        this._WalletBuilder = WalletBuilder;
        this._$state = $state;
        this._AppConstants = AppConstants;
        this._$timeout = $timeout;
        this._Wallet = Wallet;
        this._AddressBook = AddressBook;
        this.showBackBtn = false;

        //// End dependencies region ////

        //// Module properties region ////

        // Default network
        this.network = this._AppConstants.defaultNetwork;

        // Available networks
        this.networks = nem.model.network.data;

        // Get wallets from local storage or set an empty array
        this._storage.wallets = this._storage.wallets || [];

        // Lock to prevent user to click twice on button when already processing
        this.okPressed = false;

        // Raw wallet data to show in view
        this.rawWallet = "";

        // Wallet private key to show in view
        this.walletPrivateKey = "";

        // Store created wallet temporarily
        this.tempWallet = {};

        // Form data object
        this.formData = {};
        this.formData.password = "";
        this.formData.confirmPassword = "";
        this.formData.walletName = "";
        this.formData.privateKey = "";
        this.formData.entropy = "";

        // Address generated by provided private key (private key wallet)
        this.generatedAddress = "";

        // Wallet types
        this.walletTypes = [{
            "type": 1 // Simple
        }, {
            "type": 2 // Brain
        }, {
            "type": 3 // Private key
        }];

        // Selected wallet type
        this._selectedType = this.walletTypes[0];

        // Password strength info given by zxcvbn
        this.passwordStrengthInfo = {};
        this.step6 = false;
        this.step7 = false;

        //// End properties region ////

        // Will stop catching entropy if user change page in the middle of movement capture
        $scope.$on("$destroy", () => {
            $("html").off('mousemove');
        });
    }

    //// Module methods region ////

    /**
     * Change the selected wallet type
     *
     * @param {number} type - Type number
     */
    changeWalletType() {
        this._selectedType = this.walletTypes[0];
        this.network = this._AppConstants.defaultNetwork;
        this.showBackBtn = true;
        this.step1 = false;
        this.step2 = true;
    }

    /**
     * Change wallet network
     *
     * @param {number} id - The network id to use at wallet creation
     */
    changeNetwork() {
        this.network = nem.model.network.data[1];
    }

    /**
     * Arrange wallet data to show in safety protocol
     *
     * @param {object} wallet - A wallet object
     */
    arrangeSafetyProtocol(wallet) {
        // Store wallet temporarily until safety protocol done
        this.tempWallet = wallet;
        // Prepare download
        this._Wallet.prepareDownload(wallet);
        // Store base64 format for safety protocol
        this.rawWallet = this._Wallet.base64Encode(wallet);
        // Unlock button
        this.okPressed = false;
        return;
    }

    /**
     * Create a new PRNG wallet
     */
    createWallet() {
        // Check if passwords match
        if (!this.checkPasswordsMatch()) return;

        // Lock button
        this.okPressed = true;

        // Create the wallet from form data
        return this._WalletBuilder.createWallet(this.formData.walletName, this.formData.password, this.formData.entropy, this.network).then((wallet) => {
                this._$timeout(() => {
                    if (wallet && typeof wallet === 'object') {
                        //
                        this.arrangeSafetyProtocol(wallet);
                        // We need private key for view so we create a common object with the wallet password
                        let common = nem.model.objects.create("common")(this.formData.password, "");
                        // Decrypt / generate and check primary
                        if (!this._Wallet.decrypt(common, wallet.accounts[0], wallet.accounts[0].algo, wallet.accounts[0].network)) {
                            // Enable send button
                            this.okPressed = false;
                            return;
                        } else {
                            // Set the decrypted private key for view
                            this.walletPrivateKey = common.privateKey;
                        }
                        // Hide step
                        this.step4 = false;
                        // Show next step
                        this.step5 = true;
                        return;
                    }
                }, 10);
            },
            (err) => {
                // Unlock button
                this.okPressed = false;
                return;
            });
    }

    createPrivateKeyWallet() {
        // Check if passwords match
        if (!this.checkPasswordsMatch()) return;

        // Lock button
        this.okPressed = true;

        // Create the wallet from form data
        return this._WalletBuilder.createPrivateKeyWallet(this.formData.walletName, this.formData.password, this.formData.privateKey, this.network).then((wallet) => {
                this._$timeout(() => {
                    if (wallet && typeof wallet === 'object') {
                        //
                        this.arrangeSafetyProtocol(wallet);
                        this.walletPrivateKey = this.formData.privateKey;
                        // Hide step
                        this.step4 = false;
                        // Show next step
                        this.step5 = true;
                        return;
                    }
                }, 10);
            },
            (err) => {
                // Unlock button
                this.okPressed = false;
                return;
            });
    }

    /**
     * Generate the address from private key to import
     */
    generateAddress() {
        if(undefined !== this.formData.privateKey && this.formData.privateKey.length) {
            // Check private key
            if (nem.utils.helpers.isPrivateKeyValid(this.formData.privateKey)) {
                // Create key pair
                let kp = nem.crypto.keyPair.create(this.formData.privateKey);
                // Create address to show
                this.generatedAddress = nem.model.address.toAddress(kp.publicKey.toString(), this.network);
            } else {
                // Reset address
                this.generatedAddress = "";
                // Show error alert
                this._Alert.invalidPrivateKey();
            }
        }
    }

    /**
     * Check if a wallet name is already present in local storage
     */
    checkWalletNamePresence() {
        if (Helpers.haveWallet(this.formData.walletName, this._storage.wallets)) return true;
        return false;
    }

    /**
     * Check if password and confirmation are the same
     */
    checkPasswordsMatch() {
        if (this.formData.password !== this.formData.confirmPassword) {
            this._Alert.passwordsNotMatching();
            return false;
        }
        return true;
    }

    /**
     * Hide signup steps / reset to wallet type selection
     */
    hideAllSteps() {
        this.step1 = undefined;
        this.step2 = false;
        this.step3 = false;
        this.step4 = false;
        this.progressBar = false;
        this.entropyDone = false;
        document.getElementById("pBar").style.width = '0%';
        this.formData.entropy = "";
    }

    clearEntropyProgress() {
        this.progressBar = false;
        this.entropyDone = false;
        this.formData.entropy = "";
        document.getElementById("pBar").style.width = '0%';
        $("html").off('mousemove');
    }

    goBackToPreviousPage() {
        switch (true) {
            case this.step2: {
                this.showBackBtn = false;
                this.step2 = false;
                this.step1 = undefined;
                break;
            }
            case this.step3: {
                this.step3 = false;
                this.step2 = true;
                break;
            }
            case this.step4: {
                this.clearEntropyProgress();
                this.step4 = false;
                this.step3 = true;
                break;
            }
            case this.step5: {
                this.step5 = false;
                this.step4 = true;
                break;
            }
            case this.step6: {
                this.step6 = false;
                this.step5 = true;
                break;
            }
            case this.step7: {
                this.step7 = false;
                this.step6 = true;
                break;
            }
            default: {
                break;
            }
        }
    }

    /**
     * Watch cursor movements to add more entropy to key generation (simple wallet)
     */
    getEntropy() {
        // Prepare
        let elem = document.getElementById("pBar");
        let width = 0;
        let entropy = "";
        // Watch for cursor movements
        $("html").mousemove((e) => {
            if (width >= 100) {
                this._$timeout(() => {
                    // Stop catching cursor movements
                    $("html").off('mousemove');
                    elem.innerHTML = '<span class="fa fa-check-circle" aria-hidden="true"></span> Done!';
                    this.entropyDone = true;
                    this.formData.entropy = entropy;
                });
            } else {
                entropy += e.pageX + "" + e.pageY;
                width += 0.15;
                elem.style.width = width + '%';
                elem.innerHTML = Math.round(width * 1)  + '%';
            }
        });
    }

    copyPrivateKey() {
        let dummy = document.createElement('input');
        document.body.appendChild(dummy);
        let pkInput = document.getElementById("pkCopy");
        let pk = pkInput.innerText;
        dummy.setAttribute('value', pk);
        dummy.select();
        document.execCommand("copy");
        document.body.removeChild(dummy);
        this._Alert.privateKeyCopiedSuccess();
    }

    copyAddress() {
        let dummy = document.createElement('input');
        document.body.appendChild(dummy);
        let addressInput = document.getElementById("addressCopy");
        let address = addressInput.innerText;
        dummy.setAttribute('value', address);
        dummy.select();
        document.execCommand("copy");
        document.body.removeChild(dummy);
        this._Alert.addressCopiedSuccess();
    }

    /**
     * Finalize signup process
     */
    endSignup() {
        // Store wallet temporarily until safety protocol done
        let wallet = this.tempWallet;
        // Add the account into address book
        this._AddressBook.addAccount(wallet.accounts[0].address);
        // Set wallet in local storage
        this._storage.wallets = this._storage.wallets.concat(wallet);
        // Show success alert
        this._Alert.createWalletSuccess();
        // Reset form data
        this.formData = {};
        this.showBackBtn = false;
        this.step7 = false;
        this.step8 = true;
    }

    /**
     * Update the passphrase strength information
     */
    updatePasswordStrengthInfo() {
        this.passwordStrengthInfo = zxcvbn(this.formData.password);
    }

    //// End methods region ////

}

export default SignupCtrl;