function ApostilleHistoryConfig($stateProvider) {
    'ngInject';

    $stateProvider
        .state('app.apostilleHistory', {
            url: '/apostille/history',
            controller: 'ApostilleHistoryCtrl',
            controllerAs: '$ctrl',
            templateUrl: 'modules/apostille/history/apostilleHistory.html',
            title: 'Apostille history'
        });

};

export default ApostilleHistoryConfig;