function ImportanceTransferConfig($stateProvider) {
    'ngInject';

    $stateProvider
        .state('app.importanceTransfer', {
            url: '/importance-transfer',
            controller: 'ImportanceTransferCtrl',
            controllerAs: '$ctrl',
            templateUrl: 'modules/importanceTransfer/normal/importanceTransfer.html',
            title: 'Manage delegated account'
        });

};

export default ImportanceTransferConfig;