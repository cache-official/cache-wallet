function ExplorerHomeConfig($stateProvider) {
    'ngInject';

    $stateProvider
        .state('app.explorerHome', {
            url: '/explorer/home',
            controller: 'ExplorerHomeCtrl',
            controllerAs: '$ctrl',
            templateUrl: 'modules/explorer/home/explorerHome.html',
            title: 'Explorer - Home'
        });

};

export default ExplorerHomeConfig;