function RenewNamespacesConfig($stateProvider) {
    'ngInject';

    $stateProvider
        .state('app.renewNamespaces', {
            url: '/namespaces/renew',
            controller: 'RenewNamespacesCtrl',
            controllerAs: '$ctrl',
            templateUrl: 'modules/namespaces/renew/renew.html',
            title: 'Renew namespaces'
        });

};

export default RenewNamespacesConfig;