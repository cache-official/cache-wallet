import angular from 'angular';

// Create the module where our functionality can attach to
let createMultisigModule = angular.module('app.createMultisig', []);

// Include our UI-Router config settings
import CreateMultisigConfig from './create/createMultisig.config';
createMultisigModule.config(CreateMultisigConfig);

// Controllers
import CreateMultisigCtrl from './create/createMultisig.controller';
createMultisigModule.controller('CreateMultisigCtrl', CreateMultisigCtrl);

// Create the module where our functionality can attach to
let editMultisigModule = angular.module('app.editMultisig', []);

// Include our UI-Router config settings
import EditMultisigConfig from './edit/editMultisig.config';
editMultisigModule.config(EditMultisigConfig);

// Controllers
import EditMultisigCtrl from './edit/editMultisig.controller';
editMultisigModule.controller('EditMultisigCtrl', EditMultisigCtrl);

// Create the module where our functionality can attach to
let signMultisigModule = angular.module('app.signMultisig', []);

// Include our UI-Router config settings
import SignMultisigConfig from './sign/sign.config';
signMultisigModule.config(SignMultisigConfig);

// Controllers
import SignMultisigCtrl from './sign/sign.controller';
signMultisigModule.controller('SignMultisigCtrl', SignMultisigCtrl);

export default createMultisigModule;
