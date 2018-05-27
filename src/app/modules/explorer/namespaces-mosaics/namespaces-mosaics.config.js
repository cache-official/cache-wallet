function NamespacesMosaicsConfig($stateProvider) {
    'ngInject';

    $stateProvider
        .state('app.explorerNamespacesMosaics', {
            url: '/explorer/namespaces-and-mosaics',
            controller: 'ExplorerNamespacesMosaicsCtrl',
            controllerAs: '$ctrl',
            templateUrl: 'modules/explorer/namespaces-mosaics/namespaces-mosaics.html',
            title: 'Explorer - Namespaces & Mosaics'
        });

};

export default NamespacesMosaicsConfig;