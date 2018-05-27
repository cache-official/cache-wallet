function EditMultisigConfig($stateProvider) {
    'ngInject';

    $stateProvider
        .state('app.editMultisig', {
            url: '/edit-multisignature-contract',
            controller: 'EditMultisigCtrl',
            controllerAs: '$ctrl',
            templateUrl: 'modules/multisignature/edit/editMultisig.html',
            title: 'Edit a multisignature contract'
        });

};

export default EditMultisigConfig;