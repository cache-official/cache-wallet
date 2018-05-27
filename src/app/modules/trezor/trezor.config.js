function TrezorConfig($stateProvider) {
    'ngInject';

    $stateProvider
        .state('app.trezor', {
            url: '/trezor',
            controller: 'TrezorCtrl',
            controllerAs: '$ctrl',
            templateUrl: 'modules/trezor/trezor.html',
            title: 'TREZOR'
        });

};

export default TrezorConfig;
