import angular from 'angular';

// Create the module where our functionality can attach to
let accountModule = angular.module('app.account', []);

// Include our UI-Router config settings
import AccountConfig from './account.config';
accountModule.config(AccountConfig);

// Controllers
import AccountCtrl from './account.controller';
accountModule.controller('AccountCtrl', AccountCtrl);

export default accountModule;
