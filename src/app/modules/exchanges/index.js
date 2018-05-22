import angular from 'angular';

// Create the module where our functionality can attach to
let ChangellyModule = angular.module('app.changelly', []);

// Include our UI-Router config settings
import ChangellyConfig from './changelly/changelly.config';
ChangellyModule.config(ChangellyConfig);

// Controllers
import ChangellyCtrl from './changelly/changelly.controller';
ChangellyModule.controller('ChangellyCtrl', ChangellyCtrl);

// Create the module where our functionality can attach to
let ShapeshiftModule = angular.module('app.shapeshift', []);

// Include our UI-Router config settings
import ShapeshiftConfig from './shapeshift/shapeshift.config';
ShapeshiftModule.config(ShapeshiftConfig);

// Controllers
import ShapeshiftCtrl from './shapeshift/shapeshift.controller';
ShapeshiftModule.controller('ShapeshiftCtrl', ShapeshiftCtrl);

export default ChangellyModule;