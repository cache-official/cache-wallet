function TransferCacheConfig($stateProvider) {
    'ngInject';

    $stateProvider
        .state('app.transferCache', {
            url: '/transfer-cache',
            controller: 'TransferCacheCtrl',
            controllerAs: '$ctrl',
            templateUrl: 'modules/transferCache/transferCache.html',
            title: 'Send Cache',
            params: {
                address: ''
            }
        });

};

export default TransferCacheConfig;