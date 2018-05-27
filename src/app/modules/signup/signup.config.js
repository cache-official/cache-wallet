function SignupConfig($stateProvider) {
    'ngInject';

    $stateProvider
        .state('app.signup', {
            url: '/signup',
            controller: 'SignupCtrl',
            controllerAs: '$ctrl',
            templateUrl: 'modules/signup/signup.html',
            title: 'Signup'
        });

};

export default SignupConfig;