function SignMultisigConfig($stateProvider) {
    'ngInject';

    $stateProvider
        .state('app.signMultisig', {
            url: '/sign-multisignature-transactions',
            controller: 'SignMultisigCtrl',
            controllerAs: '$ctrl',
            templateUrl: 'modules/multisignature/sign/sign.html',
            title: 'Sign multisignature transactions'
        });

};

export default SignMultisigConfig;