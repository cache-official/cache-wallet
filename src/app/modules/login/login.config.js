function LoginConfig($stateProvider) {
    'ngInject';

    $stateProvider
        .state('app.login', {
            url: '/login',
            controller: 'LoginCtrl',
            controllerAs: '$ctrl',
            templateUrl: 'modules/login/login.html',
            title: 'Login'
        });

};

export default LoginConfig;