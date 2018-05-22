import angular from 'angular';

// Create the module where our functionality can attach to
let trezorModule = angular.module('app.trezor', []);

// Include our UI-Router config settings
import trezorConfig from './trezor.config';
trezorModule.config(trezorConfig);

// Controllers
import TrezorCtrl from './trezor.controller';
trezorModule.controller('TrezorCtrl', TrezorCtrl);

// Services
import TrezorService from './trezor.service';
trezorModule.service('Trezor', TrezorService);

export default trezorModule;
