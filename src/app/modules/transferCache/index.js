import angular from 'angular';

// Create the module where our functionality can attach to
let transferCacheModule = angular.module('app.transferCache', []);

// Include our UI-Router config settings
import TransferCacheConfig from './transferCache.config';
transferCacheModule.config(TransferCacheConfig);

// Controllers
import TransferCacheCtrl from './transferCache.controller';
transferCacheModule.controller('TransferCacheCtrl', TransferCacheCtrl);

export default transferCacheModule;