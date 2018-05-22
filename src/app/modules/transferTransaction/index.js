import angular from 'angular';

// Create the module where our functionality can attach to
let transferTransactionModule = angular.module('app.transferTransaction', []);

// Include our UI-Router config settings
import TransferTransactionConfig from './transferTransaction.config';
transferTransactionModule.config(TransferTransactionConfig);

// Controllers
import TransferTransactionCtrl from './transferTransaction.controller';
transferTransactionModule.controller('TransferTransactionCtrl', TransferTransactionCtrl);

export default transferTransactionModule;
