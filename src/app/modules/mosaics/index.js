import angular from 'angular';

// Create the module where our functionality can attach to
let createMosaicModule = angular.module('app.createMosaic', []);

// Include our UI-Router config settings
import CreateMosaicConfig from './create/createMosaic.config';
createMosaicModule.config(CreateMosaicConfig);

// Controllers
import CreateMosaicCtrl from './create/createMosaic.controller';
createMosaicModule.controller('CreateMosaicCtrl', CreateMosaicCtrl);

// Create the module where our functionality can attach to
let editMosaicModule = angular.module('app.editMosaic', []);

// Include our UI-Router config settings
import EditMosaicConfig from './edit/editMosaic.config';
editMosaicModule.config(EditMosaicConfig);

// Controllers
import EditMosaicCtrl from './edit/editMosaic.controller';
editMosaicModule.controller('EditMosaicCtrl', EditMosaicCtrl);

export default createMosaicModule;
