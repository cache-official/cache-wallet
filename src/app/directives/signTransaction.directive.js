import nem from "nem-sdk";

function SignTransaction(Wallet, $timeout, DataStore) {
    'ngInject';

    return {
        restrict:'E',
        scope: {
        	tx: '=',
            needsSignature: '=',
            parentTx: '=',
            meta: '='
        },
        template: '<ng-include src="templateSignTransaction"/>',
        link: (scope) => {
        	scope.templateSignTransaction = 'layout/partials/signTransaction.html';
            scope.common = nem.model.objects.get("common");
            scope.Wallet = Wallet;

            /**
             * Cosign a multisig transaction
             *
             * @param {object} parentTx - A multisig transaction object
             * @param {object} tx - An inner transaction object
             * @param {object} meta - The meta data of the multisig transaction object
             */
            scope.cosign = (parentTx, tx, meta) => {
                let txCosignData = nem.model.objects.create("signatureTransaction")(nem.model.address.toAddress(parentTx.otherTrans.signer, Wallet.network), meta.innerHash.data);

                // Get account private key
                if (!Wallet.decrypt(scope.common)) return;

                // Prepare the signature transaction
                let entity = nem.model.transactions.prepare("signatureTransaction")(scope.common, txCosignData, Wallet.network);

                // HW wallet
                entity.otherTrans = parentTx.otherTrans;

                // Use wallet service to serialize and send
                Wallet.transact(scope.common, entity).then(() => {
                    $timeout(() => {
                        // Remove needs of signature
                        $("#needsSignature-" + tx.timeStamp).remove();
                        $("#needsSignature2-" + tx.timeStamp).remove();
                        // Push the signer into the transaction object
                        parentTx.signatures.push({ "signer": DataStore.account.metaData.account.publicKey, "timeStamp": nem.utils.helpers.createNEMTimeStamp()});
                        // Reset common
                        scope.common = nem.model.objects.get("common");
                        return;
                    });
                }, () => {
                    $timeout(() => {
                        // Reset common
                        scope.common = nem.model.objects.get("common");
                        return;
                    });
                });
            }
        }

    };
}

export default SignTransaction;