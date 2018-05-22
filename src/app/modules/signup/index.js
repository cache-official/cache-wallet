import angular from 'angular';

// Create the module where our functionality can attach to
let signupModule = angular.module('app.signup', []);

// Include our UI-Router config settings
import SignupConfig from './signup.config';
signupModule.config(SignupConfig);

// Controllers
import SignupCtrl from './signup.controller';
signupModule.controller('SignupCtrl', SignupCtrl);

export default signupModule;
