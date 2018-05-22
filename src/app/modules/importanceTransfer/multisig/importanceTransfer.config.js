function MultisigImportanceTransferConfig($stateProvider) {
    'ngInject';

    $stateProvider
        .state('app.multisigImportanceTransfer', {
            url: '/multisignature-importance-transfer',
            controller: 'MultisigImportanceTransferCtrl',
            controllerAs: '$ctrl',
            templateUrl: 'modules/importanceTransfer/multisig/importanceTransfer.html',
            title: 'Manage delegated account of multisignature accounts'
        });

};

export default MultisigImportanceTransferConfig;