function CreateMosaicConfig($stateProvider) {
    'ngInject';

    $stateProvider
        .state('app.createMosaic', {
            url: '/create-mosaic',
            controller: 'CreateMosaicCtrl',
            controllerAs: '$ctrl',
            templateUrl: 'modules/mosaics/create/createMosaic.html',
            title: 'Create a mosaic'
        });

};

export default CreateMosaicConfig;