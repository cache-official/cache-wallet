function AuditApostilleConfig($stateProvider) {
    'ngInject';

    $stateProvider
        .state('app.auditApostille', {
            url: '/audit-apostille',
            controller: 'AuditApostilleCtrl',
            controllerAs: '$ctrl',
            templateUrl: 'modules/apostille/audit/auditApostille.html',
            title: 'Audit apostille'
        });

};

export default AuditApostilleConfig;