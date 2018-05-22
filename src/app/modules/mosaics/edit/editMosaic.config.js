function EditMosaicConfig($stateProvider) {
    'ngInject';

    $stateProvider
        .state('app.editMosaic', {
            url: '/edit-mosaic',
            controller: 'EditMosaicCtrl',
            controllerAs: '$ctrl',
            templateUrl: 'modules/mosaics/edit/editMosaic.html',
            title: 'Edit a mosaic'
        });

};

export default EditMosaicConfig;