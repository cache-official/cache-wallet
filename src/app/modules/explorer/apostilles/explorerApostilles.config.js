function ExplorerApostillesConfig($stateProvider) {
    'ngInject';

    $stateProvider
        .state('app.explorerApostilles', {
            url: '/explorer/apostilles',
            controller: 'ExplorerApostillesCtrl',
            controllerAs: '$ctrl',
            templateUrl: 'modules/explorer/apostilles/explorerApostilles.html',
            title: 'Explorer - Apostilles'
        });

};

export default ExplorerApostillesConfig;