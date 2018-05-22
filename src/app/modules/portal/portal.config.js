function PortalConfig($stateProvider) {
    'ngInject';

    $stateProvider
        .state('app.portal', {
            url: '/services',
            controller: 'PortalCtrl',
            controllerAs: '$ctrl',
            templateUrl: 'modules/portal/portal.html',
            title: 'Services'
        });

};

export default PortalConfig;