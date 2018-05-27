function FAQConfig($stateProvider) {
    'ngInject';

    $stateProvider
        .state('app.faq', {
            url: '/help',
            controller: 'FAQCtrl',
            controllerAs: '$ctrl',
            templateUrl: 'modules/faq/faq.html',
            title: 'FAQ'
        });

};

export default FAQConfig;