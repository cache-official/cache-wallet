import angular from 'angular';

// Create the module where our functionality can attach to
let namespacesModule = angular.module('app.namespaces', []);

// Include our UI-Router config settings
import NamespacesConfig from './create/namespaces.config';
namespacesModule.config(NamespacesConfig);

// Controllers
import NamespacesCtrl from './create/namespaces.controller';
namespacesModule.controller('NamespacesCtrl', NamespacesCtrl);

// Create the module where our functionality can attach to
let renewNamespacesModule = angular.module('app.renewNamespaces', []);

// Include our UI-Router config settings
import RenewNamespacesConfig from './renew/renew.config';
renewNamespacesModule.config(RenewNamespacesConfig);

// Controllers
import RenewNamespacesCtrl from './renew/renew.controller';
renewNamespacesModule.controller('RenewNamespacesCtrl', RenewNamespacesCtrl);

export default namespacesModule;
