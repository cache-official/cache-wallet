function AppConfig($stateProvider, $localStorageProvider, $locationProvider, $urlRouterProvider, ngToastProvider, $translateProvider) {
    'ngInject';

    /*
     *  If you don't want hashbang routing, uncomment this line.
     */
    // $locationProvider.html5Mode(true);

    // Define the main state
    $stateProvider
        .state('app', {
            abstract: true,
            templateUrl: 'layout/app-view.html'
        });

    // Redirect to home if unknown route
    $urlRouterProvider.otherwise('/');

    // Alerts configuration
    ngToastProvider.configure({
        animation: 'fade'
    });

    // Define prefered language, english by default
    $translateProvider.preferredLanguage($localStorageProvider.get('lang') || 'en');

    // Languages sanitization strategy
    $translateProvider.useSanitizeValueStrategy('sanitizeParameters');

}

export default AppConfig;