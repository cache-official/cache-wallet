import nem from 'nem-sdk';
import Helpers from '../../../utils/helpers';

class AuditApostilleCtrl {

    /**
     * Initialize dependencies and properties
     *
     * @params {services} - Angular services to inject
     */
    constructor(Wallet, Alert, $timeout, $filter, Nodes) {
        'ngInject';

        //// Module dependencies region ////

        this._Wallet = Wallet;
        this._Alert = Alert;
        this._$timeout = $timeout;
        this._$filter = $filter;
        this._Nodes = Nodes;

        //// End dependencies region ////

        //// Module properties region ////

        // Array of valid files to apostille
        this.auditResults = [];
        // Get the right nodes according to Wallet network
        this.nodes = this._Nodes.get(undefined, true);
        // Default node with search option activated
        this.searchNode = this._Wallet.searchNode;
        // Status of the node disconnected by default
        this.searchNodeStatus = false;
        // To show processing overlay
        this.isProcessing = false;
        // Audit result pagination properties
        this.currentPage = 0;
        this.pageSize = 5;

        //// End properties region ////

        // Init heartbeat
        this.getHeartBeat(this.searchNode);
    }

    //// Module methods region ////

    /**
     * Process the file to apostille and push to array
     *
     * @param {object} $fileContent - Base 64 content of the file 
     * @param {object} $fileData - Meta data of the file
     */
    processFile($fileContent, $fileData) {
        this.isProcessing = true;

        // Remove the meta part of $fileContent string (data:application/octet-stream;base64)
        let cleanedDataContent = $fileContent.split(/,(.+)?/)[1];
        // Base 64 to word array
        let parsedData = nem.crypto.js.enc.Base64.parse(cleanedDataContent);
        
        // Check if file is in apostille format
        if (!this.checkApostilleName($fileData.name)) {
            this.auditResults.push({
                'filename': $fileData.name,
                'owner': '',
                'fileHash': '',
                'result': this._$filter('translate')('APOSTILLE_AUDIT_WRONG_FORMAT'),
                'hash': ''
            });
            this.isProcessing = false;
            return;
        }

        // Build an array out of the filename
        let nameArray = Helpers.getFileName($fileData.name).match(/\S+\s*/g);

        // Recomposing the initial filename before apostille
        let initialNameArray = nameArray.splice(0, nameArray.length - 7);
        let initialFileName = "";
        for (let h = 0; h < initialNameArray.length; h++) {
            initialFileName += initialNameArray[h];
        }
        // Initial filename 
        initialFileName = initialFileName.replace(/^\s+|\s+$/, '') + "." + Helpers.getExtension($fileData.name);
        console.log(initialFileName);

        // Hash of the apostille transaction
        let apostilleTxHash = nameArray[nameArray.length - 4].replace(/^\s+|\s+$/, '');
        console.log(apostilleTxHash);

        // Get the Apostille transaction from the chain
        nem.com.requests.transaction.byHash(this._Wallet.node, apostilleTxHash).then((res) => {
            this._$timeout(() => {
                // Arrange
                let isMultisig = res.transaction.type === nem.model.transactionTypes.multisigTransaction;
                let owner = this._$filter('fmtPubToAddress')(res.transaction.signer, this._Wallet.network);
                let payload = isMultisig ? this._$filter('fmtHexMessage')(res.transaction.otherTrans.message) : this._$filter('fmtHexMessage')(res.transaction.message);
                let checksum = payload.substring(5, 13);
                console.log("Checksum: " + payload.substring(5, 13));
                // Get apostille hash (without checksum)
                let dataHash = payload.substring(13);
                console.log("Hash: " + payload.substring(13));
                // Object to contain our result
                let obj = this.createResultObject(initialFileName, owner, checksum, dataHash, nem.model.apostille.isSigned(checksum.substring(6)), apostilleTxHash);
                // Verify
                if (nem.model.apostille.verify(parsedData, res.transaction)) {
                    // Success
                    obj.result = this._$filter('translate')('APOSTILLE_AUDIT_SUCCESS');
                    this.auditResults.push(obj);
                    this.isProcessing = false;
                    return;
                } else {
                    // Fail
                    obj.result = this._$filter('translate')('APOSTILLE_AUDIT_FAIL');
                    this.auditResults.push(obj);
                    this.isProcessing = false;
                    return;
                }
            });
        }, (err) => {
            this._$timeout(() => {
                console.log(err);
                let obj = this.createResultObject(initialFileName, '', '', '', false, apostilleTxHash);
                obj.result = this._$filter('translate')('APOSTILLE_AUDIT_NOT_FOUND');
                this.auditResults.push(obj);
                console.log(this.auditResults);
                this.isProcessing = false;
                return;
            });
        });
    }

    /**
     * Get heartbeat of a given node
     *
     * @param {string} endpoint - An endpoint object
     */
    getHeartBeat(endpoint) {
        this.searchNodeStatus = false;
        return nem.com.requests.endpoint.heartbeat(endpoint).then((data) => {
            this._$timeout(() => {
                if(data.code === 1 && data.type === 2) {
                    this.searchNodeStatus = true;
                } else {
                    this.searchNodeStatus = false;
                }
            });
        },
        (err) => {
            this._$timeout(() => {
                this.searchNodeStatus = false;
            });
        });
    }

    /**
     * Clear all audit data
     */
    clearAll() {
        // Clear result array
        this.auditResults = [];
        // Reinitiate to page 1
        this.currentPage = 0;
        // Clear file input
        $("#fileToNotary").val(null);
    }

    /**
     * Check if an apostille file name is valid
     *
     * @param {string} filename - The full name of the apostille file
     * 
     * @return {boolean} - True if valid, false otherwise
     */
    checkApostilleName(filename) {
        // Build an array out of the filename
        let nameArray = Helpers.getFileName(filename).match(/\S+\s*/g);
        if (nameArray[nameArray.length - 6] === undefined || nameArray[nameArray.length - 5].replace(/^\s+|\s+$/, '') !== 'TX') return false;
        let mark = nameArray[nameArray.length - 6].replace(/^\s+|\s+$/, '');
        if (mark === "Apostille" || mark === "ApostilleSigned") return true;
        return false;
    };

    /**
     * Create an apostille result object
     *
     * @param {string} initialFileName - The original file name
     * @param {string} apostilleSigner - The signer account of the apostille transaction
     * @param {string} checksum - The checksum of the apostille
     * @param {string} dataHash - The hash of the file content
     * @param {boolean} isPrivate - True if hash is signed, false otherwise
     * @param {string} apostilleTxHash - Transaction hash of the apostille
     * 
     * @return {object} - A result object
     */
    createResultObject(initialFileName, apostilleSigner, checksum, dataHash, isPrivate, apostilleTxHash) {
        return {
            'filename': initialFileName,
            'owner': apostilleSigner,
            'fileHash': checksum + dataHash,
            'private': isPrivate,
            'result': '',
            'hash': apostilleTxHash
        }
    }

    //// End methods region ////

}

export default AuditApostilleCtrl;