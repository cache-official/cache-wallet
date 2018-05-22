import nem from 'nem-sdk';

// Unique id for each tx, start with 0
let txId = 0;

function TagTransaction(Wallet, $state, AddressBook, DataStore) {
    'ngInject';

    return {
        restrict: 'E',
        scope: {
            d: '=',
            a: '=',
            tooltipPosition: '='
        },
        template: '<ng-include src="templateUri"/>',
        link: (scope) => {
                scope.number = txId++;
                scope.mainAccount = scope.a || Wallet.currentAccount.address;
                scope.meta = scope.d.meta;

            if (scope.d.transaction.type == 4100) {
                scope.tx = scope.d.transaction.otherTrans;
                scope.parent = scope.d.transaction;
                scope.confirmed = !(scope.meta.height === Number.MAX_SAFE_INTEGER);
                scope.needsSignature = scope.parent && !scope.confirmed && DataStore.account.metaData && nem.utils.helpers.needsSignature(scope.d, DataStore.account.metaData);
            } else {
                scope.tx = scope.d.transaction;
                scope.parent = undefined;
            }

            // If called from the accounts explorer, hide message decryption
            scope.disableDecryption = $state.current.name === 'app.accountsExplorer' ? true : false;

            // Get the correct line template
            scope.templateUri = 'layout/lines/line' + nem.utils.format.txTypeToName(scope.tx.type) + '.html';

            // 
            scope.mosaicIdToName = nem.utils.format.mosaicIdToName;
            scope.mosaicDefinitionMetaDataPair = DataStore.mosaic.metaData;
            scope.networkId = Wallet.network;

            /**
             * Return contact label for an address
             *
             * @param {string} address - The address to look for
             *
             * @return {string|boolean} - The account label or false
             */
            scope.getContact = (address) => {
                return AddressBook.getContact(Wallet.current, address);
            }

        }
    };
}

export default TagTransaction;