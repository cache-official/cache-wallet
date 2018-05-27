import angular from 'angular';

// Create the module where our functionality can attach to
let dashboardModule = angular.module('app.dashboard', []);

// Include our UI-Router config settings
import DashboardConfig from './dashboard.config';
dashboardModule.config(DashboardConfig);

// Controllers
import DashboardCtrl from './dashboard.controller';
dashboardModule.controller('DashboardCtrl', DashboardCtrl);


export default dashboardModule;
