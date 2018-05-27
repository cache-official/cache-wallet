class ExplorerHomeCtrl {

    /**
     * Initialize dependencies and properties
     *
     * @params {services} - Angular services to inject
     */
    constructor(Wallet, DataStore) {
        'ngInject';

        //// Module dependencies region ////

        this._Wallet = Wallet;
        this._DataStore = DataStore;

        //// End dependencies region ////

        //// Module properties region ////

        // Array for multisig namespaces
        this.multisigNamespaces = [];

        //// End properties region ////
        
        this.arrangeMultisigNamespaces();
    }

    //// Module methods region ////

    /**
     * Arrange all multisig namespaces in an array
     */
    arrangeMultisigNamespaces() {
        if(this._DataStore.account.metaData.meta.cosignatoryOf.length) {
            for(let i=0; i < this._DataStore.account.metaData.meta.cosignatoryOf.length; i++) {
                let multisig = this._DataStore.account.metaData.meta.cosignatoryOf[i].address;
                if(undefined !== this._DataStore.namespace.ownedBy[multisig]) {
                    let namesArray = Object.keys(this._DataStore.namespace.ownedBy[multisig]);
                    for (let k=0; k < namesArray.length; k++) {
                        let namespace = this._DataStore.namespace.ownedBy[multisig][namesArray[k]].fqn
                        this.multisigNamespaces.push(namespace);
                    }
                }
            }
        }
    }

    //// End methods region ////
}

export default ExplorerHomeCtrl;