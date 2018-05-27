import angular from 'angular';

// Create the module where our functionality can attach to
let portalModule = angular.module('app.portal', []);

// Include our UI-Router config settings
import PortalConfig from './portal.config';
portalModule.config(PortalConfig);

// Controllers
import PortalCtrl from './portal.controller';
portalModule.controller('PortalCtrl', PortalCtrl);

export default portalModule;
