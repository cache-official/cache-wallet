import nem from 'nem-sdk';

class ExplorerNamespacesMosaicsCtrl {

    /**
     * Initialize dependencies and properties
     *
     * @params {services} - Angular services to inject
     */
    constructor(Wallet, Alert, $filter, DataStore, $timeout) {
        'ngInject';

        //// Module dependencies region ////

        this._Wallet = Wallet;
        this._Alert = Alert;
        this._$filter = $filter;
        this._DataStore = DataStore;
        this._$timeout = $timeout;

        //// End dependencies region ////

        //// Module properties region ////

        this.namespaces = [];
        this.subNamespaces = [];
        this.mosaics = [];
        this.selectedMosaic = undefined;
        this.selectedMosaicName = this._$filter("translate")("EXPLORER_NS_MOS_SELECT_MOS");
        this.selectedMosaicLevyDefinition = {};
        this.selectedNamespaceName = "";
        this.selectedSubNamespaceName = "";
        this.searchText = "";

        // General pagination
        this.pageSize = 10;
        // Namespaces pagination
        this.currentPage = 0;
        // Sub-namespaces pagination
        this.currentPageSubNs = 0;
        // Mosaics pagination
        this.currentPageMos = 0;

        //// End properties region ////

        // Get all root namespaces
        this.getNamespaces();
    }

    //// Module methods region ////

    /**
     * Gets all namespaces
     *
     * @param {number|undefined} id - The namespace id up to which to return the results, nothing for the most recent
     */
    getNamespaces(id) {
        return nem.com.requests.namespace.roots(this._Wallet.node, id).then((res) => {
            this._$timeout(() => {
                if(res.data.length == 100){
                    for(var i=0; i < res.data.length; i++){
                        this.namespaces.push(res.data[i]);
                    }
                    this.getNamespaces(res.data[99].meta.id);
                } else{
                    for(var i=0; i < res.data.length; i++){
                        this.namespaces.push(res.data[i]);
                    }
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
     * Gets all sub-namespaces given an address and parent namespace
     *
     * @param {string} address - An account address
     * @param {string} parent - A parent namespace
     */
    getSubNamespaces(address, parent) {
        this.mosaics = [];
        this.selectedMosaic = undefined;
        this.selectedMosaicName = this._$filter("translate")("EXPLORER_NS_MOS_SELECT_MOS");
        this.selectedNamespaceName = parent;
        this.selectedSubNamespaceName = "";
        return nem.com.requests.account.namespaces.owned(this._Wallet.node, address, parent).then((res) => {
            this._$timeout(() => {
                if(!res.data.length) {
                    this.subNamespaces = [];
                    this.currentPageSubNs = 0;
                } else {
                    this.subNamespaces = res.data;
                    this.currentPageSubNs = 0;
                }
            });
        }, 
        (err) => {
            this._$timeout(() => {
                this._Alert.errorGetSubNamespaces(err.data.message);
            });
        });
    }

    /**
     * Gets all mosaics given an address and a parent namespace
     *
     * @param {string} address - An account address
     * @param {string} parent - A parent namespace
     */
    getMosaics(address, parent) {
        this.selectedMosaic = undefined;
        this.selectedMosaicName = this._$filter("translate")("EXPLORER_NS_MOS_SELECT_MOS");
        this.selectedSubNamespaceName = parent;
        return nem.com.requests.account.mosaics.definitions(this._Wallet.node, address, parent).then((res) => {
            this._$timeout(() => {
                if(!res.data.length) {
                    this.mosaics = [];
                    this.currentPageMos = 0;
                } else {
                    this.mosaics = res.data;
                    this.currentPageMos = 0;
                }
            });
        }, 
        (err) => {
            this._$timeout(() => {
                this._Alert.errorGetMosaics(err.data.message);
            });
        });
    };

    /**
     * Set mosaic data to display details
     *
     * @param {object} mosaic - A mosaic object
     */
    processMosaic(mosaic) {
        this.selectedMosaicLevyDefinition = {};
        this.selectedMosaic = mosaic;
        // Convert supply string to number
        mosaic.properties[1].value = parseInt(mosaic.properties[1].value, 10);
        this.selectedMosaicName = nem.utils.format.mosaicIdToName(mosaic.id);
        if (undefined !== mosaic.levy.type) {
            if(nem.utils.format.mosaicIdToName(mosaic.levy.mosaicId) === 'nem:xem' || undefined !== this._DataStore.mosaic.metaData[nem.utils.format.mosaicIdToName(mosaic.levy.mosaicId)]) {
                this.selectedMosaicLevyDefinition = this._DataStore.mosaic.metaData;
            } else {
                // Fetch all mosaic definitions owned by creator for levy
                nem.com.requests.account.mosaics.allDefinitions(this._Wallet.node, this._$filter("fmtPubToAddress")(mosaic.creator, this._Wallet.network)).then((res) => {
                    this._$timeout(() => {
                        if(res.data.length) {
                            for (let i = 0; i < res.data.length; ++i) {
                                this.selectedMosaicLevyDefinition[nem.utils.format.mosaicIdToName(res.data[i].id)] = {};
                                this.selectedMosaicLevyDefinition[nem.utils.format.mosaicIdToName(res.data[i].id)].mosaicDefinition = res.data[i];
                            }
                        }
                    });
                }, 
                (err) => {
                    this._$timeout(() => {
                        this._Alert.errorGetMosaicsDefintions(err.data.message);
                    });
                });
            }
        }

        // Get current supply
        this.getCurrentSupply(nem.utils.format.mosaicIdToName(mosaic.id));
    }

    /**
     * Get the current supply of a mosaic
     *
     * @param {string} id - A mosaic id
     */
    getCurrentSupply(id) {
        return nem.com.requests.mosaic.supply(this._Wallet.node, id).then((res) => {
            this._$timeout(() => {
                this.selectedMosaic.supply = res.supply;
            });
        }, 
        (err) => {
            this._$timeout(() => {
                this._Alert.getMosaicSupplyError(err.data.message)
            });
        });
    }

    /**
     * Clean a sub-namespace of it's parent root
     *
     * @param {string} str - The namespace id to clean
     */
    substringSubNs(str) {
        return str.substr(str.indexOf('.')+1);
    }

    formatMosaicId(id){
        return nem.utils.format.mosaicIdToName(id);
    }

    //// End methods region ////
}

export default ExplorerNamespacesMosaicsCtrl;