function AddressBookConfig($stateProvider) {
    'ngInject';

    $stateProvider
        .state('app.addressBook', {
            url: '/address-book',
            controller: 'AddressBookCtrl', 
            controllerAs: '$ctrl',
            templateUrl: 'modules/addressBook/addressBook.html',
            title: 'Address book'
        });

};

export default AddressBookConfig;