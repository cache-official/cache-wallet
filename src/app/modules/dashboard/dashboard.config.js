function DashboardConfig($stateProvider) {
    'ngInject';

    $stateProvider
        .state('app.dashboard', {
            url: '/dashboard',
            controller: 'DashboardCtrl',
            controllerAs: '$ctrl',
            templateUrl: 'modules/dashboard/dashboard.html',
            title: 'Dashboard'
        });

};

export default DashboardConfig;