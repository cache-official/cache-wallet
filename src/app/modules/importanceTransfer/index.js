import angular from 'angular';

// Create the module where our functionality can attach to
let importanceTransferModule = angular.module('app.importanceTransfer', []);

// Include our UI-Router config settings
import ImportanceTransferConfig from './normal/importanceTransfer.config';
importanceTransferModule.config(ImportanceTransferConfig);

// Controllers
import ImportanceTransferCtrl from './normal/importanceTransfer.controller';
importanceTransferModule.controller('ImportanceTransferCtrl', ImportanceTransferCtrl);

// Create the module where our functionality can attach to
let multisigImportanceTransferModule = angular.module('app.multisigImportanceTransfer', []);

// Include our UI-Router config settings
import MultisigImportanceTransferConfig from './multisig/importanceTransfer.config';
multisigImportanceTransferModule.config(MultisigImportanceTransferConfig);

// Controllers
import MultisigImportanceTransferCtrl from './multisig/importanceTransfer.controller';
multisigImportanceTransferModule.controller('MultisigImportanceTransferCtrl', MultisigImportanceTransferCtrl);

export default importanceTransferModule;
